-- Migration: add section_name TEXT column to passages
-- Run this in the Supabase SQL Editor before re-ingesting.
--
-- section_number : sequential integer (1, 2, 3…) incremented each time
--                  the section label changes in the source file
-- section_name   : Sanskrit label as it appears in the source
--                  e.g. "अनिर्वाच्यत्वभङ्गः"

ALTER TABLE passages
  ADD COLUMN IF NOT EXISTS section_name TEXT;
