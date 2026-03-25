-- fix-commentaries.sql
-- One-time cleanup: deletes all passages and commentaries for the
-- vādāvalī text so the ingestion script can be re-run cleanly.
--
-- HOW TO RUN:
--   1. Open the Supabase SQL Editor for your project.
--   2. Paste and run the first query below to verify the text_id.
--   3. Paste and run the DELETE block to clear the data.
--   4. Re-run: npx ts-node --project tsconfig.scripts.json
--              scripts/ingest-text.ts --file <path> --text-id <uuid>
--
-- ⚠  This is destructive. It cannot be undone.
--    Do NOT run this after you have begun approving passages in production.
-- ----------------------------------------------------------------

-- Step 1: Confirm the text_id you are about to clear (run this first).
SELECT id, title_transliterated, is_published
FROM texts
WHERE title_transliterated = 'Vādāvalī';

-- ----------------------------------------------------------------
-- Step 2: Delete commentaries and passages for this text.
--
-- Commentaries reference passages (ON DELETE CASCADE), so deleting
-- passages removes their commentaries automatically.
-- Replace <YOUR_TEXT_ID> with the UUID from Step 1.
-- ----------------------------------------------------------------

-- Deletes all commentary rows for this text (via passage foreign key)
DELETE FROM commentaries
WHERE passage_id IN (
  SELECT id FROM passages WHERE text_id = '<YOUR_TEXT_ID>'
);

-- Deletes all passage rows for this text
DELETE FROM passages
WHERE text_id = '<YOUR_TEXT_ID>';

-- Verify: both counts should be 0 after running the above.
SELECT
  (SELECT COUNT(*) FROM passages    WHERE text_id = '<YOUR_TEXT_ID>') AS passages_remaining,
  (SELECT COUNT(*) FROM commentaries
   WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '<YOUR_TEXT_ID>'))
   AS commentaries_remaining;
