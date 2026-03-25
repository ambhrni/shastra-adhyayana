-- ============================================================
-- shastra-adhyayana — Supabase Database Schema
-- Version: 1.0
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

-- note_type: fixed vocabulary for passage notes.
-- MIGRATION NOTE: To add a new note type, a curator submits a
-- request to the admin, who runs:
--   ALTER TYPE note_type ADD VALUE 'new_value';
-- Important: VALUES can be added but not removed without a full
-- enum rebuild (requires data migration). Plan new types carefully.
CREATE TYPE note_type AS ENUM (
  'nyaya_concept',
  'curator_note',
  'guru_note',
  'technical_grammar'
);

-- progress_status: "studied" is auto-set on first passage visit.
-- "reviewed" and "mastered" are set manually by the learner.
CREATE TYPE progress_status AS ENUM (
  'not_started',
  'studied',
  'reviewed',
  'mastered'
);

-- user_role: default is "learner" on registration.
-- Admin is set manually in Supabase after first deploy.
CREATE TYPE user_role AS ENUM (
  'learner',
  'curator',
  'admin'
);

-- ============================================================
-- LOGICAL ARGUMENT TYPES
-- Admin-managed lookup table. Curators select from this list
-- when tagging passages. Admin inserts new rows to add types —
-- no schema migration required. Each text can use a subset.
-- ============================================================
CREATE TABLE logical_argument_types (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  code        TEXT        UNIQUE NOT NULL,       -- e.g. 'purva-paksha' (stable identifier)
  label_english   TEXT    NOT NULL,              -- e.g. 'Prior Position'
  label_sanskrit  TEXT,                          -- e.g. 'पूर्वपक्ष'
  description     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed: initial argument types for vādāvalī
INSERT INTO logical_argument_types (code, label_english, label_sanskrit, description) VALUES
  ('purva-paksha',   'Prior Position',                   'पूर्वपक्ष',    'The opponent''s thesis being examined'),
  ('siddhanta',      'Established Conclusion',            'सिद्धान्त',   'The author''s accepted position'),
  ('khanda',         'Refutation',                        'खण्डन',       'Dismantling the prior position'),
  ('vyapti',         'Pervasion',                         'व्याप्ति',    'Statement of invariable concomitance'),
  ('vyapti-siddhi',  'Proof of Pervasion',                'व्याप्तिसिद्धि', 'Establishing the vyāpti'),
  ('hetu',           'Reason / Probans',                  'हेतु',        'The logical reason in an inference'),
  ('sadhya',         'Probandum',                         'साध्य',       'What is to be proved'),
  ('dristanta',      'Example',                           'दृष्टान्त',   'Illustrative example supporting the inference'),
  ('upanaya',        'Application',                       'उपनय',        'Applying the general rule to the specific case'),
  ('nigamana',       'Conclusion',                        'निगमन',       'Final conclusion of the syllogism'),
  ('paksha',         'Subject / Minor Term',              'पक्ष',        'The subject of the inference');

-- ============================================================
-- TEXTS
-- One row per śāstra text. Adding a new text = insert here +
-- run ingestion script. No schema changes needed.
-- ============================================================
CREATE TABLE texts (
  id                   UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                TEXT        NOT NULL,   -- Sanskrit Devanāgarī
  title_transliterated TEXT        NOT NULL,   -- IAST transliteration
  author               TEXT,
  description          TEXT,
  is_published         BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COMMENTATORS
-- Separate from texts so a commentator can appear across
-- multiple texts (e.g. Rāghavendra Tīrtha on multiple works).
-- ============================================================
CREATE TABLE commentators (
  id                   UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                 TEXT        NOT NULL,   -- Display name exactly as shown in UI
  name_transliterated  TEXT        NOT NULL,
  period               TEXT,                   -- e.g. '17th century'
  description          TEXT,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Seed: commentators for vādāvalī
INSERT INTO commentators (name, name_transliterated, period, description) VALUES
  ('Rāghavendra Tīrtha', 'Raghavendra Tirtha', '17th century',
   'Dvaita Vedānta scholar, pontiff of Uttarādi Maṭha, author of Tātparyacandrikā'),
  ('Śrīnivāsa Tīrtha',   'Shrinivasa Tirtha',  '17th century',
   'Dvaita Vedānta commentator on vādāvalī');

-- ============================================================
-- TEXT–COMMENTATOR MAPPING
-- Links which commentators apply to which text, with display
-- order (controls tab order in Study Mode).
-- ============================================================
CREATE TABLE text_commentators (
  text_id         UUID    NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
  commentator_id  UUID    NOT NULL REFERENCES commentators(id) ON DELETE CASCADE,
  order_index     INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (text_id, commentator_id)
);

-- ============================================================
-- PASSAGES
-- Core content unit. Works for any text — text_id scopes all
-- queries. logical_argument_type_id references the lookup table.
-- ============================================================
CREATE TABLE passages (
  id                          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  text_id                     UUID        NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
  section_number              INTEGER,
  subsection_number           INTEGER,
  mula_text                   TEXT        NOT NULL,   -- Sanskrit Devanāgarī
  mula_transliterated         TEXT,                   -- IAST
  sequence_order              INTEGER     NOT NULL,   -- ordering within text; no gaps required
  logical_argument_type_id    UUID        REFERENCES logical_argument_types(id),
  is_approved                 BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at                  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_passages_text_id       ON passages(text_id);
CREATE INDEX idx_passages_sequence      ON passages(text_id, sequence_order);
CREATE INDEX idx_passages_approved      ON passages(text_id, is_approved);

-- ============================================================
-- COMMENTARIES
-- One row per (passage, commentator) pair. UNIQUE constraint
-- prevents duplicate commentaries for the same passage+commentator.
-- ============================================================
CREATE TABLE commentaries (
  id                       UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  passage_id               UUID    NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  commentator_id           UUID    NOT NULL REFERENCES commentators(id) ON DELETE CASCADE,
  commentary_text          TEXT,   -- Sanskrit Devanāgarī (nullable: may be absent for some passages)
  commentary_transliterated TEXT,  -- IAST
  is_approved              BOOLEAN NOT NULL DEFAULT FALSE,
  created_at               TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (passage_id, commentator_id)
);

CREATE INDEX idx_commentaries_passage ON commentaries(passage_id);

-- ============================================================
-- PASSAGE NOTES
-- note_type is a SQL enum. To add a new type:
--   ALTER TYPE note_type ADD VALUE 'new_value';
-- Curators request new types from admin. See enum definition above.
-- ============================================================
CREATE TABLE passage_notes (
  id                      UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  passage_id              UUID        NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  note_text               TEXT        NOT NULL,
  note_type               note_type   NOT NULL,
  created_by              UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  is_visible_to_learners  BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_passage_notes_passage ON passage_notes(passage_id);

-- ============================================================
-- NYĀYA CONCEPTS
-- Text-agnostic glossary. Linked to passages via passage_nyaya_links.
-- difficulty_level: 1 = introductory, 5 = advanced
-- ============================================================
CREATE TABLE nyaya_concepts (
  id                    UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  term_sanskrit         TEXT    NOT NULL,   -- Devanāgarī
  term_transliterated   TEXT    NOT NULL,   -- IAST
  definition_english    TEXT    NOT NULL,
  definition_sanskrit   TEXT,
  example_text          TEXT,
  difficulty_level      INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PASSAGE–NYĀYA CONCEPT LINKS
-- Many-to-many. Curators link concepts to passages in the portal.
-- ============================================================
CREATE TABLE passage_nyaya_links (
  passage_id       UUID NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  nyaya_concept_id UUID NOT NULL REFERENCES nyaya_concepts(id) ON DELETE CASCADE,
  PRIMARY KEY (passage_id, nyaya_concept_id)
);

-- ============================================================
-- USER PROFILES (extends Supabase auth.users)
-- id mirrors auth.users.id. Role defaults to "learner".
-- Admin promotes users manually via Supabase dashboard or SQL.
-- ============================================================
CREATE TABLE user_profiles (
  id            UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name  TEXT        NOT NULL,
  role          user_role   NOT NULL DEFAULT 'learner',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  last_active   TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: auto-create profile row when a new auth user registers
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- USER PROGRESS
-- "studied" is set automatically on first passage visit (app logic).
-- "reviewed" and "mastered" are set manually by the learner.
-- UNIQUE (user_id, passage_id) — one progress row per passage per user.
-- ============================================================
CREATE TABLE user_progress (
  id              UUID            PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID            NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text_id         UUID            NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
  passage_id      UUID            NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  status          progress_status NOT NULL DEFAULT 'not_started',
  study_count     INTEGER         NOT NULL DEFAULT 0,
  last_studied_at TIMESTAMPTZ,
  notes           TEXT,
  UNIQUE (user_id, passage_id)
);

CREATE INDEX idx_user_progress_user     ON user_progress(user_id);
CREATE INDEX idx_user_progress_text     ON user_progress(user_id, text_id);
CREATE INDEX idx_user_progress_passage  ON user_progress(user_id, passage_id);

-- ============================================================
-- TUTOR SESSIONS
-- messages: JSONB array of { role: "user"|"assistant", content: string, timestamp: ISO8601 }
-- Unlimited messages per session. session_end is null until user
-- explicitly closes or navigates away.
-- ============================================================
CREATE TABLE tutor_sessions (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  passage_id    UUID        NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  messages      JSONB       NOT NULL DEFAULT '[]'::jsonb,
  session_start TIMESTAMPTZ DEFAULT NOW(),
  session_end   TIMESTAMPTZ
);

CREATE INDEX idx_tutor_sessions_user    ON tutor_sessions(user_id);
CREATE INDEX idx_tutor_sessions_passage ON tutor_sessions(user_id, passage_id);

-- ============================================================
-- PARĪKṢĀ SESSIONS
-- passage_id is NULL for full-text exam, set for passage-specific.
-- questions_asked / answers_given: JSONB arrays of { question, answer, feedback, scores }
-- Scores are per-answer aggregated into session-level scores at end.
-- ============================================================
CREATE TABLE pariksha_sessions (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text_id          UUID        NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
  passage_id       UUID        REFERENCES passages(id) ON DELETE SET NULL,  -- NULL = full-text
  questions_asked  JSONB       NOT NULL DEFAULT '[]'::jsonb,
  answers_given    JSONB       NOT NULL DEFAULT '[]'::jsonb,
  score_philosophy NUMERIC(4,1) CHECK (score_philosophy BETWEEN 0 AND 10),
  score_sanskrit   NUMERIC(4,1) CHECK (score_sanskrit BETWEEN 0 AND 10),
  ai_feedback_text TEXT,
  session_date     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pariksha_sessions_user ON pariksha_sessions(user_id);
CREATE INDEX idx_pariksha_sessions_text ON pariksha_sessions(user_id, text_id);

-- ============================================================
-- FLAGGED ERRORS
-- Learners flag OCR errors in mūla (commentator_id = NULL) or
-- in a specific commentary (commentator_id = that commentator).
-- Curators review and resolve/dismiss flags.
-- ============================================================

CREATE TYPE flag_status AS ENUM ('open', 'resolved', 'dismissed');

CREATE TABLE flagged_errors (
  id                   UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  passage_id           UUID        NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  commentator_id       UUID        REFERENCES commentators(id) ON DELETE SET NULL,  -- NULL = flag on mūla
  flagged_by           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description_of_error TEXT        NOT NULL,
  status               flag_status NOT NULL DEFAULT 'open',
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  resolved_at          TIMESTAMPTZ,
  resolved_by          UUID        REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX idx_flagged_errors_passage  ON flagged_errors(passage_id);
CREATE INDEX idx_flagged_errors_status   ON flagged_errors(status);
CREATE INDEX idx_flagged_errors_flagged_by ON flagged_errors(flagged_by);

-- ============================================================
-- STUDY STREAKS
-- One row per user. Updated atomically each time a passage is
-- marked as studied. current_streak resets to 0 if last_study_date
-- is more than 1 day ago; longest_streak never decreases.
-- ============================================================

CREATE TABLE study_streaks (
  id              UUID  PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID  NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak  INTEGER NOT NULL DEFAULT 0,
  longest_streak  INTEGER NOT NULL DEFAULT 0,
  last_study_date DATE
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- All tables use RLS. Policies follow these rules:
--   Learners: own data + approved/published content only
--   Curators: own data + all content (approved or not) + write content
--   Admins:   everything
-- ============================================================

ALTER TABLE flagged_errors          ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_streaks           ENABLE ROW LEVEL SECURITY;
ALTER TABLE texts                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE commentators           ENABLE ROW LEVEL SECURITY;
ALTER TABLE text_commentators      ENABLE ROW LEVEL SECURITY;
ALTER TABLE logical_argument_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE passages               ENABLE ROW LEVEL SECURITY;
ALTER TABLE commentaries           ENABLE ROW LEVEL SECURITY;
ALTER TABLE passage_notes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE nyaya_concepts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE passage_nyaya_links    ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress          ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_sessions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE pariksha_sessions      ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user's role (avoids subquery repetition)
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ---- texts ----
CREATE POLICY "texts_learner_published" ON texts
  FOR SELECT TO authenticated
  USING (is_published = TRUE OR current_user_role() IN ('curator', 'admin'));

CREATE POLICY "texts_admin_write" ON texts
  FOR ALL TO authenticated
  WITH CHECK (current_user_role() = 'admin');

-- ---- commentators (read-only for all authenticated) ----
CREATE POLICY "commentators_read_all" ON commentators
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "commentators_admin_write" ON commentators
  FOR ALL TO authenticated
  WITH CHECK (current_user_role() = 'admin');

-- ---- text_commentators (read-only for all authenticated) ----
CREATE POLICY "text_commentators_read_all" ON text_commentators
  FOR SELECT TO authenticated USING (TRUE);

-- ---- logical_argument_types (read all; admin writes) ----
CREATE POLICY "arg_types_read_all" ON logical_argument_types
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "arg_types_admin_write" ON logical_argument_types
  FOR ALL TO authenticated
  WITH CHECK (current_user_role() = 'admin');

-- ---- passages ----
CREATE POLICY "passages_read" ON passages
  FOR SELECT TO authenticated
  USING (is_approved = TRUE OR current_user_role() IN ('curator', 'admin'));

CREATE POLICY "passages_curator_write" ON passages
  FOR ALL TO authenticated
  WITH CHECK (current_user_role() IN ('curator', 'admin'));

-- ---- commentaries ----
CREATE POLICY "commentaries_read" ON commentaries
  FOR SELECT TO authenticated
  USING (is_approved = TRUE OR current_user_role() IN ('curator', 'admin'));

CREATE POLICY "commentaries_curator_write" ON commentaries
  FOR ALL TO authenticated
  WITH CHECK (current_user_role() IN ('curator', 'admin'));

-- ---- passage_notes ----
CREATE POLICY "notes_read" ON passage_notes
  FOR SELECT TO authenticated
  USING (is_visible_to_learners = TRUE OR current_user_role() IN ('curator', 'admin'));

CREATE POLICY "notes_curator_write" ON passage_notes
  FOR ALL TO authenticated
  WITH CHECK (current_user_role() IN ('curator', 'admin'));

-- ---- nyaya_concepts (read all; curator+ writes) ----
CREATE POLICY "nyaya_read_all" ON nyaya_concepts
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "nyaya_curator_write" ON nyaya_concepts
  FOR ALL TO authenticated
  WITH CHECK (current_user_role() IN ('curator', 'admin'));

-- ---- passage_nyaya_links (read all; curator+ writes) ----
CREATE POLICY "nyaya_links_read_all" ON passage_nyaya_links
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "nyaya_links_curator_write" ON passage_nyaya_links
  FOR ALL TO authenticated
  WITH CHECK (current_user_role() IN ('curator', 'admin'));

-- ---- user_profiles ----
CREATE POLICY "profiles_read_own_or_admin" ON user_profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR current_user_role() = 'admin');

CREATE POLICY "profiles_update_own" ON user_profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    -- Learners cannot promote their own role; only admin can change role
    AND (role = (SELECT role FROM user_profiles WHERE id = auth.uid()) OR current_user_role() = 'admin')
  );

CREATE POLICY "profiles_insert_self" ON user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- ---- user_progress (own rows only) ----
CREATE POLICY "progress_own" ON user_progress
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---- tutor_sessions (own rows only) ----
CREATE POLICY "tutor_own" ON tutor_sessions
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---- pariksha_sessions (own rows only) ----
CREATE POLICY "pariksha_own" ON pariksha_sessions
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ---- flagged_errors ----
-- Learners: insert + view own; curators: view all + update status
CREATE POLICY "flags_insert_learner" ON flagged_errors
  FOR INSERT TO authenticated
  WITH CHECK (flagged_by = auth.uid());

CREATE POLICY "flags_select" ON flagged_errors
  FOR SELECT TO authenticated
  USING (flagged_by = auth.uid() OR current_user_role() IN ('curator', 'admin'));

CREATE POLICY "flags_update_curator" ON flagged_errors
  FOR UPDATE TO authenticated
  USING (current_user_role() IN ('curator', 'admin'));

-- ---- study_streaks (own row only) ----
CREATE POLICY "streaks_own" ON study_streaks
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
