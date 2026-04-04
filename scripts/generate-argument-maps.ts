/**
 * generate-argument-maps.ts
 *
 * Uses Claude to analyze each passage and extract argument map nodes
 * for the three streams (mula, bhavadipika, vadavaliprakasha).
 *
 * Usage:
 *   npx ts-node --project tsconfig.scripts.json scripts/generate-argument-maps.ts
 *     [--passage-id UUID]
 *     [--stream mula|bhavadipika|vadavaliprakasha]
 *     [--start-from N]          skip passages with sequence_order < N
 *     [--model claude-sonnet-4-6]
 *
 * By default processes all approved passages × all three streams.
 * Skips any passage+stream that already has nodes — re-run with the
 * generate-argument-map API route (curator UI) to regenerate specific ones.
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { generateArgumentMap, ARGUMENT_STREAMS } from '../lib/argument-map-generator'
import type { ArgumentStream } from '../lib/argument-map-generator'

// ── Load .env.local ───────────────────────────────────────────────────────────

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

// ── Config ────────────────────────────────────────────────────────────────────

const TEXT_ID = 'c0219559-a8a9-4ebb-be5b-eca29b921457'
const DELAY_MS = 500
const DEFAULT_MODEL = 'claude-sonnet-4-6'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!

for (const [k, v] of Object.entries({
  NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: SERVICE_ROLE_KEY,
  ANTHROPIC_API_KEY,
})) {
  if (!v) { console.error(`ERROR: Missing env var ${k}`); process.exit(1) }
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

function getArg(name: string): string | undefined {
  const idx = process.argv.indexOf(name)
  return idx !== -1 ? process.argv[idx + 1] : undefined
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== generate-argument-maps ===\n')

  const passageIdArg = getArg('--passage-id')
  const streamArg = getArg('--stream') as ArgumentStream | undefined
  const startFrom = parseInt(getArg('--start-from') ?? '1')
  const model = getArg('--model') ?? DEFAULT_MODEL

  if (streamArg && !ARGUMENT_STREAMS.includes(streamArg)) {
    console.error(`ERROR: --stream must be one of: ${ARGUMENT_STREAMS.join(', ')}`)
    process.exit(1)
  }

  const streamsToProcess: ArgumentStream[] = streamArg ? [streamArg] : [...ARGUMENT_STREAMS]

  console.log(`Model    : ${model}`)
  console.log(`Streams  : ${streamsToProcess.join(', ')}`)
  if (startFrom > 1) console.log(`Start    : sequence_order >= ${startFrom}`)

  // Fetch passages
  let passages: Array<{ id: string; sequence_order: number; section_name: string | null }>

  if (passageIdArg) {
    const { data, error } = await supabase
      .from('passages')
      .select('id, sequence_order, section_name')
      .eq('id', passageIdArg)
      .eq('text_id', TEXT_ID)
      .single()
    if (error || !data) {
      console.error(`ERROR: Passage ${passageIdArg} not found — ${error?.message}`)
      process.exit(1)
    }
    passages = [data]
  } else {
    const { data, error } = await supabase
      .from('passages')
      .select('id, sequence_order, section_name')
      .eq('text_id', TEXT_ID)
      .eq('is_approved', true)
      .order('sequence_order')
    if (error || !data) {
      console.error('ERROR: Failed to fetch passages:', error?.message)
      process.exit(1)
    }
    passages = data.filter(p => p.sequence_order >= startFrom)
  }

  const totalCombinations = passages.length * streamsToProcess.length
  console.log(`\nPassages : ${passages.length}`)
  console.log(`Total    : ${totalCombinations} combinations to process\n`)

  let successCount = 0
  let skipCount = 0
  let errorCount = 0

  for (const passage of passages) {
    for (const stream of streamsToProcess) {
      // Skip if nodes already exist
      const { count } = await supabase
        .from('argument_nodes')
        .select('*', { count: 'exact', head: true })
        .eq('passage_id', passage.id)
        .eq('stream', stream)

      if ((count ?? 0) > 0) {
        console.log(`  [§${passage.sequence_order}] ${stream} — skipped (${count} nodes exist)`)
        skipCount++
        continue
      }

      try {
        const result = await generateArgumentMap(supabase, anthropic, passage.id, stream, model)
        console.log(`  [§${passage.sequence_order}] ${stream} — ${result.nodeCount} nodes (v${result.versionNumber})`)
        successCount++
      } catch (err: any) {
        console.error(`  [§${passage.sequence_order}] ${stream} — ERROR: ${err.message}`)
        errorCount++
      }

      await sleep(DELAY_MS)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('SUMMARY')
  console.log('='.repeat(60))
  console.log(`Generated : ${successCount}`)
  console.log(`Skipped   : ${skipCount} (already had nodes — use curator UI to regenerate)`)
  console.log(`Errors    : ${errorCount}`)
  console.log('\nDone.')
}

main().catch(err => { console.error('Unexpected error:', err); process.exit(1) })
