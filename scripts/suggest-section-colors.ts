/**
 * suggest-section-colors.ts
 *
 * Populates section_argument_types with a SUGGESTED starting classification
 * per section, derived from the argument_nodes already generated for this
 * text -- no new API calls, no cost. Curator reviews/adjusts via the
 * Curator Portal's "Section Colors" panel afterward; this just avoids
 * starting from 125 blank dropdowns.
 *
 * Heuristic (in priority order):
 *   1. Section name contains a maṅgala/opening or upasaṃhāra/closing marker
 *      → 'opening_closing'
 *   2. Section has khaṇḍana-type mūla nodes with a refutation_type set
 *      → the most frequent refutation_type among them
 *      (lakshanam | pramanam | anumanam | siddhanta)
 *   3. Section has siddhānta-type nodes but no khaṇḍana → 'siddhanta'
 *   4. Otherwise → 'anumanam' (matches the UI's own default)
 *
 * This is a best-effort STARTING POINT, not a final answer -- curator
 * judgment on individual sections matters more than this heuristic,
 * especially for sections with mixed/ambiguous argument structure.
 *
 * USAGE
 *   npx ts-node --project tsconfig.scripts.json scripts/suggest-section-colors.ts \
 *     --text-id <uuid> [--dry-run]
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) { console.error('ERROR: .env.local not found.'); process.exit(1) }
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim()
    if (k && !(k in process.env)) process.env[k] = v
  }
}
loadEnv()

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const OPENING_CLOSING_MARKERS = ['मङ्गल', 'मंगल', 'उपसंहार', 'अन्तिम', 'उपोद्घात']
const REFUTATION_TYPES = ['lakshanam', 'pramanam', 'anumanam', 'siddhanta']

function getArg(name: string): string | undefined {
  const i = process.argv.indexOf(name)
  return i !== -1 ? process.argv[i + 1] : undefined
}
function hasFlag(name: string) { return process.argv.includes(name) }

async function main() {
  const textId  = getArg('--text-id')
  const dryRun  = hasFlag('--dry-run')
  if (!textId) { console.error('ERROR: --text-id required'); process.exit(1) }

  console.log('=== suggest-section-colors ===\n')
  console.log(`Text ID : ${textId}`)
  console.log(`Mode    : ${dryRun ? 'DRY RUN -- no writes' : 'LIVE -- will upsert'}\n`)

  const { data: passages, error: passErr } = await supabase
    .from('passages')
    .select('id, section_number, section_name')
    .eq('text_id', textId)
    .not('section_number', 'is', null)

  if (passErr || !passages) { console.error('ERROR fetching passages:', passErr?.message); process.exit(1) }

  const passageIds = passages.map(p => p.id)
  const { data: nodes, error: nodeErr } = await supabase
    .from('argument_nodes')
    .select('passage_id, node_type, refutation_type, stream')
    .in('passage_id', passageIds)
    .eq('stream', 'mula')

  if (nodeErr) { console.error('ERROR fetching argument_nodes:', nodeErr.message); process.exit(1) }

  const passageToSection = new Map(passages.map(p => [p.id, p.section_number as number]))
  const sectionNames = new Map<number, string>()
  for (const p of passages) {
    if (!sectionNames.has(p.section_number!)) sectionNames.set(p.section_number!, p.section_name ?? '')
  }

  // Group nodes by section
  const bySection = new Map<number, { node_type: string; refutation_type: string | null }[]>()
  for (const n of nodes ?? []) {
    const sec = passageToSection.get(n.passage_id)
    if (sec == null) continue
    if (!bySection.has(sec)) bySection.set(sec, [])
    bySection.get(sec)!.push({ node_type: n.node_type, refutation_type: n.refutation_type })
  }

  const results: { section_number: number; section_name: string; argument_type: string; reason: string }[] = []

  for (const [sec, name] of Array.from(sectionNames.entries()).sort(([a], [b]) => a - b)) {
    if (OPENING_CLOSING_MARKERS.some(m => name.includes(m))) {
      results.push({ section_number: sec, section_name: name, argument_type: 'opening_closing', reason: 'name marker' })
      continue
    }

    const secNodes = bySection.get(sec) ?? []
    const khandanaTypes = secNodes
      .filter(n => n.node_type === 'khandana' && n.refutation_type && REFUTATION_TYPES.includes(n.refutation_type))
      .map(n => n.refutation_type!)

    if (khandanaTypes.length > 0) {
      const counts: Record<string, number> = {}
      for (const t of khandanaTypes) counts[t] = (counts[t] ?? 0) + 1
      const top = Object.entries(counts).sort(([, a], [, b]) => b - a)[0][0]
      results.push({ section_number: sec, section_name: name, argument_type: top, reason: `most common of ${khandanaTypes.length} khandana refutation_type(s)` })
      continue
    }

    const hasSiddhanta = secNodes.some(n => n.node_type === 'siddhanta')
    if (hasSiddhanta) {
      results.push({ section_number: sec, section_name: name, argument_type: 'siddhanta', reason: 'siddhanta node(s), no khandana' })
      continue
    }

    results.push({ section_number: sec, section_name: name, argument_type: 'anumanam', reason: 'default fallback -- no strong signal' })
  }

  console.log(`Sections: ${results.length}\n`)
  for (const r of results) {
    console.log(`  §${r.section_number}  ${r.argument_type.padEnd(16)} (${r.reason})  ${r.section_name}`)
  }

  const byType: Record<string, number> = {}
  for (const r of results) byType[r.argument_type] = (byType[r.argument_type] ?? 0) + 1
  console.log('\nBreakdown:', byType)

  if (dryRun) {
    console.log('\nDry run -- nothing written. Re-run without --dry-run to upsert.')
    return
  }

  console.log('\nUpserting…')
  const rows = results.map(r => ({
    text_id: textId,
    section_number: r.section_number,
    section_name: r.section_name,
    argument_type: r.argument_type,
  }))

  const { error: upsertErr } = await supabase
    .from('section_argument_types')
    .upsert(rows, { onConflict: 'text_id,section_number' })

  if (upsertErr) { console.error('ERROR upserting:', upsertErr.message); process.exit(1) }
  console.log(`Done. ${rows.length} section(s) written as SUGGESTIONS -- review and adjust via Curator Portal → Argument Maps → Section Colors.`)
}

main().catch(err => { console.error('Unexpected error:', err); process.exit(1) })
