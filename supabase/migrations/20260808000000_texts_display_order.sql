-- ============================================================
-- Migration: display_order on texts
-- Date: 2026-08-08
--
-- Home page course list and navbar Courses dropdown both used
-- ORDER BY created_at, which would put vadavali first regardless
-- of curator intent (it's older). Adds an explicit, curator-
-- controllable ordering column, matching the pattern already used
-- for notebooks (display_order) on the same home page.
-- ============================================================

ALTER TABLE texts
  ADD COLUMN IF NOT EXISTS display_order INTEGER;

COMMENT ON COLUMN texts.display_order IS
  'Explicit curator-controlled ordering for course listings (home page, '
  'navbar Courses dropdown, dashboard). Lower = earlier. NULLs sort last.';

-- Set explicit values: bhedojjivanam first, vadavali second
UPDATE texts SET display_order = 1 WHERE id = '86257ca9-12ab-4a5e-83ff-4e4b2938b071'; -- bhedojjivanam
UPDATE texts SET display_order = 2 WHERE id = 'c0219559-a8a9-4ebb-be5b-eca29b921457'; -- vadavali
