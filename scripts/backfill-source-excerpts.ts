/**
 * backfill-source-excerpts.ts
 *
 * Extracts **bold** verbatim spans from content_sanskrit into the dedicated
 * source_excerpt column -- no API calls, no cost.
 *
 * REWRITTEN 2026-08-07: the first version had no cross-stream validation --
 * it treated ANY bold span in a node's content_sanskrit as a valid excerpt for
 * THAT node, even when the bold span was actually quoting the OTHER stream
 * (e.g. a mula-stream node's explanation legitimately bold-quoting a kashika
 * phrase while discussing it -- the original **bold** convention was never
 * stream-restricted, only source_excerpt needs to be). This produced real,
 * confirmed-in-production errors: a mula node showing a kashika quote as its
 * "source". Now every candidate excerpt is verified (after whitespace
 * normalization) against the CORRECT stream's own source text before being
 * kept -- if it doesn't match its own stream (even if it matches a DIFFERENT
 * stream, or matches nothing at all), it's dropped rather than shown wrong.
 *
 * Also now REPROCESSES every node with bold spans, not just ones where
 * source_excerpt is still null -- needed to correct the already-wrong values
 * a previous run of this script may have written.
 *
 * USAGE
 *   npx ts-node --project tsconfig.scripts.json scripts/backfill-source-excerpts.ts
 *     [--text-id <uuid>]   limit to one text (default: all texts)
 *     [--dry-run]          preview without writing
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

const COMMENTATOR_STREAM_FRAGMENTS: Record<string, string> = {
  raghavendra:  'bhavadipika',
  shrinivasa:   'vadavaliprakasha',
  kashitirumal: 'kashika',
}

function getArg(name: string): string | undefined {
  const i = process.argv.indexOf(name)
  return i !== -1 ? process.argv[i + 1] : undefined
}
function hasFlag(name: string) { return process.argv.includes(name) }

function extractBoldSpans(text: string): string[] {
  return [...text.matchAll(/\*\*(.+?)\*\*/gs)].map(m => m[1].trim()).filter(Boolean)
}

function normalize(s: string): string {
  return s.replace(/\s+/g, '')
}

// Supabase/PostgREST silently caps unbounded queries at 1000 rows -- this is
// exactly the kind of bug that caused a node to be missed entirely in
// practice (vādāvalī + bhēdōjjīvanam combined easily exceed 1000 argument_nodes
// rows). Page through explicitly rather than trusting a single query to
// return everything.
async function fetchAllRows<T>(
  build: (from: number, to: number) => Promise<{ data: T[] | null; error: any }>,
  pageSize = 1000,
): Promise<T[]> {
  const all: T[] = []
  let from = 0
  while (true) {
    const { data, error } = await build(from, from + pageSize - 1)
    if (error) { console.error('ERROR paginating:', error.message); process.exit(1) }
    if (!data || data.length === 0) break
    all.push(...data)
    if (data.length < pageSize) break
    from += pageSize
  }
  return all
}

