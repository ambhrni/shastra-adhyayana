/**
 * embed-nyaya-concepts.ts
 * Generates vector embeddings for all nyāya concepts and upserts
 * them into nyaya_concept_embeddings. Each concept is embedded as:
 *   term_sanskrit + " " + term_transliterated + ": " + definition_english
 *
 * USAGE
 *   npx ts-node --project tsconfig.scripts.json scripts/embed-nyaya-concepts.ts
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

async function main() {
  const { data: concepts, error } = await supabase
    .from('nyaya_concepts')
    .select('id, term_sanskrit, term_transliterated, definition_english')
    .order('term_transliterated', { ascending: true })

  if (error || !concepts) {
    console.error('Failed to fetch nyāya concepts:', error?.message)
    process.exit(1)
  }

  console.log(`Total nyāya concepts : ${concepts.length}\n`)

  let embedded = 0, errors = 0

  for (let i = 0; i < concepts.length; i++) {
    const c    = concepts[i]
    const text = `${c.term_sanskrit} ${c.term_transliterated}: ${c.definition_english}`

    const printProgress = i % 10 === 0
    if (printProgress) {
      process.stdout.write(`  [${i + 1}/${concepts.length}] ${c.term_transliterated} — embedding...`)
    }

    try {
      const embedding = await embedText(text)
      const { error: upsertErr } = await supabase
        .from('nyaya_concept_embeddings')
        .upsert(
          {
            concept_id: c.id,
            embedding:  JSON.stringify(embedding),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'concept_id' }
        )

      if (upsertErr) throw new Error(upsertErr.message)
      if (printProgress) process.stdout.write(' ✓\n')
      embedded++
    } catch (err) {
      if (printProgress) process.stdout.write('\n')
      console.error(`  ✗ [${i + 1}] ${c.term_transliterated}: ${err}`)
      errors++
    }

    if (i < concepts.length - 1) await new Promise(r => setTimeout(r, 300))
  }

  console.log('\n' + '─'.repeat(50))
  console.log('Nyāya concept embedding complete')
  console.log('─'.repeat(50))
  console.log(`Embedded : ${embedded}`)
  console.log(`Errors   : ${errors}`)
  console.log('─'.repeat(50))
}

main().catch(err => { console.error('Unexpected error:', err); process.exit(1) })
