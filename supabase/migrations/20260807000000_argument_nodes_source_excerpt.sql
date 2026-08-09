-- ============================================================
-- Migration: source_excerpt on argument_nodes
-- Date: 2026-08-07
--
-- Adds a DEDICATED field for the exact verbatim quote (mula or
-- commentary) that a node is explaining, separate from
-- content_sanskrit's informal **bold** convention. Curator feedback:
-- bold spans mixed into the interpretive prose were "almost not
-- noticeable" -- this gives the quote its own clearly-styled block.
-- ============================================================

ALTER TABLE argument_nodes
  ADD COLUMN IF NOT EXISTS source_excerpt TEXT;

COMMENT ON COLUMN argument_nodes.source_excerpt IS
  'Exact verbatim quote from mula or commentary that this node explains -- '
  'displayed as a distinct, clearly-styled block, separate from the '
  'informal **bold** spans still used within content_sanskrit prose.';
