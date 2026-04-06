/**
 * generate-section-links.ts
 *
 * Uses Claude Opus to analyze all 40 sections of the Vādāvalī mūla text and
 * generate section-level logical connections (spine + cross-links).
 *
 * Prerequisites — run this SQL once to create the table:
 *
 *   create table public.section_links (
 *     id                 uuid primary key default gen_random_uuid(),
 *     text_id            uuid not null references public.texts(id) on delete cascade,
 *     from_section       integer not null,
 *     to_section         integer not null,
 *     connection_type    text not null,
 *     rationale          text,
 *     rationale_sanskrit text,
 *     is_spine           boolean not null default true,
 *     ai_generated       boolean not null default false,
 *     ai_model           text,
 *     is_approved        boolean not null default false,
 *     created_at         timestamptz not null default now(),
 *     updated_at         timestamptz not null default now(),
 *     unique (text_id, from_section, to_section)
 *   );
 *
 *   alter table public.section_links enable row level security;
 *   create policy "section_links_select_public"
 *     on public.section_links for select using (true);
 *
 * Usage:
 *   npx ts-node --project tsconfig.scripts.json scripts/generate-section-links.ts
 *     [--force]   delete existing links for this text before inserting
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

// ── Load .env.local ───────────────────────────────────────────────────────────

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('ERROR: .env.local not found. Copy .env.example → .env.local and fill in values.')
    process.exit(1)
  }
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key   = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (key && !(key in process.env)) process.env[key] = value
  }
}

loadEnv()

// ── Config ────────────────────────────────────────────────────────────────────

const TEXT_ID   = 'c0219559-a8a9-4ebb-be5b-eca29b921457'
const MODEL     = 'claude-opus-4-6'
const MAX_CHARS  = 500    // mūla text truncation per section
const MAX_TOKENS = 16000

const SUPABASE_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ANTHROPIC_KEY    = process.env.ANTHROPIC_API_KEY!

for (const [k, v] of Object.entries({
  NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: SERVICE_ROLE_KEY,
  ANTHROPIC_API_KEY: ANTHROPIC_KEY,
})) {
  if (!v) { console.error(`ERROR: Missing env var ${k}`); process.exit(1) }
}

const supabase  = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
const anthropic = new Anthropic({ apiKey: ANTHROPIC_KEY })

// ── Helpers ───────────────────────────────────────────────────────────────────

function hasFlag(name: string): boolean {
  return process.argv.includes(name)
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface SectionSummary {
  section_number: number
  section_name:   string
  mula_text:      string
}

interface SectionLink {
  from_section:       number
  to_section:         number
  connection_type:    string
  rationale:          string
  rationale_sanskrit: string
  is_spine:           boolean
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== generate-section-links ===\n')

  const force = hasFlag('--force')
  console.log(`Model  : ${MODEL}`)
  console.log(`Force  : ${force ? 'yes — existing links will be deleted before insert' : 'no — will upsert (ON CONFLICT UPDATE)'}`)

  // ── Step 1: Fetch all passages and build per-section mūla summaries ───────

  console.log('\nFetching passages…')
  const { data: passages, error: passageErr } = await supabase
    .from('passages')
    .select('section_number, section_name, sequence_order, mula_text')
    .eq('text_id', TEXT_ID)
    .eq('is_approved', true)
    .not('section_number', 'is', null)
    .order('section_number')
    .order('sequence_order')

  if (passageErr || !passages) {
    console.error('ERROR: Failed to fetch passages:', passageErr?.message)
    process.exit(1)
  }

  // Group by section and concat mūla_text
  const sectionMap = new Map<number, { section_name: string; texts: string[] }>()
  for (const p of passages) {
    const sn = p.section_number as number
    if (!sectionMap.has(sn)) {
      sectionMap.set(sn, { section_name: p.section_name ?? '', texts: [] })
    }
    if (p.mula_text) sectionMap.get(sn)!.texts.push(p.mula_text)
  }

  const sections: SectionSummary[] = Array.from(sectionMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([sn, { section_name, texts }]) => {
      const full = texts.join(' ')
      return {
        section_number: sn,
        section_name,
        mula_text: full.length > MAX_CHARS ? full.slice(0, MAX_CHARS) + '…' : full,
      }
    })

  console.log(`Sections loaded: ${sections.length}`)
  if (sections.length === 0) {
    console.error('ERROR: No approved passages with section numbers found.')
    process.exit(1)
  }

  // ── Step 2: Build prompt ──────────────────────────────────────────────────

  const sectionBlock = sections.map(s =>
    `§${s.section_number} — ${s.section_name}\n${s.mula_text}`
  ).join('\n\n')

  const systemPrompt =
    'You are an expert scholar of Mādhva Dvaita Vedānta (Tattvavāda) with deep mastery of ' +
    'the Vādāvalī of Jayatīrtha. You analyze the logical argument structure of Sanskrit ' +
    'philosophical texts with precision. Your task is to identify the logical flow and ' +
    'dependencies between sections of the Vādāvalī mūla text, based solely on the mūla ' +
    'text itself — no commentaries, no external sources.'

  const userPrompt =
    `Below are all ${sections.length} sections of the Vādāvalī mūla text with their Sanskrit names ` +
    `and opening mūla passages (truncated to ${MAX_CHARS} characters each):\n\n` +
    sectionBlock +
    `\n\n` +
    `Analyze the logical argument flow between these ${sections.length} sections of the Vādāvalī. Identify:\n\n` +

    `STEP 1 — SPINE: The main sequential logical flow. For each consecutive pair (§N → §N+1), ` +
    `determine if there is a direct logical continuation. Most consecutive sections will have a spine connection. Provide:\n` +
    `- from_section, to_section\n` +
    `- connection_type: one of 'leads-to' | 'refutes' | 'establishes' | 'follows-from' | 'responds-to' | 'consolidates'\n` +
    `- rationale: one precise English sentence explaining the logical connection\n` +
    `- rationale_sanskrit: one precise Sanskrit sentence (pure classical Sanskrit, no Hindi) explaining the same\n` +
    `- is_spine: true\n\n` +

    `STEP 2 — CROSS-LINKS: Non-sequential logical dependencies. Where a later section explicitly ` +
    `responds to, consolidates, or depends on an earlier non-adjacent section. Only include genuine ` +
    `logical dependencies, not superficial thematic similarities. Provide the same fields with is_spine: false.\n\n` +

    `Return ONLY a valid JSON array. No preamble. No markdown fences. Each element:\n` +
    `{\n` +
    `  "from_section": integer,\n` +
    `  "to_section": integer,\n` +
    `  "connection_type": string,\n` +
    `  "rationale": string,\n` +
    `  "rationale_sanskrit": string,\n` +
    `  "is_spine": boolean\n` +
    `}`

  // ── Step 3: Call Claude ───────────────────────────────────────────────────

  console.log('\nCalling Claude…')
  const response = await anthropic.messages.create({
    model:      MODEL,
    max_tokens: MAX_TOKENS,
    system:     systemPrompt,
    messages:   [{ role: 'user', content: userPrompt }],
  })

  const rawText = response.content
    .filter(b => b.type === 'text')
    .map(b => (b as any).text as string)
    .join('')

  if (!rawText.trim()) {
    console.error('ERROR: Empty response from Claude.')
    process.exit(1)
  }

  // ── Step 4: Parse JSON ────────────────────────────────────────────────────

  function cleanJson(raw: string): string {
    const first = raw.indexOf('[')
    const last  = raw.lastIndexOf(']')
    if (first === -1 || last === -1) return raw
    return raw.slice(first, last + 1).trim()
  }

  let links: SectionLink[]
  try {
    links = JSON.parse(cleanJson(rawText))
  } catch (err: any) {
    console.error('ERROR: Failed to parse Claude response as JSON:', err.message)
    console.error('Raw response (first 500 chars):', rawText.slice(0, 500))
    process.exit(1)
  }

  if (!Array.isArray(links) || links.length === 0) {
    console.error('ERROR: Claude returned an empty or non-array JSON structure.')
    process.exit(1)
  }

  // Basic validation
  const valid = links.filter(l =>
    typeof l.from_section === 'number' &&
    typeof l.to_section   === 'number' &&
    typeof l.connection_type === 'string' &&
    typeof l.is_spine === 'boolean'
  )
  const invalid = links.length - valid.length
  if (invalid > 0) console.warn(`  Warning: ${invalid} link(s) failed validation and will be skipped.`)

  const spineLinks = valid.filter(l => l.is_spine)
  const crossLinks = valid.filter(l => !l.is_spine)
  console.log(`\nParsed: ${valid.length} links — ${spineLinks.length} spine, ${crossLinks.length} cross-links`)

  // ── Step 5: Optional force-delete existing links ──────────────────────────

  if (force) {
    console.log('\nDeleting existing links…')
    const { error: delErr } = await supabase
      .from('section_links')
      .delete()
      .eq('text_id', TEXT_ID)
    if (delErr) {
      console.error('ERROR: Failed to delete existing links:', delErr.message)
      process.exit(1)
    }
    console.log('  Deleted.')
  }

  // ── Step 6: Deduplicate then upsert to section_links ─────────────────────

  const seen = new Set<string>()
  const uniqueLinks = valid.filter(l => {
    const key = `${l.from_section}-${l.to_section}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  const dupeCount = valid.length - uniqueLinks.length
  if (dupeCount > 0) console.log(`  Duplicates removed: ${dupeCount}`)

  console.log('\nUpserting section_links…')

  const rows = uniqueLinks.map(l => ({
    text_id:            TEXT_ID,
    from_section:       l.from_section,
    to_section:         l.to_section,
    connection_type:    l.connection_type,
    rationale:          l.rationale          ?? null,
    rationale_sanskrit: l.rationale_sanskrit ?? null,
    is_spine:           l.is_spine,
    ai_generated:       true,
    ai_model:           MODEL,
    is_approved:        false,
  }))

  // Insert in batches of 50 to stay within Supabase payload limits
  const BATCH = 50
  let insertedCount = 0
  let errorCount    = 0

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error: upsertErr } = await supabase
      .from('section_links')
      .upsert(batch, {
        onConflict:        'text_id,from_section,to_section',
        ignoreDuplicates:  false,
      })
    if (upsertErr) {
      console.error(`  ERROR on batch ${Math.floor(i / BATCH) + 1}:`, upsertErr.message)
      errorCount += batch.length
    } else {
      insertedCount += batch.length
    }
  }

  // ── Step 7: Summary ───────────────────────────────────────────────────────

  console.log('\n' + '='.repeat(60))
  console.log('SUMMARY')
  console.log('='.repeat(60))
  console.log(`Spine links    : ${spineLinks.length}`)
  console.log(`Cross-links    : ${crossLinks.length}`)
  console.log(`Total parsed   : ${valid.length}`)
  console.log(`Duplicates     : ${dupeCount}`)
  console.log(`Upserted OK    : ${insertedCount}`)
  if (errorCount > 0) console.log(`Errors         : ${errorCount}`)
  if (invalid    > 0) console.log(`Invalid/skipped: ${invalid}`)
  console.log(`Model          : ${MODEL}  (${response.usage.input_tokens} in / ${response.usage.output_tokens} out tokens)`)
  console.log('\nDone.')
}

main().catch(err => { console.error('Unexpected error:', err); process.exit(1) })