async function main() {
  const textId = getArg('--text-id')
  const dryRun = hasFlag('--dry-run')

  console.log('=== backfill-source-excerpts (v2, with cross-stream validation) ===\n')
  console.log(`Scope   : ${textId ? `text_id = ${textId}` : 'ALL texts'}`)
  console.log(`Mode    : ${dryRun ? 'DRY RUN -- no writes' : 'LIVE -- will update'}\n`)

  // 1. Fetch nodes with bold spans (reprocess ALL, not just null ones --
  // need to correct any already-wrong values from a previous run). Paginated
  // explicitly -- this table alone can exceed the 1000-row default cap.
  const allNodes = await fetchAllRows(async (from, to) =>
    supabase
      .from('argument_nodes')
      .select('id, passage_id, stream, content_sanskrit, source_excerpt')
      .not('content_sanskrit', 'is', null)
      .range(from, to)
  )
  console.log(`Total argument_nodes with content_sanskrit fetched: ${allNodes.length} (paginated, not capped at 1000)`)

  let nodes = allNodes.filter(n => extractBoldSpans(n.content_sanskrit ?? '').length > 0)

  // 2. Fetch passages (mula_text) and commentaries, scoped if --text-id given
  // Also paginated -- vadavali (126) + bhedojjivanam (176) is only ~300 total,
  // safely under 1000, but paginating unconditionally removes the risk entirely
  // rather than relying on "probably fine at current scale".
  const passages = await fetchAllRows(async (from, to) => {
    let q = supabase.from('passages').select('id, text_id, mula_text').range(from, to)
    if (textId) q = q.eq('text_id', textId)
    return q
  })
  const passageIds = new Set(passages.map(p => p.id))

  if (textId) nodes = nodes.filter(n => passageIds.has(n.passage_id))

  console.log(`Nodes with bold spans to (re)process: ${nodes.length}`)

  const mulaTextByPassage = new Map(passages.map(p => [p.id, p.mula_text as string]))

  const relevantPassageIds = [...new Set(nodes.map(n => n.passage_id))]
  const commentaries = await fetchAllRows(async (from, to) =>
    supabase
      .from('commentaries')
      .select('passage_id, commentary_text, commentator:commentators(name, name_transliterated)')
      .in('passage_id', relevantPassageIds)
      .range(from, to)
  )

  // passage_id -> stream -> text
  const commentaryTextByPassageAndStream = new Map<string, Map<string, string>>()
  for (const c of commentaries) {
    const commentatorName: string = (
      (c as any).commentator?.name_transliterated ?? (c as any).commentator?.name ?? ''
    ).toLowerCase()
    const stream = Object.entries(COMMENTATOR_STREAM_FRAGMENTS)
      .find(([fragment]) => commentatorName.includes(fragment))?.[1]
    if (!stream) continue
    if (!commentaryTextByPassageAndStream.has(c.passage_id)) {
      commentaryTextByPassageAndStream.set(c.passage_id, new Map())
    }
    commentaryTextByPassageAndStream.get(c.passage_id)!.set(stream, c.commentary_text)
  }

  function ownSourceText(passageId: string, stream: string): string | null {
    if (stream === 'mula') return mulaTextByPassage.get(passageId) ?? null
    return commentaryTextByPassageAndStream.get(passageId)?.get(stream) ?? null
  }

  // 3. Build validated excerpts
  const updates: { id: string; source_excerpt: string | null }[] = []
  let kept = 0, droppedCrossStream = 0, droppedNoMatch = 0, unchanged = 0

  for (const n of nodes) {
    const spans = extractBoldSpans(n.content_sanskrit ?? '')
    const ownText = ownSourceText(n.passage_id, n.stream)
    const normOwn = ownText ? normalize(ownText) : ''

    const validSpans = spans.filter(s => normOwn && normOwn.includes(normalize(s)))
    const newExcerpt = validSpans.length > 0 ? validSpans.join(' ... ') : null

    if (newExcerpt !== n.source_excerpt) {
      updates.push({ id: n.id, source_excerpt: newExcerpt })
    } else {
      unchanged++
    }

    if (newExcerpt) {
      kept++
    } else {
      const matchesOtherStream = spans.some(s =>
        (['mula', 'bhavadipika', 'vadavaliprakasha', 'kashika'] as const)
          .filter(s2 => s2 !== n.stream)
          .some(s2 => {
            const t = ownSourceText(n.passage_id, s2)
            return t && normalize(t).includes(normalize(s))
          })
      )
      if (matchesOtherStream) droppedCrossStream++
      else droppedNoMatch++
    }
  }

  console.log(`\n  Kept (validated against own stream) : ${kept}`)
  console.log(`  Dropped -- matched a DIFFERENT stream: ${droppedCrossStream}  (the exact bug this fixes)`)
  console.log(`  Dropped -- matched no source at all  : ${droppedNoMatch}`)
  console.log(`  Unchanged (already correct)          : ${unchanged}`)
  console.log(`  Total writes needed                  : ${updates.length}`)

  if (dryRun) {
    console.log('\nSample changes:')
    for (const u of updates.slice(0, 8)) {
      console.log(`  [${u.id.slice(0, 8)}] -> ${u.source_excerpt ? `"${u.source_excerpt.slice(0, 80)}"` : 'null'}`)
    }
    console.log('\nDry run -- nothing written. Re-run without --dry-run to apply.')
    return
  }

  console.log('\nWriting…')
  let done = 0, errs = 0
  for (const u of updates) {
    const { error: updErr } = await supabase
      .from('argument_nodes')
      .update({ source_excerpt: u.source_excerpt })
      .eq('id', u.id)
    if (updErr) { errs++; console.error(`  ERROR on ${u.id}: ${updErr.message}`) }
    else done++
  }

  console.log(`\nDone. Updated: ${done}  Errors: ${errs}`)
}

main().catch(err => { console.error('Unexpected error:', err); process.exit(1) })
