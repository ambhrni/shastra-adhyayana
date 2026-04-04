-- ============================================================
-- Migration: Argument Map Schema
-- Date: 2026-04-03
-- Tables: argument_nodes, argument_node_links, argument_map_versions
-- ============================================================

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- No existing moddatetime extension in this project.
-- This is the first updated_at trigger; define the function here.
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ARGUMENT NODES
-- One row per logical node in an argument map for a passage.
-- parent_node_id builds a tree; argument_node_links handles DAG edges.
-- stream scopes nodes to mūla, bhāvadīpikā, or vādāvalīprakāśa.
-- ============================================================
CREATE TABLE argument_nodes (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  passage_id       UUID        NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  stream           TEXT        NOT NULL CHECK (stream IN (
                     'mula', 'bhavadipika', 'vadavaliprakasha'
                   )),
  node_type        TEXT        NOT NULL CHECK (node_type IN (
                     'purva_paksha', 'khandana', 'siddhanta',
                     'upasamhara', 'shanka', 'samadhanam'
                   )),
  content_english  TEXT        NOT NULL,
  content_sanskrit TEXT,
  logical_flaw     TEXT,
  refutation_type  TEXT        CHECK (refutation_type IN (
                     'lakshanam', 'pramanam', 'anumanam', 'siddhanta'
                   )),
  parent_node_id   UUID        REFERENCES argument_nodes(id) ON DELETE CASCADE,
  display_order    INTEGER     NOT NULL DEFAULT 0,
  is_approved      BOOLEAN     NOT NULL DEFAULT false,
  ai_generated     BOOLEAN     NOT NULL DEFAULT true,
  ai_model         TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_argument_nodes_updated_at
  BEFORE UPDATE ON argument_nodes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- ARGUMENT NODE LINKS
-- DAG-style cross-links between nodes (beyond the parent tree).
-- Unique constraint prevents duplicate directed edges.
-- ============================================================
CREATE TABLE argument_node_links (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  from_node_id UUID        NOT NULL REFERENCES argument_nodes(id) ON DELETE CASCADE,
  to_node_id   UUID        NOT NULL REFERENCES argument_nodes(id) ON DELETE CASCADE,
  link_type    TEXT        NOT NULL CHECK (link_type IN (
                 'leads_to', 'depends_on', 'contradicts'
               )),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (from_node_id, to_node_id, link_type)
);

-- ============================================================
-- ARGUMENT MAP VERSIONS
-- Snapshot of a full argument map at a point in time.
-- Only one row per (passage_id, stream) should have is_current = true.
-- ============================================================
CREATE TABLE argument_map_versions (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  passage_id     UUID        NOT NULL REFERENCES passages(id) ON DELETE CASCADE,
  stream         TEXT        NOT NULL CHECK (stream IN (
                   'mula', 'bhavadipika', 'vadavaliprakasha'
                 )),
  version_number INTEGER     NOT NULL,
  ai_model       TEXT,
  nodes_json     JSONB       NOT NULL,
  is_current     BOOLEAN     NOT NULL DEFAULT false,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (passage_id, stream, version_number)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- Follows project pattern:
--   anon       → approved/current content only
--   learner    → same as anon (approved/current)
--   curator    → all content including unapproved drafts
--   admin      → full write via curator_write policies
-- Read and write policies are separate; RLS ORs them together.
-- Write policies use current_user_role() helper from schema.sql.
-- ============================================================
ALTER TABLE argument_nodes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE argument_node_links   ENABLE ROW LEVEL SECURITY;
ALTER TABLE argument_map_versions ENABLE ROW LEVEL SECURITY;

-- ---- argument_nodes ----

-- Anon: approved nodes only
CREATE POLICY "arg_nodes_anon_read" ON argument_nodes
  FOR SELECT TO anon
  USING (is_approved = true);

-- Authenticated: approved only for learners; all for curator/admin
CREATE POLICY "arg_nodes_auth_read" ON argument_nodes
  FOR SELECT TO authenticated
  USING (is_approved = true OR current_user_role() IN ('curator', 'admin'));

-- Curator/admin: full write (INSERT, UPDATE, DELETE)
CREATE POLICY "arg_nodes_curator_write" ON argument_nodes
  FOR ALL TO authenticated
  WITH CHECK (current_user_role() IN ('curator', 'admin'));

-- ---- argument_node_links ----

-- Anon: only links where both endpoint nodes are approved
-- (prevents leaking unapproved node IDs via link edges)
CREATE POLICY "arg_links_anon_read" ON argument_node_links
  FOR SELECT TO anon
  USING (
    EXISTS (SELECT 1 FROM argument_nodes WHERE id = from_node_id AND is_approved = true)
    AND
    EXISTS (SELECT 1 FROM argument_nodes WHERE id = to_node_id   AND is_approved = true)
  );

-- Authenticated: curators see all links; learners see approved-only
CREATE POLICY "arg_links_auth_read" ON argument_node_links
  FOR SELECT TO authenticated
  USING (
    current_user_role() IN ('curator', 'admin')
    OR (
      EXISTS (SELECT 1 FROM argument_nodes WHERE id = from_node_id AND is_approved = true)
      AND
      EXISTS (SELECT 1 FROM argument_nodes WHERE id = to_node_id   AND is_approved = true)
    )
  );

-- Curator/admin: full write
CREATE POLICY "arg_links_curator_write" ON argument_node_links
  FOR ALL TO authenticated
  WITH CHECK (current_user_role() IN ('curator', 'admin'));

-- ---- argument_map_versions ----

-- Anon: current versions only (no draft snapshots exposed)
CREATE POLICY "arg_versions_anon_read" ON argument_map_versions
  FOR SELECT TO anon
  USING (is_current = true);

-- Authenticated: current only for learners; all versions for curator/admin
CREATE POLICY "arg_versions_auth_read" ON argument_map_versions
  FOR SELECT TO authenticated
  USING (is_current = true OR current_user_role() IN ('curator', 'admin'));

-- Curator/admin: full write
CREATE POLICY "arg_versions_curator_write" ON argument_map_versions
  FOR ALL TO authenticated
  WITH CHECK (current_user_role() IN ('curator', 'admin'));

-- ============================================================
-- INDEXES
-- ============================================================

-- Primary query path: fetch all nodes for a passage + stream
CREATE INDEX ON argument_nodes (passage_id, stream, is_approved);

-- Tree traversal: find children by parent
CREATE INDEX ON argument_nodes (parent_node_id);

-- Link traversal: outgoing and incoming edges
CREATE INDEX ON argument_node_links (from_node_id);
CREATE INDEX ON argument_node_links (to_node_id);

-- Version lookup: find current version for a passage + stream
CREATE INDEX ON argument_map_versions (passage_id, stream, version_number);
CREATE INDEX ON argument_map_versions (passage_id, stream, is_current);
