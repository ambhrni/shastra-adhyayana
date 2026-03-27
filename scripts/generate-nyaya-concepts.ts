/**
 * generate-nyaya-concepts.ts
 *
 * Extracts nyāya-śāstra technical terms from vādāvalī passages using Claude,
 * deduplicates them globally in nyaya_concepts, and links them to passages
 * via passage_nyaya_links.
 *
 * Usage:
 *   npx ts-node --project tsconfig.scripts.json scripts/generate-nyaya-concepts.ts [--start-from N]
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

// ---------------------------------------------------------------------------
// Load .env.local (no dotenv dependency — mirrors existing scripts)
// ---------------------------------------------------------------------------
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
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim()
    if (key && !(key in process.env)) process.env[key] = value
  }
}

loadEnv()

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const TEXT_ID = 'c0219559-a8a9-4ebb-be5b-eca29b921457'
const BATCH_SIZE = 5
const BATCH_DELAY_MS = 2000
const TERM_DEF_DELAY_MS = 300
const MODEL = 'claude-sonnet-4-6'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!

for (const [k, v] of Object.entries({ NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY: SERVICE_ROLE_KEY, ANTHROPIC_API_KEY })) {
  if (!v) { console.error(`ERROR: Missing env var ${k}`); process.exit(1) }
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface NyayaTerm {
  term_sanskrit: string
  term_transliterated: string
  definition_english: string
  definition_sanskrit: string
  difficulty_level: number
  example_text?: string
  source_note?: string
}

interface Passage {
  id: string
  mula_text: string
  section_name: string | null
  sequence_order: number
}

// ---------------------------------------------------------------------------
// Step 0 — Ensure source_note column exists
// ---------------------------------------------------------------------------
async function ensureSourceNoteColumn() {
  console.log('Checking for source_note column in nyaya_concepts…')
  // Use a raw SQL query via rpc or a direct insert attempt.
  // Supabase JS client does not expose DDL directly; we use the REST SQL endpoint.
  const { error } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE nyaya_concepts ADD COLUMN IF NOT EXISTS source_note TEXT;',
  }).single()

  if (error) {
    // exec_sql may not exist — fall back to informing the user
    if (error.message.includes('function') && error.message.includes('does not exist')) {
      console.warn(
        'NOTE: Cannot run ALTER TABLE automatically (exec_sql RPC not available).\n' +
        'Please run this manually in the Supabase SQL editor:\n\n' +
        '  ALTER TABLE nyaya_concepts ADD COLUMN IF NOT EXISTS source_note TEXT;\n'
      )
    } else {
      // Column may already exist — that is fine
      console.warn(`source_note column check returned: ${error.message} (may already exist — continuing)`)
    }
  } else {
    console.log('source_note column ready.')
  }
}

// ---------------------------------------------------------------------------
// Step 1 — Fetch passages
// ---------------------------------------------------------------------------
async function fetchPassages(): Promise<Passage[]> {
  console.log(`\nFetching passages for text_id ${TEXT_ID}…`)
  const { data, error } = await supabase
    .from('passages')
    .select('id, mula_text, section_name, sequence_order')
    .eq('text_id', TEXT_ID)
    .order('sequence_order', { ascending: true })

  if (error) { console.error('Failed to fetch passages:', error.message); process.exit(1) }
  if (!data || data.length === 0) { console.error('No passages found for this text_id.'); process.exit(1) }

  console.log(`Found ${data.length} passages.`)
  return data as Passage[]
}

// ---------------------------------------------------------------------------
// JSON cleaning — extracts the JSON content by finding first [ / { and last ] / }
// ---------------------------------------------------------------------------
function cleanJsonResponse(raw: string): string {
  const firstBracket = Math.min(
    raw.indexOf('[') === -1 ? Infinity : raw.indexOf('['),
    raw.indexOf('{') === -1 ? Infinity : raw.indexOf('{')
  )
  if (firstBracket === Infinity) return raw.trim()

  const lastCloseBracket = Math.max(
    raw.lastIndexOf(']'),
    raw.lastIndexOf('}')
  )
  if (lastCloseBracket === -1) return raw.trim()

  return raw.slice(firstBracket, lastCloseBracket + 1).trim()
}

// ---------------------------------------------------------------------------
// Step 2a — Call 1: list nyāya terms present in a passage (one per line, no JSON)
// ---------------------------------------------------------------------------
async function listTerms(passage: Passage): Promise<string[]> {
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 512,
    messages: [{
      role: 'user',
      content:
        `You are an expert in Dvaita Vedānta and nyāya-śāstra.\n\n` +
        `List only the nyāya-śāstra technical terms present in this Sanskrit passage, ` +
        `one per line, in Devanāgarī only. No definitions, no JSON, no numbering, no other text. ` +
        `If there are no technical terms, reply with the single word: NONE\n\n` +
        `Passage:\n${passage.mula_text}`,
    }],
  })

  const raw = (message.content[0] as { type: string; text: string }).text.trim()
  if (!raw || raw.toUpperCase() === 'NONE') return []

  return raw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0)
}

// ---------------------------------------------------------------------------
// Step 2b — Call 2: define a single nyāya term (small JSON object)
// ---------------------------------------------------------------------------
async function defineTerm(termSanskrit: string, seqOrder: number): Promise<NyayaTerm | null> {
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 512,
    messages: [{
      role: 'user',
      content:
        `Define this nyāya term: ${termSanskrit} in the context of Mādhva Dvaita Vedānta.\n` +
        `Return JSON with exactly these fields:\n` +
        `{\n` +
        `  "term_sanskrit": string,\n` +
        `  "term_transliterated": string,\n` +
        `  "definition_english": string (max 2 sentences),\n` +
        `  "definition_sanskrit": string (max 1 sentence),\n` +
        `  "difficulty_level": number 1-5\n` +
        `}\n` +
        `Return ONLY the JSON object, nothing else.`,
    }],
  })

  const raw = (message.content[0] as { type: string; text: string }).text.trim()
  const jsonText = cleanJsonResponse(raw)

  try {
    const term = JSON.parse(jsonText) as NyayaTerm
    if (!term.term_sanskrit || !term.definition_english) return null
    term.difficulty_level = Math.min(5, Math.max(1, Math.round(term.difficulty_level)))
    return term
  } catch {
    console.warn(`  [seq ${seqOrder}] Failed to parse definition for "${termSanskrit}" — skipping. Raw:\n${raw.slice(0, 150)}`)
    return null
  }
}

// ---------------------------------------------------------------------------
// Step 3 — Load existing nyaya_concepts into a map (term_sanskrit → id)
// ---------------------------------------------------------------------------
async function loadExistingConcepts(): Promise<Map<string, string>> {
  const { data, error } = await supabase
    .from('nyaya_concepts')
    .select('id, term_sanskrit')

  if (error) { console.error('Failed to load existing concepts:', error.message); process.exit(1) }

  const map = new Map<string, string>()
  for (const row of (data ?? [])) map.set(row.term_sanskrit, row.id)
  console.log(`Loaded ${map.size} existing concept(s) from DB.`)
  return map
}

// ---------------------------------------------------------------------------
// Step 4 — Upsert a concept; return its id
// ---------------------------------------------------------------------------
async function upsertConcept(
  term: NyayaTerm,
  conceptMap: Map<string, string>,
  newCount: { n: number },
  existingCount: { n: number }
): Promise<string> {
  const existing = conceptMap.get(term.term_sanskrit)
  if (existing) {
    existingCount.n++
    return existing
  }

  const { data, error } = await supabase
    .from('nyaya_concepts')
    .insert({
      term_sanskrit: term.term_sanskrit,
      term_transliterated: term.term_transliterated,
      definition_english: term.definition_english,
      definition_sanskrit: term.definition_sanskrit,
      example_text: term.example_text ?? null,
      difficulty_level: Math.min(5, Math.max(1, Math.round(term.difficulty_level))),
      source_note: term.source_note ?? null,
    })
    .select('id')
    .single()

  if (error) {
    // Race condition: another insert may have beaten us; try to fetch
    if (error.code === '23505') {
      const { data: existing2 } = await supabase
        .from('nyaya_concepts')
        .select('id')
        .eq('term_sanskrit', term.term_sanskrit)
        .single()
      if (existing2) {
        conceptMap.set(term.term_sanskrit, existing2.id)
        existingCount.n++
        return existing2.id
      }
    }
    console.warn(`  Failed to insert concept "${term.term_sanskrit}": ${error.message}`)
    return ''
  }

  const id = data!.id
  conceptMap.set(term.term_sanskrit, id)
  newCount.n++
  return id
}

// ---------------------------------------------------------------------------
// Step 5 — Link a concept to a passage
// ---------------------------------------------------------------------------
async function linkToPassage(passageId: string, conceptId: string): Promise<boolean> {
  const { error } = await supabase
    .from('passage_nyaya_links')
    .insert({ passage_id: passageId, nyaya_concept_id: conceptId })

  if (error) {
    if (error.code === '23505') return false  // already linked — skip
    console.warn(`  Failed to link passage ${passageId} → concept ${conceptId}: ${error.message}`)
    return false
  }
  return true
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

function getArg(name: string): string | undefined {
  const idx = process.argv.indexOf(name)
  return idx !== -1 ? process.argv[idx + 1] : undefined
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('=== generate-nyaya-concepts ===\n')

  const startFrom = parseInt(getArg('--start-from') ?? '1')
  if (startFrom > 1) console.log(`Skipping passages with sequence_order < ${startFrom}`)

  await ensureSourceNoteColumn()

  const allPassages = await fetchPassages()
  const passages = allPassages.filter(p => p.sequence_order >= startFrom)
  if (startFrom > 1) console.log(`Processing ${passages.length} of ${allPassages.length} passages (starting from seq ${startFrom}).`)
  const conceptMap = await loadExistingConcepts()

  const newCount = { n: 0 }
  const existingCount = { n: 0 }
  let linksCreated = 0

  // Track all unique terms for final summary
  const allTermsSeen = new Map<string, { transliterated: string; difficulty: number }>()

  const batches = chunk(passages, BATCH_SIZE)
  console.log(`\nProcessing ${passages.length} passages in ${batches.length} batch(es) of ${BATCH_SIZE}...\n`)

  for (let bi = 0; bi < batches.length; bi++) {
    const batch = batches[bi]
    console.log(`--- Batch ${bi + 1}/${batches.length} (passages ${bi * BATCH_SIZE + 1}–${bi * BATCH_SIZE + batch.length}) ---`)

    for (const passage of batch) {
      console.log(`  [seq ${passage.sequence_order}] Listing terms…`)
      const termNames = await listTerms(passage)
      console.log(`  → ${termNames.length} term(s) identified: ${termNames.join(', ') || '(none)'}`)

      for (const termSanskrit of termNames) {
        await sleep(TERM_DEF_DELAY_MS)

        console.log(`    Defining: ${termSanskrit}`)
        const term = await defineTerm(termSanskrit, passage.sequence_order)
        if (!term) continue

        allTermsSeen.set(term.term_sanskrit, {
          transliterated: term.term_transliterated,
          difficulty: term.difficulty_level,
        })

        const conceptId = await upsertConcept(term, conceptMap, newCount, existingCount)
        if (!conceptId) continue

        const linked = await linkToPassage(passage.id, conceptId)
        if (linked) linksCreated++
      }
    }

    if (bi < batches.length - 1) {
      console.log(`  Waiting ${BATCH_DELAY_MS}ms before next batch…`)
      await sleep(BATCH_DELAY_MS)
    }
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n' + '='.repeat(60))
  console.log('SUMMARY')
  console.log('='.repeat(60))
  console.log(`Total unique concepts found across all passages : ${allTermsSeen.size}`)
  console.log(`  → New concepts inserted into DB               : ${newCount.n}`)
  console.log(`  → Concepts already existed in DB (reused)     : ${existingCount.n}`)
  console.log(`Total passage → concept links created           : ${linksCreated}`)

  console.log('\nAll unique terms (alphabetical by IAST):')
  const sorted = [...allTermsSeen.entries()]
    .sort((a, b) => a[1].transliterated.localeCompare(b[1].transliterated))

  for (const [sanskrit, { transliterated, difficulty }] of sorted) {
    console.log(`  [${difficulty}] ${transliterated.padEnd(30)} ${sanskrit}`)
  }

  console.log('\nDone.')
}

main().catch(err => { console.error('Unexpected error:', err); process.exit(1) })
