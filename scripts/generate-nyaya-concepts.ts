/**
 * generate-nyaya-concepts.ts
 *
 * Extracts nyāya-śāstra technical terms from vādāvalī passages using Claude,
 * deduplicates them globally in nyaya_concepts, and links them to passages
 * via passage_nyaya_links.
 *
 * Usage:
 *   npx ts-node --project tsconfig.scripts.json scripts/generate-nyaya-concepts.ts
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
  example_text: string
  difficulty_level: number
  source_note: string
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
// Step 2 — Call Claude to extract nyāya terms from a single passage
// ---------------------------------------------------------------------------
async function extractTerms(passage: Passage): Promise<NyayaTerm[]> {
  const prompt = `You are an expert in Dvaita Vedānta and nyāya-śāstra, with deep knowledge of Jayatīrtha's Pramāṇapaddhati and the Mādhva philosophical tradition.

Read this Sanskrit passage from vādāvalī by Jayatīrtha and identify all nyāya-śāstra technical terms present. Only include genuine nyāya-śāstra technical terms — not common Sanskrit words.

For each term provide as JSON:
- term_sanskrit: the term in Devanāgarī (canonical form)
- term_transliterated: IAST transliteration
- definition_english: precise definition in English (3-5 sentences) from Dvaita Vedānta / Mādhva perspective, drawing on Jayatīrtha's Pramāṇapaddhati
- definition_sanskrit: brief definition in Sanskrit (1-2 sentences)
- example_text: a brief example of how this term is used in nyāya argumentation
- difficulty_level: 1-5 (1=basic like anumāna, 5=highly technical like kevalānvayin)
- source_note: which texts/traditions inform this definition (e.g. 'Pramāṇapaddhati, standard nyāya tradition')

Return ONLY a valid JSON array, no other text.

Passage:
${passage.mula_text}`

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = (message.content[0] as { type: string; text: string }).text.trim()

  const jsonText = cleanJsonResponse(raw)

  if (!jsonText.endsWith(']')) {
    console.warn(`  [passage ${passage.sequence_order}] Response appears truncated`)
  }

  try {
    const terms: NyayaTerm[] = JSON.parse(jsonText)
    return Array.isArray(terms) ? terms : []
  } catch {
    console.warn(`  [passage ${passage.sequence_order}] Failed to parse JSON — skipping. Raw:\n${raw.slice(0, 200)}`)
    return []
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
      example_text: term.example_text,
      difficulty_level: Math.min(5, Math.max(1, Math.round(term.difficulty_level))),
      source_note: term.source_note,
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

  await ensureSourceNoteColumn()

  const passages = await fetchPassages()
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
      console.log(`  [seq ${passage.sequence_order}] Extracting terms…`)
      const terms = await extractTerms(passage)
      console.log(`  → ${terms.length} term(s) found`)

      for (const term of terms) {
        if (!term.term_sanskrit) continue
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
