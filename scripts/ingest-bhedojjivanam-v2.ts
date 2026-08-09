/**
 * ingest-bhedojjivanam-v2.ts
 * Ingests bhēdōjjīvanam from the new curator-reviewed, markdown-derived JSON
 * (replaces the old .xlsx-based ingest-bhedojjivanam.ts / 36-passage ingestion).
 *
 * SOURCE
 * ------
 * A JSON array produced from transcription.md via a segmentation pipeline
 * (headings -> upaśīrṣikā-bounded units, curator-reviewed and corrected,
 * some units further split into N.1/N.2 sub-units). Each entry:
 *   { display_seq, seq, sub_index, section_name, mula_text, kashika_text,
 *     mula_source, page_start, page_end }
 *
 * `seq` (the ORIGINAL upaśīrṣikā number, 1-125) is used as section_number,
 * so sub-units of one upaśīrṣikā share a section_number/section_name --
 * mirroring vādāvalī's existing 126-passages/40-sections pattern. Array
 * order (already curator-corrected) becomes sequence_order, 1..N.
 *
 * PRE-REQUISITE: this REPLACES the old 36-passage bhēdōjjīvanam data.
 * Run scripts/bhedojjivanam-v2-cleanup.sql in the Supabase SQL Editor
 * FIRST (curator-approved, manual) -- this script does not delete anything.
 *
 * USAGE
 * -----
 *   npx ts-node --project tsconfig.scripts.json scripts/ingest-bhedojjivanam-v2.ts \
 *     [--file scripts/data/bhedojjivanam-units.json]   # default shown
 *     [--text-id <uuid>]                                # defaults to hardcoded TEXT_ID below
 *     [--dry-run]                                       # parse and print without inserting
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import * as fs   from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

const DEFAULT_TEXT_ID       = '86257ca9-12ab-4a5e-83ff-4e4b2938b071'
const KASITIRUMALACHARYA_ID = '576e423e-a9b7-4b5b-8f81-be7edea48845'
const DEFAULT_FILE          = path.join('scripts', 'data', 'bhedojjivanam-units.json')

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.warn('Warning: .env.local not found — using existing process.env')
    return
  }
  const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)
  for (const raw of lines) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eqIdx = line.indexOf('=')
    if (eqIdx === -1) continue
    const key   = line.slice(0, eqIdx).trim()
    const value = line.slice(eqIdx + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvLocal()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    'Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local'
  )
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

interface SourceEntry {
  display_seq:  string
  seq:          number
  sub_index:    number
  section_name: string
  mula_text:    string
  kashika_text: string
  mula_source:  string
  page_start:   number
  page_end:     number
}

interface PassageRow {
  displaySeq:    string
  sequenceOrder: number
  sectionNumber: number
  sectionName:   string
  mula:          string
  kasika:        string | null   // null = legitimately no commentary (e.g. bare
                                 // editorial/structural mUla like "iti pUrvapakSha-
                                 // granthaH" or "siddhAntaH" headers) -- NOT an error
}

function parseJson(filePath: string): PassageRow[] {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const entries: SourceEntry[] = JSON.parse(raw)

  const passages: PassageRow[] = []
  let noKashikaCount = 0
  entries.forEach((e, i) => {
    if (!e.section_name) {
      console.warn(`  Entry ${i} (${e.display_seq}): missing section_name — skipping`)
      return
    }
    if (!e.mula_text) {
      console.warn(`  Entry ${i} (${e.display_seq}): missing mula_text — skipping`)
      return
    }
    // A passage with mUla but no kAshikA is legitimate in this text (bare
    // structural/editorial phrases like "iti pUrvapakShagranthaH" or
    // "siddhAntaH" headers have no commentary of their own) -- carry it
    // through with kasika: null, don't drop the passage. Only section_name
    // and mula_text missing are genuine parsing problems worth skipping over.
    if (!e.kashika_text) {
      console.warn(`  Entry ${i} (${e.display_seq}): no kAshikA (bare mUla-only passage — this is expected for some units, not an error)`)
      noKashikaCount++
    }
    passages.push({
      displaySeq:    e.display_seq,
      sequenceOrder: i + 1,
      sectionNumber: e.seq,
      sectionName:   e.section_name,
      mula:          e.mula_text,
      kasika:        e.kashika_text || null,
    })
  })
  if (noKashikaCount > 0) {
    console.log(`  (${noKashikaCount} passage(s) have no kAshikA -- included anyway, commentary row simply skipped for those)`)
  }

  return passages
}

function dryRun(passages: PassageRow[]) {
  console.log(`\nDRY RUN — ${passages.length} passages parsed\n`)
  console.log('─'.repeat(72))
  for (const p of passages) {
    console.log(`[${p.displaySeq}]  §${p.sectionNumber}  ${p.sectionName}`)
    console.log(`  mūla   : ${p.mula.slice(0, 80)}${p.mula.length > 80 ? '…' : ''}`)
    console.log(`  kāśikā : ${p.kasika ? p.kasika.slice(0, 80) + (p.kasika.length > 80 ? '…' : '') : '(none — bare mūla, no kāśikā of its own)'}`)
    console.log()
  }
  console.log('─'.repeat(72))
  console.log('Dry run complete — no rows inserted.')
}

async function ingest(filePath: string, textId: string) {
  const { data: textRow, error: textErr } = await supabase
    .from('texts')
    .select('id, title_transliterated, is_published')
    .eq('id', textId)
    .single()

  if (textErr || !textRow) {
    console.error(`Error: text with id "${textId}" not found.`)
    process.exit(1)
  }

  console.log(`Text       : ${textRow.title_transliterated} (${textRow.id})`)
  console.log(`Published  : ${textRow.is_published}`)
  console.log(`Commentator: Kāśītirumalācārya (${KASITIRUMALACHARYA_ID})`)

  const { count: existingCount } = await supabase
    .from('passages')
    .select('id', { count: 'exact', head: true })
    .eq('text_id', textId)

  if (existingCount && existingCount > 0) {
    console.error(
      `\nError: ${existingCount} passages already exist for this text_id.\n` +
      `Run scripts/bhedojjivanam-v2-cleanup.sql in the Supabase SQL Editor first ` +
      `(curator-approved), then re-run this script.`
    )
    process.exit(1)
  }

  console.log(`File       : ${filePath}`)
  if (!fs.existsSync(filePath)) {
    console.error(`Error: file not found: ${filePath}`)
    process.exit(1)
  }

  const passages = parseJson(filePath)
  console.log(`\nPassages parsed: ${passages.length}\n`)

  if (passages.length === 0) {
    console.error('No passage rows found. Check the file structure.')
    process.exit(1)
  }

  let passagesInserted     = 0
  let commentariesInserted = 0
  const errors: string[]   = []

  for (const p of passages) {
    process.stdout.write(
      `  [${p.displaySeq}] ${String(p.sequenceOrder).padStart(3)}/${passages.length}…`
    )

    const { data: passageRow, error: pe } = await supabase
      .from('passages')
      .insert({
        text_id:        textId,
        mula_text:      p.mula,
        section_number: p.sectionNumber,
        section_name:   p.sectionName,
        sequence_order: p.sequenceOrder,
        is_approved:    false,
      })
      .select('id')
      .single()

    if (pe || !passageRow) {
      process.stdout.write(` ✗ passage failed\n`)
      errors.push(`[${p.displaySeq}]: ${pe?.message ?? 'no row returned'}`)
      continue
    }

    passagesInserted++

    if (!p.kasika) {
      // legitimately no commentary for this passage -- skip creating a
      // commentaries row, this is expected, not an error
      process.stdout.write(` ✓ (no kāśikā)\n`)
      continue
    }

    const { error: ce } = await supabase
      .from('commentaries')
      .insert({
        passage_id:      passageRow.id,
        commentator_id:  KASITIRUMALACHARYA_ID,
        commentary_text: p.kasika,
        is_approved:     false,
      })

    if (ce) {
      process.stdout.write(` ✗ commentary failed\n`)
      errors.push(`[${p.displaySeq}] (commentary): ${ce.message}`)
    } else {
      commentariesInserted++
      process.stdout.write(` ✓\n`)
    }
  }

  console.log('\n' + '─'.repeat(60))
  console.log('Ingestion complete')
  console.log('─'.repeat(60))
  console.log(`Passages inserted    : ${passagesInserted} / ${passages.length}`)
  console.log(`Commentaries inserted: ${commentariesInserted}`)

  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`)
    errors.forEach(e => console.log(`  ✗ ${e}`))
  } else {
    console.log('\nNo errors.')
  }

  console.log('\nNext steps:')
  console.log('  1. npx ts-node --project tsconfig.scripts.json scripts/embed-passages.ts --text-id ' + textId)
  console.log('  2. Open /curator in the app, review and approve passages')
  console.log('  3. Decide on nyāya concepts / argument maps / section links (optional, Opus-driven)')
  console.log('  4. Set is_published = true on the texts row only when curator confirms')
  console.log('─'.repeat(60))
}

function getArg(flag: string): string | undefined {
  const args = process.argv.slice(2)
  const idx  = args.indexOf(flag)
  return idx !== -1 ? args[idx + 1] : undefined
}

function hasFlag(flag: string): boolean {
  return process.argv.slice(2).includes(flag)
}

const filePath = getArg('--file') ?? DEFAULT_FILE
const textId   = getArg('--text-id') ?? DEFAULT_TEXT_ID
const isDryRun = hasFlag('--dry-run')

const resolvedPath = path.resolve(filePath)

if (isDryRun) {
  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: file not found: ${resolvedPath}`)
    process.exit(1)
  }
  const passages = parseJson(resolvedPath)
  dryRun(passages)
  process.exit(0)
} else {
  ingest(resolvedPath, textId)
    .then(() => { console.log('Done.'); process.exit(0) })
    .catch(err => { console.error('Fatal error:', err); process.exit(1) })
}
