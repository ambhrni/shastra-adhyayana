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
  title:               'वादावली',
  title_transliterated: 'Vādāvalī',
  author:              'Jayatīrtha',
  description:         'A systematic refutation of Advaita Vedānta positions, examining ' +
                       'the doctrines of avidyā from the Dvaita Vedānta perspective',
  is_published:        false,
}

const COMMENTATOR_NAMES = ['Rāghavendra Tīrtha', 'Śrīnivāsa Tīrtha']

// ----------------------------------------------------------------
// Main
// ----------------------------------------------------------------
async function main() {
  console.log('Seeding vādāvalī text record…\n')

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

  // 2. Fetch commentators
  const { data: commentators, error: cErr } = await supabase
    .from('commentators')
    .select('id, name')
    .in('name', COMMENTATOR_NAMES)

  if (cErr || !commentators || commentators.length === 0) {
    console.error('\nError: Could not find commentators in the database.')
    console.error('Make sure you have run supabase/schema.sql first (it seeds them).')
    process.exit(1)
  }

  const found = commentators.map(c => c.name)
  const missing = COMMENTATOR_NAMES.filter(n => !found.includes(n))
  if (missing.length > 0) {
    console.warn(`\nWarning: These commentators were not found: ${missing.join(', ')}`)
    console.warn('They will not be linked. Add them to the commentators table and re-link manually.')
  }

  // 3. Link commentators in display order (schema order = Rāghavendra first)
  for (let i = 0; i < commentators.length; i++) {
    const c = commentators[i]
    const orderIndex = COMMENTATOR_NAMES.indexOf(c.name)  // preserve intended tab order

    const { error: linkErr } = await supabase.from('text_commentators').insert({
      text_id:        text.id,
      commentator_id: c.id,
      order_index:    orderIndex >= 0 ? orderIndex : i,
    })

    if (linkErr) {
      console.error(`  ✗ Failed to link ${c.name}: ${linkErr.message}`)
    } else {
      console.log(`✓ Linked commentator [tab ${orderIndex}]: ${c.name}`)
    }
  }

  // 4. Print next step
  console.log('\n' + '─'.repeat(60))
  console.log('Next step — run the ingestion script:')
  console.log()
  console.log(
    `  npx ts-node --project tsconfig.scripts.json scripts/ingest-text.ts \\`
  )
  console.log(`    --file path\\to\\your\\vadavali.txt \\`)
  console.log(`    --text-id ${text.id}`)
  console.log()
  console.log('The text will be hidden from learners (is_published = false) until')
  console.log('you approve passages in the Curator Portal and set is_published = true.')
  console.log('─'.repeat(60))
}

main().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
