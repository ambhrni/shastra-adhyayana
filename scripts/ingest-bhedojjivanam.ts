/**
 * ingest-bhedojjivanam.ts
 * Parses the Bhēdōjjīvanam .xlsx file and populates the database.
 *
 * FILE STRUCTURE
 * --------------
 * Row 1    : header row            (skipped)
 * Rows 2–37: data                  (36 sections)
 *
 * Column A (index 0) : passage ID like DV_001 — ignored
 * Column B (index 1) : section name (Sanskrit) — used as-is
 * Column C (index 2) : mūla text — used as-is
 * Column D (index 3) : kāśikā commentary (Kāśītirumalācārya) — used as-is
 *
 * Each row = one section = one passage + one commentary.
 *
 * USAGE
 * -----
 *   npx ts-node --project tsconfig.scripts.json scripts/ingest-bhedojjivanam.ts \
 *     --file path\to\bhedojjivanam.xlsx \
 *     [--text-id <uuid>]          # defaults to hardcoded TEXT_ID below
 *     [--dry-run]                 # parse and print without inserting
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import * as fs   from 'fs'
import * as path from 'path'
import * as XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'

// ----------------------------------------------------------------
// Constants
// ----------------------------------------------------------------
const DEFAULT_TEXT_ID          = '86257ca9-12ab-4a5e-83ff-4e4b2938b071'
const KASITIRUMALACHARYA_ID    = '576e423e-a9b7-4b5b-8f81-be7edea48845'
const DATA_ROW_START           = 1               // 0-indexed: skip row 0 (header)
const DATA_ROW_END             = 37              // 0-indexed exclusive: rows 1–36

// ----------------------------------------------------------------
// Load .env.local
// ----------------------------------------------------------------
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

// ----------------------------------------------------------------
// Excel parsing
// ----------------------------------------------------------------
interface PassageRow {
  sequenceOrder: number   // 1–36
  sectionNumber: number   // same as sequenceOrder
  sectionName:   string   // col B after stripping number prefix
  mula:          string   // col C
  kasika:        string   // col D
}

function parseExcel(filePath: string): PassageRow[] {
  const workbook = XLSX.readFile(filePath, { codepage: 65001 })
  const sheetName = workbook.SheetNames[0]
  const sheet     = workbook.Sheets[sheetName]

  const allRows = XLSX.utils.sheet_to_json<string[]>(sheet, {
    header:  1,
    defval:  '',
    raw:     false,
  })

  // Rows 1–36 (0-indexed), capped at DATA_ROW_END
  const dataRows = allRows.slice(DATA_ROW_START, DATA_ROW_END)

  if (dataRows.length === 0) {
    console.error('Error: no data rows found after skipping the header row.')
    process.exit(1)
  }

  const passages: PassageRow[] = []

  for (let i = 0; i < dataRows.length; i++) {
    const row    = dataRows[i]
    const rowNum = i + 2   // Excel row number (1-indexed), for warnings

    // col A ignored
    const colB = (row[1] ?? '').toString().trim()
    const colC = (row[2] ?? '').toString().trim()
    const colD = (row[3] ?? '').toString().trim()

    // Skip completely empty rows
    if (!colB && !colC && !colD) continue

    const sectionName = colB
    if (!sectionName) {
      console.warn(`  Row ${rowNum}: section name (col B) is empty after stripping — skipping row`)
      continue
    }

    // Mūla — required
    if (!colC) {
      console.warn(`  Row ${rowNum}: mūla text (col C) is empty — skipping row`)
      continue
    }

    // Kāśikā commentary — required
    if (!colD) {
      console.warn(`  Row ${rowNum}: kāśikā commentary (col D) is empty — skipping row`)
      continue
    }

    const seq = passages.length + 1

    passages.push({
      sequenceOrder: seq,
      sectionNumber: seq,
      sectionName,
      mula:   colC,
      kasika: colD,
    })
  }

  return passages
}

// ----------------------------------------------------------------
// Dry-run: parse and print, no DB writes
// ----------------------------------------------------------------
function dryRun(passages: PassageRow[]) {
  console.log(`\nDRY RUN — ${passages.length} passages parsed\n`)
  console.log('─'.repeat(72))
  for (const p of passages) {
    console.log(`§${String(p.sectionNumber).padStart(2, '0')}  ${p.sectionName}`)
    console.log(`  mūla   : ${p.mula.slice(0, 80)}${p.mula.length > 80 ? '…' : ''}`)
    console.log(`  kāśikā : ${p.kasika.slice(0, 80)}${p.kasika.length > 80 ? '…' : ''}`)
    console.log()
  }
  console.log('─'.repeat(72))
  console.log('Dry run complete — no rows inserted.')
}

// ----------------------------------------------------------------
// Database insertion
// ----------------------------------------------------------------
async function ingest(filePath: string, textId: string) {
  // Verify text exists
  const { data: textRow, error: textErr } = await supabase
    .from('texts')
    .select('id, title_transliterated')
    .eq('id', textId)
    .single()

  if (textErr || !textRow) {
    console.error(`Error: text with id "${textId}" not found.`)
    console.error('Run seed-text-record.ts first to create the text record.')
    process.exit(1)
  }

  console.log(`Text       : ${textRow.title_transliterated} (${textRow.id})`)
  console.log(`Commentator: Kāśītirumalācārya (${KASITIRUMALACHARYA_ID})`)

  // Parse Excel
  console.log(`File       : ${filePath}`)
  if (!fs.existsSync(filePath)) {
    console.error(`Error: file not found: ${filePath}`)
    process.exit(1)
  }

  const passages = parseExcel(filePath)

  console.log(`\nPassages parsed: ${passages.length}`)
  passages.forEach(p =>
    console.log(`  §${String(p.sectionNumber).padStart(2, '0')}  ${p.sectionName}`)
  )
  console.log()

  if (passages.length === 0) {
    console.error('No passage rows found. Check the file structure.')
    process.exit(1)
  }

  // Insert
  let passagesInserted     = 0
  let commentariesInserted = 0
  const errors: string[]   = []

  for (const p of passages) {
    process.stdout.write(`  Passage ${String(p.sequenceOrder).padStart(2)}/${passages.length} [§${p.sectionNumber}]…`)

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
      errors.push(`Passage ${p.sequenceOrder}: ${pe?.message ?? 'no row returned'}`)
      continue
    }

    passagesInserted++

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
      errors.push(`Passage ${p.sequenceOrder} (commentary): ${ce.message}`)
    } else {
      commentariesInserted++
      process.stdout.write(` ✓\n`)
    }
  }

  // Summary
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
  console.log('  1. Open /curator in the app')
  console.log('  2. Review and approve passages before learners can see them')
  console.log('  3. In Supabase: set is_published = true on the texts row when ready')
  console.log('─'.repeat(60))
}

// ----------------------------------------------------------------
// CLI argument parsing
// ----------------------------------------------------------------
function getArg(flag: string): string | undefined {
  const args = process.argv.slice(2)
  const idx  = args.indexOf(flag)
  return idx !== -1 ? args[idx + 1] : undefined
}

function hasFlag(flag: string): boolean {
  return process.argv.slice(2).includes(flag)
}

const filePath = getArg('--file')
const textId   = getArg('--text-id') ?? DEFAULT_TEXT_ID
const isDryRun = hasFlag('--dry-run')

if (!filePath) {
  console.error(
    'Usage: npx ts-node --project tsconfig.scripts.json scripts/ingest-bhedojjivanam.ts \\\n' +
    '         --file <path-to-xlsx-file> \\\n' +
    '         [--text-id <uuid>] \\\n' +
    '         [--dry-run]'
  )
  process.exit(1)
}

const resolvedPath = path.resolve(filePath)

if (isDryRun) {
  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: file not found: ${resolvedPath}`)
    process.exit(1)
  }
  const passages = parseExcel(resolvedPath)
  dryRun(passages)
  process.exit(0)
} else {
  ingest(resolvedPath, textId)
    .then(() => { console.log('Done.'); process.exit(0) })
    .catch(err => { console.error('Fatal error:', err); process.exit(1) })
}
