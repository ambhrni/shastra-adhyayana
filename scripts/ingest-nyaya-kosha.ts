/**
 * ingest-nyaya-kosha.ts
 * Parses a Nyāyakośa text file, scores OCR quality, embeds each entry,
 * and upserts into reference_chunks.
 *
 * Entry detection: lines starting with Devanāgarī word(s) followed by
 * an em dash (—), double hyphen (--), or single hyphen (-).
 * Continuation lines are appended to the current entry.
 *
 * USAGE
 *   npx ts-node --project tsconfig.scripts.json scripts/ingest-nyaya-kosha.ts \
 *     --file path/to/nyaya-kosha.txt
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY
 */

import * as fs   from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import { embedText } from './lib/embeddings'

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) { console.warn('Warning: .env.local not found — using existing process.env'); return }
  for (const raw of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eqIdx = line.indexOf('=')
    if (eqIdx === -1) continue
    const key = line.slice(0, eqIdx).trim()
    if (!process.env[key]) process.env[key] = line.slice(eqIdx + 1).trim()
  }
}
loadEnvLocal()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local')
  process.exit(1)
}
if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY must be set in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag)
  return idx !== -1 ? process.argv[idx + 1] : undefined
}

// Lines that start a new dictionary entry: Devanāgarī term followed by a dash variant
const ENTRY_START_RE = /^[\u0900-\u097F][\u0900-\u097F\s]*?(—|--|-)(.+)/

interface KoshaEntry {
  term:     string
  fullText: string
}

function parseKosha(text: string): KoshaEntry[] {
  const lines   = text.split(/\r?\n/)
  const entries: KoshaEntry[] = []
  let current:  string[] = []

  function flush() {
    if (current.length === 0) return
    const joined = current.join(' ').replace(/\s+/g, ' ').trim()
    const m      = joined.match(/^([\u0900-\u097F][\u0900-\u097F\s]*?)\s*(?:—|--|-)(.+)/)
    if (m) {
      entries.push({ term: m[1].trim(), fullText: joined })
    }
    current = []
  }

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (ENTRY_START_RE.test(trimmed)) {
      flush()
      current.push(trimmed)
    } else if (current.length > 0) {
      current.push(trimmed)
    }
    // Lines before the first entry (title, intro) are silently dropped
  }
  flush()

  return entries
}

// OCR quality heuristics
// Garbled UTF-8 artifacts: sequences like à¤, Ã followed by non-space
const OCR_GARBAGE_RE = /à¤|Ã[^\s]/

function ocrQualityScore(text: string): number {
  if (OCR_GARBAGE_RE.test(text)) return 0.2

  const chars         = [...text]
  const total         = chars.length
  if (total === 0) return 1.0
  const devaOrAscii   = chars.filter(c => {
    const cp = c.codePointAt(0)!
    return (cp >= 0x0900 && cp <= 0x097F) || cp < 128
  }).length
  const ratio = devaOrAscii / total
  return ratio < 0.70 ? 0.3 : 0.9
}

async function main() {
  const filePath = getArg('--file')
  if (!filePath) {
    console.error('Usage: npx ts-node --project tsconfig.scripts.json scripts/ingest-nyaya-kosha.ts --file <path>')
    process.exit(1)
  }
  const absPath = path.resolve(filePath)
  if (!fs.existsSync(absPath)) {
    console.error(`File not found: ${absPath}`)
    process.exit(1)
  }

  // Upsert reference_documents record
  const { data: docRow, error: docErr } = await supabase
    .from('reference_documents')
    .upsert(
      {
        title:       'Nyāyakośa',
        short_name:  'nyaya-kosha',
        description: 'Dictionary of Sanskrit philosophical terms',
        source:      'Bhīmācārya Jhalkikar, BORI 1928',
        language:    'Sanskrit',
      },
      { onConflict: 'short_name' }
    )
    .select('id')
    .single()

  if (docErr || !docRow) {
    console.error('Failed to upsert reference_documents:', docErr?.message)
    process.exit(1)
  }
  const documentId = docRow.id
  console.log(`Document ID  : ${documentId}`)
  console.log(`Parsing file : ${absPath}`)

  const text    = fs.readFileSync(absPath, 'utf-8')
  const entries = parseKosha(text)
  console.log(`Entries found: ${entries.length}\n`)

  if (entries.length === 0) {
    console.error('No entries parsed. Check file encoding (must be UTF-8) and format.')
    process.exit(1)
  }

  let inserted = 0, errors = 0
  const qualityDist = { high: 0, medium: 0, low: 0 }

  for (let i = 0; i < entries.length; i++) {
    const entry   = entries[i]
    const quality = ocrQualityScore(entry.fullText)
    if      (quality >= 0.8) qualityDist.high++
    else if (quality >= 0.4) qualityDist.medium++
    else                     qualityDist.low++

    const printProgress = i % 50 === 0
    if (printProgress) {
      process.stdout.write(`  [${i + 1}/${entries.length}] ${entry.term.slice(0, 20)} (q=${quality}) — embedding...`)
    }

    try {
      const embedding = await embedText(entry.fullText)
      const { error: upsertErr } = await supabase
        .from('reference_chunks')
        .upsert(
          {
            document_id:       documentId,
            chunk_text:        entry.fullText,
            chunk_index:       i,
            section_label:     entry.term,
            embedding:         JSON.stringify(embedding),
            ocr_quality_score: quality,
          },
          { onConflict: 'document_id,chunk_index' }
        )

      if (upsertErr) throw new Error(upsertErr.message)
      if (printProgress) process.stdout.write(' ✓\n')
      inserted++
    } catch (err) {
      if (printProgress) process.stdout.write('\n')
      console.error(`  ✗ [${i + 1}] ${entry.term}: ${err}`)
      errors++
    }

    if (i < entries.length - 1) await new Promise(r => setTimeout(r, 300))
  }

  console.log('\n' + '─'.repeat(60))
  console.log('Nyāyakośa ingestion complete')
  console.log('─'.repeat(60))
  console.log(`Total entries  : ${entries.length}`)
  console.log(`Inserted       : ${inserted}`)
  console.log(`Errors         : ${errors}`)
  console.log(`OCR quality    — high: ${qualityDist.high}  medium: ${qualityDist.medium}  low: ${qualityDist.low}`)
  console.log('─'.repeat(60))
}

main().catch(err => { console.error('Unexpected error:', err); process.exit(1) })
