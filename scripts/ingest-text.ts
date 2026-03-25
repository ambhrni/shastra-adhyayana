/**
 * ingest-text.ts
 * Parses a structured .xlsx file and populates the database.
 *
 * FILE STRUCTURE
 * --------------
 * Rows 1–2 : instructions  (skipped)
 * Row 3    : headers        (skipped)
 * Rows 4–129: data          (126 passages)
 *
 * Column A : section name (Sanskrit) — carry forward when empty
 * Column B : mūla text   — prefix "वादावली - "
 * Column C : Rāghavendra commentary — prefix "भावदीपिका - "
 * Column D : Śrīnivāsa commentary  — prefix "वादावलीप्रकाशः - "
 *            (empty on some rows → no commentary row inserted)
 *
 * USAGE
 * -----
 *   npx ts-node --project tsconfig.scripts.json scripts/ingest-text.ts \
 *     --file path\to\vadavali.xlsx \
 *     --text-id <uuid-from-seed-text-record>
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import * as fs   from 'fs'
import * as path from 'path'
import * as XLSX from 'xlsx'
import { createClient } from '@supabase/supabase-js'

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
// Column prefix stripping
// ----------------------------------------------------------------
const MULA_PREFIX        = 'वादावली - '
const RAGHAVENDRA_PREFIX = 'भावदीपिका - '
const SHRINIVASA_PREFIX  = 'वादावलीप्रकाशः - '

function stripPrefix(raw: string, prefix: string): string {
  const s = raw.trim()
  if (s.startsWith(prefix)) return s.slice(prefix.length).trim()
  return s
}

// ----------------------------------------------------------------
// Excel parsing
// ----------------------------------------------------------------
interface PassageRow {
  sequenceOrder:  number
  sectionNumber:  number | null   // sequential integer, incremented on section change
  sectionName:    string | null   // Sanskrit label as written in col A
  mula:           string
  raghavendra:    string
  shrinivasa:     string | null   // null = no commentary row to insert
}

function parseExcel(filePath: string): PassageRow[] {
  const workbook = XLSX.readFile(filePath, { codepage: 65001 })  // UTF-8
  const sheetName = workbook.SheetNames[0]
  const sheet     = workbook.Sheets[sheetName]

  // header:1  → each row returned as a raw string array
  // defval:'' → empty cells become '' rather than undefined
  // raw:false → all cells coerced to string (avoids numeric/date cell types)
  const allRows = XLSX.utils.sheet_to_json<string[]>(sheet, {
    header:  1,
    defval:  '',
    raw:     false,
  })

  // Rows 0–2 are instructions + header row — skip them.
  const dataRows = allRows.slice(3)   // Excel rows 4–129

  if (dataRows.length === 0) {
    console.error('Error: no data rows found after skipping the header rows.')
    process.exit(1)
  }

  const passages: PassageRow[] = []
  let lastSectionName  = ''
  let sectionNumber    = 0

  for (let i = 0; i < dataRows.length; i++) {
    const row    = dataRows[i]
    const rowNum = i + 4   // Excel row number (1-indexed), for warnings

    const colA = (row[0] ?? '').toString().trim()
    const colB = (row[1] ?? '').toString().trim()
    const colC = (row[2] ?? '').toString().trim()
    const colD = (row[3] ?? '').toString().trim()

    // Skip completely empty rows (may appear after the last data row)
    if (!colA && !colB && !colC && !colD) continue

    // Section: carry forward when col A is empty; increment counter on change
    if (colA && colA !== lastSectionName) {
      sectionNumber++
      lastSectionName = colA
    }

    const effectiveSectionNumber = sectionNumber > 0 ? sectionNumber : null
    const effectiveSectionName   = lastSectionName || null

    // Mūla — required
    const mula = stripPrefix(colB, MULA_PREFIX)
    if (!mula) {
      console.warn(`  Row ${rowNum}: mūla text (col B) is empty — skipping row`)
      continue
    }

    // Rāghavendra — required
    const raghavendra = stripPrefix(colC, RAGHAVENDRA_PREFIX)
    if (!raghavendra) {
      console.warn(`  Row ${rowNum}: Rāghavendra commentary (col C) is empty — skipping row`)
      continue
    }

    // Śrīnivāsa — optional; empty → null → no commentary row inserted
    const shrinivasaRaw = stripPrefix(colD, SHRINIVASA_PREFIX)
    const shrinivasa    = shrinivasaRaw.length > 0 ? shrinivasaRaw : null

    // Length warnings — possible truncation or false split
    if (mula.length < 10) {
      console.warn(`  Row ${rowNum}: mūla is very short (${mula.length} chars) — check source`)
    }
    if (raghavendra.length < 50) {
      console.warn(`  Row ${rowNum}: Rāghavendra commentary is short (${raghavendra.length} chars) — possible truncation`)
    }
    if (shrinivasa !== null && shrinivasa.length < 50) {
      console.warn(`  Row ${rowNum}: Śrīnivāsa commentary is short (${shrinivasa.length} chars) — possible truncation`)
    }

    passages.push({
      sequenceOrder:  passages.length + 1,
      sectionNumber:  effectiveSectionNumber,
      sectionName:    effectiveSectionName,
      mula,
      raghavendra,
      shrinivasa,
    })
  }

  return passages
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

  console.log(`Text   : ${textRow.title_transliterated} (${textRow.id})`)

  // Fetch commentators
  const { data: commentators, error: cErr } = await supabase
    .from('commentators')
    .select('id, name')
    .in('name', ['Rāghavendra Tīrtha', 'Śrīnivāsa Tīrtha'])

  if (cErr || !commentators) {
    console.error('Error fetching commentators:', cErr?.message)
    process.exit(1)
  }

  console.log(`Commentators found: ${commentators.map(c => `"${c.name}" (${c.id})`).join(', ')}`)

  const raghavendraId = commentators.find(c => c.name === 'Rāghavendra Tīrtha')?.id
  const shrinivasaId  = commentators.find(c => c.name === 'Śrīnivāsa Tīrtha')?.id

  if (!raghavendraId) {
    console.error('Error: "Rāghavendra Tīrtha" not found in commentators table.')
    console.error('Returned names:', commentators.map(c => c.name))
    console.error('Make sure schema.sql was executed (it seeds this commentator).')
    process.exit(1)
  }
  if (!shrinivasaId) {
    console.error('Error: "Śrīnivāsa Tīrtha" not found in commentators table.')
    console.error('Returned names:', commentators.map(c => c.name))
    console.error('Make sure schema.sql was executed (it seeds this commentator).')
    process.exit(1)
  }
  if (raghavendraId === shrinivasaId) {
    console.error(`Error: both commentators resolved to the same UUID (${raghavendraId}).`)
    console.error('Unicode normalization mismatch — check name strings in the DB.')
    console.error('Returned names:', commentators.map(c => `"${c.name}"`))
    process.exit(1)
  }

  // Parse Excel file
  console.log(`File   : ${filePath}`)
  if (!fs.existsSync(filePath)) {
    console.error(`Error: file not found: ${filePath}`)
    process.exit(1)
  }

  const passages = parseExcel(filePath)
  const uniqueSections = [...new Map(
    passages
      .filter(p => p.sectionNumber !== null)
      .map(p => [p.sectionNumber, p.sectionName])
  ).entries()]

  console.log(`\nPassages parsed  : ${passages.length}`)
  console.log(`Sections found   : ${uniqueSections.length}`)
  uniqueSections.forEach(([num, name]) =>
    console.log(`  §${num}  ${name}`)
  )
  console.log()

  if (passages.length === 0) {
    console.error('No passage rows found. Check the file structure and column layout.')
    process.exit(1)
  }

  // Insert
  let passagesInserted     = 0
  let commentariesInserted = 0
  let shrinivasaSkipped    = 0
  const errors: string[]   = []

  for (const p of passages) {
    const label = `§${p.sectionNumber ?? '—'}`
    process.stdout.write(`  Passage ${String(p.sequenceOrder).padStart(3)}/${passages.length} [${label}]…`)

    // Insert passage
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

    // Build commentary rows — Rāghavendra always, Śrīnivāsa only if present
    const commentaryRows: object[] = [
      {
        passage_id:      passageRow.id,
        commentator_id:  raghavendraId,
        commentary_text: p.raghavendra,
        is_approved:     false,
      },
    ]

    if (p.shrinivasa !== null) {
      commentaryRows.push({
        passage_id:      passageRow.id,
        commentator_id:  shrinivasaId,
        commentary_text: p.shrinivasa,
        is_approved:     false,
      })
    } else {
      shrinivasaSkipped++
    }

    const { error: ce } = await supabase
      .from('commentaries')
      .insert(commentaryRows)

    if (ce) {
      process.stdout.write(` ✗ commentaries failed\n`)
      errors.push(`Passage ${p.sequenceOrder} (commentaries): ${ce.message}`)
    } else {
      commentariesInserted += commentaryRows.length
      const marker = p.shrinivasa === null ? ' ✓ (Śrīnivāsa empty)' : ' ✓'
      process.stdout.write(`${marker}\n`)
    }
  }

  // Summary
  console.log('\n' + '─'.repeat(60))
  console.log('Ingestion complete')
  console.log('─'.repeat(60))
  console.log(`Passages inserted    : ${passagesInserted} / ${passages.length}`)
  console.log(`Commentaries inserted: ${commentariesInserted}`)
  console.log(`Śrīnivāsa skipped   : ${shrinivasaSkipped} (empty in source)`)

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

const filePath = getArg('--file')
const textId   = getArg('--text-id')

if (!filePath || !textId) {
  console.error(
    'Usage: npx ts-node --project tsconfig.scripts.json scripts/ingest-text.ts \\\n' +
    '         --file <path-to-xlsx-file> \\\n' +
    '         --text-id <uuid>\n\n' +
    'Get the text-id by running seed-text-record.ts first.'
  )
  process.exit(1)
}

ingest(path.resolve(filePath), textId).catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
