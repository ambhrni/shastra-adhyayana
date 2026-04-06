/**
 * generate-argument-maps.ts
 *
 * Uses Claude to generate argument map nodes for ALL THREE streams
 * (mula, bhavadipika, vadavaliprakasha) in a single API call per passage.
 *
 * Usage:
 *   npx ts-node --project tsconfig.scripts.json scripts/generate-argument-maps.ts
 *     [--passage-id UUID]     process a single passage
 *     [--start-from N]        skip passages with sequence_order < N
 *     [--model claude-opus-4-6]
 *     [--force]               regenerate even if nodes already exist
 *
 * Default: processes all approved passages, skipping any that already have nodes.
 * Use --force to delete existing nodes and regenerate from scratch.
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { generateArgumentMap } from '../lib/argument-map-generator'
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

const TEXT_ID       = 'c0219559-a8a9-4ebb-be5b-eca29b921457'
const DELAY_MS      = 2000
const DEFAULT_MODEL = 'claude-opus-4-6'

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!

for (const [k, v] of Object.entries({
  NEXT_PUBLIC_SUPABASE_URL: SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: SERVICE_ROLE_KEY,
  ANTHROPIC_API_KEY,
})) {
  if (!v) { console.error(`ERROR: Missing env var ${k}`); process.exit(1) }
}

const supabase  = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

// ── Helpers ───────────────────────────────────────────────────────────────────

const PROGRESS_LOG = path.join(__dirname, 'argument-map-progress.log')

function sleep(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)) }

function appendProgress(line: string) {
  fs.appendFileSync(PROGRESS_LOG, line + '\n', 'utf-8')
}

function showRecentProgress() {
  if (!fs.existsSync(PROGRESS_LOG)) return
  const lines = fs.readFileSync(PROGRESS_LOG, 'utf-8').split('\n').filter(Boolean)
  if (lines.length === 0) return
  console.log('── Last progress ──────────────────────────────────────')
  lines.slice(-3).forEach(l => console.log(' ', l))
  console.log('───────────────────────────────────────────────────────\n')
}

function getArg(name: string): string | undefined {
  const idx = process.argv.indexOf(name)
  return idx !== -1 ? process.argv[idx + 1] : undefined
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name)
}

function streamBreakdown(counts: Record<ArgumentStream, number>): string {
  return (['mula', 'bhavadipika', 'vadavaliprakasha'] as ArgumentStream[])
    .map(s => `${s}:${counts[s]}`)
    .join('  ')
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== generate-argument-maps ===\n')
  showRecentProgress()

  const passageIdArg = getArg('--passage-id')
  const startFrom    = parseInt(getArg('--start-from') ?? '1')
  const model        = getArg('--model') ?? DEFAULT_MODEL
  const force        = hasFlag('--force')

  console.log(`Model  : ${model}`)
  console.log(`Force  : ${force ? 'yes — will delete existing nodes and regenerate' : 'no — skipping passages with existing nodes'}`)
  if (startFrom > 1) console.log(`Start  : sequence_order >= ${startFrom}`)

  // Fetch passages
  let passages: Array<{ id: string; sequence_order: number; section_number: number | null; section_name: string | null }>

  if (passageIdArg) {
    const { data, error } = await supabase
      .from('passages')
      .select('id, sequence_order, section_number, section_name')
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
      .select('id, sequence_order, section_number, section_name')
      .eq('text_id', TEXT_ID)
      .eq('is_approved', true)
      .order('sequence_order')
    if (error || !data) {
      console.error('ERROR: Failed to fetch passages:', error?.message)
      process.exit(1)
    }
    passages = data.filter(p => p.sequence_order >= startFrom)
  }

  console.log(`\nPassages : ${passages.length}\n`)

  let successCount = 0
  let skipCount    = 0
  let errorCount   = 0

  for (const passage of passages) {
    const label = `[§${passage.section_number ?? '?'} p${passage.sequence_order}]`

    // Check for existing nodes (any stream)
    if (!force) {
      const { count } = await supabase
        .from('argument_nodes')
        .select('*', { count: 'exact', head: true })
        .eq('passage_id', passage.id)

      if ((count ?? 0) > 0) {
        console.log(`  ${label} skipped (${count} nodes exist — use --force to regenerate)`)
        skipCount++
        continue
      }
    }

    try {
      const result = await generateArgumentMap(supabase, anthropic, passage.id, model)
      const summary = `${result.totalCount} nodes — ${streamBreakdown(result.streamCounts)}`
      console.log(`  ${label} ${summary}`)
      appendProgress(`[${new Date().toISOString()}] ${label} — ${summary} OK`)
      successCount++
    } catch (err: any) {
      console.error(`  ${label} ERROR: ${err.message}`)
      errorCount++
    }

    await sleep(DELAY_MS)
  }

  console.log('\n' + '='.repeat(60))
  console.log('SUMMARY')
  console.log('='.repeat(60))
  console.log(`Generated : ${successCount}`)
  console.log(`Skipped   : ${skipCount}`)
  console.log(`Errors    : ${errorCount}`)
  console.log('\nDone.')
}

main().catch(err => { console.error('Unexpected error:', err); process.exit(1) })
