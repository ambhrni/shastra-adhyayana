/**
 * seed-text-record.ts
 * Inserts the vādāvalī text record and links it to both commentators.
 * Run this ONCE before running the ingestion script.
 *
 * Usage:
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-text-record.ts
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// ----------------------------------------------------------------
// Load .env.local without requiring the dotenv package
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
    const key = line.slice(0, eqIdx).trim()
    const value = line.slice(eqIdx + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvLocal()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error(
    'Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.\n' +
    'Add them to .env.local and re-run.'
  )
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// ----------------------------------------------------------------
// Text definition
// ----------------------------------------------------------------
const TEXT = {
  title:               'भेदोज्जीवनम्',
  title_transliterated: 'Bhēdōjjīvanam',
  author:              'Vyāsarāja Tīrtha',
  description:         'Bhēdōjjīvanam is a seminal polemical treatise by Śrī Vyāsarāja Tīrtha that employs rigorous logical dialectics to resuscitate the foundational Dvaita principle of Pañcabheda (fivefold difference) against the monistic onslaught of Advaita Māyāvāda. Through a sophisticated application of Navya-Nyāya epistemology, the text systematically deconstructs the ontological validity of non-duality while establishing the inherent reality of the world and the eternal distinction between the individual soul and the Supreme Brahman.',
  is_published:        false,
}

const KASITIRUMALACHARYA_ID = '576e423e-a9b7-4b5b-8f81-be7edea48845'

// ----------------------------------------------------------------
// Main
// ----------------------------------------------------------------
async function main() {
  console.log('Seeding Bhēdōjjīvanam text record…\n')

  // 1. Insert text
  const { data: text, error: textErr } = await supabase
    .from('texts')
    .insert(TEXT)
    .select('id')
    .single()

  if (textErr) {
    console.error('Failed to insert text record:', textErr.message)
    process.exit(1)
  }

  console.log(`✓ Text inserted`)
  console.log(`  id                 : ${text.id}`)
  console.log(`  title              : ${TEXT.title}`)
  console.log(`  title_transliterated: ${TEXT.title_transliterated}`)
  console.log(`  author             : ${TEXT.author}`)

  // 2. Link Kāśītirumalācārya as the single commentator
  const { error: linkErr } = await supabase.from('text_commentators').insert({
    text_id:        text.id,
    commentator_id: KASITIRUMALACHARYA_ID,
    order_index:    0,
  })

  if (linkErr) {
    console.error(`  ✗ Failed to link Kāśītirumalācārya: ${linkErr.message}`)
  } else {
    console.log(`✓ Linked commentator [tab 0]: Kāśītirumalācārya`)
  }

  // 4. Print next step
  console.log('\n' + '─'.repeat(60))
  console.log('Next step — run the ingestion script:')
  console.log()
  console.log(
    `  npx ts-node --project tsconfig.scripts.json scripts/ingest-text.ts \\`
  )
  console.log(`    --file path\\to\\your\\bhedojjivanam.xlsx \\`)
  console.log(`    --text-id ${text.id}`)
  console.log()
  console.log('The text will be hidden from learners (is_published = false) until')
  console.log('you approve passages in the Curator Portal and set is_published = true.')
  console.log('─'.repeat(60))
}

main()
  .then(() => { console.log('Done.'); process.exit(0); })
  .catch(err => { console.error('Fatal error:', err); process.exit(1); })
