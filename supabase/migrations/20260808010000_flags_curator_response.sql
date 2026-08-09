-- ============================================================
-- Migration: curator_response + user-visibility for flags
-- Date: 2026-08-08
--
-- Closes the "curator can mark resolved but the reporting user never finds
-- out" gap. Adds a response field to both flag tables, and lets users read
-- (only) their own submitted flags -- previously only curator/admin could
-- SELECT from either table at all.
-- ============================================================

ALTER TABLE flagged_errors      ADD COLUMN IF NOT EXISTS curator_response TEXT;
ALTER TABLE argument_map_flags  ADD COLUMN IF NOT EXISTS curator_response TEXT;

COMMENT ON COLUMN flagged_errors.curator_response IS
  'Curator''s reply to the user who submitted this flag -- resolution note or a clarifying question. Shown to the submitter on /my-reports.';
COMMENT ON COLUMN argument_map_flags.curator_response IS
  'Curator''s reply to the user who submitted this flag -- resolution note or a clarifying question. Shown to the submitter on /my-reports.';

-- flagged_errors uses "flagged_by" for the submitting user (per app/api/flags/route.ts)
CREATE POLICY "Users can read own flagged errors"
  ON flagged_errors FOR SELECT
  USING (flagged_by = auth.uid());

-- argument_map_flags uses "user_id" for the submitting user
CREATE POLICY "Users can read own argument map flags"
  ON argument_map_flags FOR SELECT
  USING (user_id = auth.uid());
