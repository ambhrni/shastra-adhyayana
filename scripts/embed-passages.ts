/**
 * embed-passages.ts
 * Generates vector embeddings for all approved passages and upserts
 * them into passage_embeddings. Each passage is embedded as:
 *   mula_text + "\n" + all approved commentaries (concatenated)
 *
 * USAGE
 *   npx ts-node --project tsconfig.scripts.json scripts/embed-passages.ts
 *   npx ts-node --project tsconfig.scripts.json scripts/embed-passages.ts --start-from 50
 *   npx ts-node --project tsconfig.scripts.json scripts/embed-passages.ts --text-id <uuid>
 *   npx ts-node --project tsconfig.scripts.json scripts/embed-passages.ts --text-id <uuid> --approved
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

function hasFlag(flag: string): boolean {
  return process.argv.includes(flag)
}

async function main() {
  const startFrom  = parseInt(getArg('--start-from') ?? '0', 10)
  const endAtArg   = getArg('--end-at')
  const textId     = getArg('--text-id')
  const approvedOnly = hasFlag('--approved')

  let query = supabase
    .from('passages')
    .select('id, mula_text, section_name, section_number, sequence_order, text_id')
    .order('sequence_order', { ascending: true })

  if (textId)      query = query.eq('text_id', textId)
  if (approvedOnly) query = query.eq('is_approved', true)

  const { data: passages, error } = await query

  if (error || !passages) {
    console.error('Failed to fetch passages:', error?.message)
    process.exit(1)
  }

  const endAt = parseInt(endAtArg ?? String(passages.length - 1), 10)
  console.log(`Text filter   : ${textId ?? '(all texts)'}`)
  console.log(`Approved only : ${approvedOnly}`)
  console.log(`Total passages: ${passages.length}`)
  if (startFrom > 0) console.log(`Resuming from index     : ${startFrom}`)
  if (endAt < passages.length - 1) console.log(`Stopping at index       : ${endAt}`)
  console.log()

  let embedded = 0, errors = 0

  for (let i = startFrom; i <= Math.min(endAt, passages.length - 1); i++) {
    const p = passages[i]

    const { data: commentaries } = await supabase
      .from('commentaries')
      .select('commentary_text')
      .eq('passage_id', p.id)
      .eq('is_approved', true)

    const parts = [p.mula_text]
    for (const c of commentaries ?? []) {
      if (c.commentary_text) parts.push(c.commentary_text)
    }

    const printProgress = (i - startFrom) % 10 === 0
    if (printProgress) {
      process.stdout.write(`  [${i + 1}/${passages.length}] §${p.section_number ?? '—'} — embedding...`)
    }

    try {
      const embedding = await embedText(parts.join('\n'))
      const { error: upsertErr } = await supabase
        .from('passage_embeddings')
        .upsert(
          {
            passage_id: p.id,
            text_id:    p.text_id,
            embedding:  JSON.stringify(embedding),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'passage_id' }
        )

      if (upsertErr) throw new Error(upsertErr.message)
      if (printProgress) process.stdout.write(' ✓\n')
      embedded++
    } catch (err) {
      if (printProgress) process.stdout.write('\n')
      console.error(`  ✗ [${i + 1}] passage ${p.id}: ${err}`)
      errors++
    }

    if (i < passages.length - 1) await new Promise(r => setTimeout(r, 300))
  }

  console.log('\n' + '─'.repeat(50))
  console.log('Passage embedding complete')
  console.log('─'.repeat(50))
  console.log(`Embedded : ${embedded}`)
  console.log(`Errors   : ${errors}`)
  console.log('─'.repeat(50))
}

main().catch(err => { console.error('Unexpected error:', err); process.exit(1) })
