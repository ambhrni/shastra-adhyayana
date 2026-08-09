-- bhedojjivanam-v2-cleanup.sql
-- One-time cleanup: deletes ALL old bhedojjivanam data tied to the 36-passage
-- structure, so ingest-bhedojjivanam-v2.ts can seed the new 176-entry,
-- curator-reviewed segmentation cleanly.
--
-- REWRITTEN 2026-08-06 against the REAL schema (confirmed via
-- information_schema introspection, not the summary docs, which were wrong
-- on two points):
--   1. nyaya_concepts has NO passage_id column -- it links to passages via a
--      separate junction table `passage_nyaya_links`. Concepts are SHARED
--      across texts (this is exactly the "436 reused from vadavali" from the
--      docs) -- so we must delete only the LINKS for bhedojjivanam's old
--      passages, never the nyaya_concepts rows themselves or their
--      embeddings. Deleting the concepts would have silently broken
--      vadavali's own nyaya references.
--   2. Several tables reference passages.id directly that the original
--      version of this file didn't account for at all: argument_node_links
--      (via argument_nodes), flagged_errors, pariksha_sessions,
--      passage_notes, tutor_sessions, user_progress. bhedojjivanam is
--      unpublished so these are almost certainly empty, but Postgres will
--      block deleting a passages row if ANY of these still reference it --
--      included defensively; harmless if 0 rows.
--
-- HOW TO RUN: one block at a time, confirming each result before the next.
--   Step 1  -- confirm text_id and ALL current counts (read-only)
--   Step 2a -- argument_node_links, argument_map_flags, argument_map_versions,
--              argument_nodes (children of argument_nodes first)
--   Step 2b -- passage_nyaya_links ONLY (never nyaya_concepts/embeddings --
--              those are shared reference data, not bhedojjivanam-specific)
--   Step 2c -- flagged_errors, pariksha_sessions, passage_notes,
--              tutor_sessions, user_progress (defensive -- expect 0 rows)
--   Step 2d -- commentaries, passage_embeddings, section_links
--   Step 2e -- passages (parent, absolute last)
--   Step 3  -- verify -- ALL counts should be 0
--   Then:
--        npx ts-node --project tsconfig.scripts.json scripts/ingest-bhedojjivanam-v2.ts --dry-run
--        npx ts-node --project tsconfig.scripts.json scripts/ingest-bhedojjivanam-v2.ts
--
-- WARNING: Destructive, cannot be undone.
-- ----------------------------------------------------------------

-- ==================================================================
-- STEP 1: Confirm text_id and ALL current counts before deleting anything.
-- ==================================================================
SELECT id, title_transliterated, is_published
FROM texts
WHERE id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071';

SELECT
  (SELECT COUNT(*) FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071') AS passages_now,
  (SELECT COUNT(*) FROM commentaries
    WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071')
  ) AS commentaries_now,
  (SELECT COUNT(*) FROM passage_embeddings WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071') AS embeddings_now,
  (SELECT COUNT(*) FROM argument_nodes
    WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071')
  ) AS argument_nodes_now,
  (SELECT COUNT(*) FROM section_links WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071') AS section_links_now,
  (SELECT COUNT(*) FROM passage_nyaya_links
    WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071')
  ) AS nyaya_links_now,
  (SELECT COUNT(*) FROM flagged_errors
    WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071')
  ) AS flagged_errors_now,
  (SELECT COUNT(*) FROM pariksha_sessions
    WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071')
  ) AS pariksha_sessions_now,
  (SELECT COUNT(*) FROM passage_notes
    WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071')
  ) AS passage_notes_now,
  (SELECT COUNT(*) FROM tutor_sessions
    WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071')
  ) AS tutor_sessions_now,
  (SELECT COUNT(*) FROM user_progress
    WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071')
  ) AS user_progress_now;
-- Expect: passages_now~36, argument_nodes_now~532, section_links_now~63,
-- nyaya_links_now~somewhere around 130-566 (link rows, not concept rows).
-- The five "defensive" counts (flagged_errors..user_progress) should be 0,
-- since bhedojjivanam is unpublished -- if any are NOT 0, stop and tell me
-- before proceeding, since that means real usage data exists.

-- ==================================================================
-- STEP 2a: argument_node_links, argument_map_flags, argument_map_versions,
--          then argument_nodes itself (children before parent)
-- ==================================================================
DELETE FROM argument_node_links
WHERE from_node_id IN (
  SELECT id FROM argument_nodes
  WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071')
)
OR to_node_id IN (
  SELECT id FROM argument_nodes
  WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071')
);

DELETE FROM argument_map_flags
WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071';

DELETE FROM argument_map_versions
WHERE passage_id IN (
  SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071'
);

DELETE FROM argument_nodes
WHERE passage_id IN (
  SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071'
);

-- ==================================================================
-- STEP 2b: passage_nyaya_links ONLY. Do NOT delete nyaya_concepts or
-- nyaya_concept_embeddings -- those are shared reference data (concepts can
-- be linked from multiple texts' passages) and deleting them would corrupt
-- vadavali's own nyaya references too.
-- ==================================================================
DELETE FROM passage_nyaya_links
WHERE passage_id IN (
  SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071'
);

-- ==================================================================
-- STEP 2c: defensive -- user-generated data tied to passages. Expect 0 rows
-- affected given bhedojjivanam is unpublished; included so Step 2e (deleting
-- passages) can't fail on an unexpected foreign-key reference.
-- ==================================================================
DELETE FROM flagged_errors
WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071');

DELETE FROM pariksha_sessions
WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071');

DELETE FROM passage_notes
WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071');

DELETE FROM tutor_sessions
WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071');

DELETE FROM user_progress
WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071');

-- ==================================================================
-- STEP 2d: commentaries, passage_embeddings, section_links
-- ==================================================================
DELETE FROM commentaries
WHERE passage_id IN (
  SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071'
);

DELETE FROM passage_embeddings
WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071';

DELETE FROM section_links
WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071';

-- ==================================================================
-- STEP 2e: passages (parent, absolute last -- everything above must have
-- succeeded first, or this will fail with a foreign-key violation)
-- ==================================================================
DELETE FROM passages
WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071';

-- ==================================================================
-- STEP 3: Verify -- ALL counts should now be 0.
-- ==================================================================
SELECT
  (SELECT COUNT(*) FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071') AS passages_remaining,
  (SELECT COUNT(*) FROM commentaries
    WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071')
  ) AS commentaries_remaining,
  (SELECT COUNT(*) FROM passage_embeddings WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071') AS embeddings_remaining,
  (SELECT COUNT(*) FROM argument_nodes
    WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071')
  ) AS argument_nodes_remaining,
  (SELECT COUNT(*) FROM section_links WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071') AS section_links_remaining,
  (SELECT COUNT(*) FROM passage_nyaya_links
    WHERE passage_id IN (SELECT id FROM passages WHERE text_id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071')
  ) AS nyaya_links_remaining;
