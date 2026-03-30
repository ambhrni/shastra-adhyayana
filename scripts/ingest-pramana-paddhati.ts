/**
 * ingest-pramana-paddhati.ts
 * Reads all .txt shards from a folder (sorted by 3-digit numeric prefix),
 * concatenates them, chunks at daṇḍa (।॥) boundaries (~200 Sanskrit words
 * per chunk, ~25-word overlap), embeds each chunk, upserts into reference_chunks.
 *
 * USAGE
 *   npx ts-node --project tsconfig.scripts.json scripts/ingest-pramana-paddhati.ts \
 *     --folder path/to/shards
 *   npx ts-node --project tsconfig.scripts.json scripts/ingest-pramana-paddhati.ts \
 *     --folder path/to/shards --start-from 100
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

// ~200 Sanskrit words ≈ 300-400 embedding tokens; 25-word overlap for context continuity
const WORDS_PER_CHUNK = 200
const WORDS_OVERLAP   = 25
const DANDA_RE        = /[।॥]/g   // U+0964 single daṇḍa, U+0965 double daṇḍa

function chunkText(fullText: string): string[] {
  const words  = fullText.split(/\s+/).filter(w => w.length > 0)
  const chunks: string[] = []
  let start = 0

  while (start < words.length) {
    const end       = Math.min(start + WORDS_PER_CHUNK, words.length)
    const chunkStr  = words.slice(start, end).join(' ')

    if (end < words.length) {
      // Try to cut at the last daṇḍa within the chunk
      const matches = [...chunkStr.matchAll(DANDA_RE)]
      if (matches.length > 0) {
        const lastMatch  = matches[matches.length - 1]
        const cutPoint   = lastMatch.index! + 1
        const usedText   = chunkStr.slice(0, cutPoint)
        chunks.push(usedText.trim())
        const usedWords  = usedText.split(/\s+/).filter(w => w.length > 0).length
        start            = start + Math.max(usedWords - WORDS_OVERLAP, 1)
        continue
      }
    }

    chunks.push(chunkStr.trim())
    if (end >= words.length) break
    start = end - WORDS_OVERLAP
    if (start <= 0) start = end  // safety
  }

  return chunks.filter(c => c.length > 0)
}

async function main() {
  const folderPath = getArg('--folder')
  const startFrom  = parseInt(getArg('--start-from') ?? '0', 10)

  if (!folderPath) {
    console.error('Usage: npx ts-node --project tsconfig.scripts.json scripts/ingest-pramana-paddhati.ts --folder <path>')
    process.exit(1)
  }
  const absFolder = path.resolve(folderPath)
  if (!fs.existsSync(absFolder)) {
    console.error(`Folder not found: ${absFolder}`)
    process.exit(1)
  }

  // Read and sort .txt files by leading numeric prefix
  const files = fs.readdirSync(absFolder)
    .filter(f => f.endsWith('.txt'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/^(\d+)/)?.[1] ?? '0', 10)
      const numB = parseInt(b.match(/^(\d+)/)?.[1] ?? '0', 10)
      return numA - numB
    })

  if (files.length === 0) {
    console.error('No .txt files found in folder.')
    process.exit(1)
  }

  console.log(`Shards found : ${files.length}`)
  console.log(`First shard  : ${files[0]}`)
  console.log(`Last shard   : ${files[files.length - 1]}`)

  const fullText = files
    .map(f => fs.readFileSync(path.join(absFolder, f), 'utf-8'))
    .join('\n')
  console.log(`Total characters : ${fullText.length.toLocaleString()}`)

  // Upsert reference_documents record
  const { data: docRow, error: docErr } = await supabase
    .from('reference_documents')
    .upsert(
      {
        title:       'Pramāṇapaddhati of Jayatīrtha',
        short_name:  'pramana-paddhati',
        description: "Jayatīrtha's treatise on the theory of knowledge in Dvaita Vedānta",
        source:      'Ed. Pandurangi K.T., 2004',
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
  console.log(`Document ID : ${documentId}`)

  const chunks = chunkText(fullText)
  console.log(`Chunks generated : ${chunks.length}`)
  if (startFrom > 0) console.log(`Resuming from chunk index: ${startFrom}`)
  console.log()

  let inserted = 0, errors = 0

  for (let i = startFrom; i < chunks.length; i++) {
    const printProgress = (i - startFrom) % 50 === 0
    if (printProgress) {
      const preview = chunks[i].slice(0, 40).replace(/\s+/g, ' ')
      process.stdout.write(`  [${i + 1}/${chunks.length}] "${preview}…" — embedding...`)
    }

    try {
      const embedding = await embedText(chunks[i])
      const { error: upsertErr } = await supabase
        .from('reference_chunks')
        .upsert(
          {
            document_id:       documentId,
            chunk_text:        chunks[i],
            chunk_index:       i,
            section_label:     null,
            embedding:         JSON.stringify(embedding),
            ocr_quality_score: 0.9,
          },
          { onConflict: 'document_id,chunk_index' }
        )

      if (upsertErr) throw new Error(upsertErr.message)
      if (printProgress) process.stdout.write(' ✓\n')
      inserted++
    } catch (err) {
      if (printProgress) process.stdout.write('\n')
      console.error(`  ✗ [${i + 1}] ${err}`)
      errors++
    }

    if (i < chunks.length - 1) await new Promise(r => setTimeout(r, 300))
  }

  console.log('\n' + '─'.repeat(60))
  console.log('Pramāṇapaddhati ingestion complete')
  console.log('─'.repeat(60))
  console.log(`Total chunks : ${chunks.length}`)
  console.log(`Inserted     : ${inserted}`)
  console.log(`Errors       : ${errors}`)
  console.log('─'.repeat(60))
}

main().catch(err => { console.error('Unexpected error:', err); process.exit(1) })
