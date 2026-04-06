/**
 * lib/argument-map-generator.ts
 *
 * Shared logic for generating argument map nodes via Claude.
 * Generates ALL THREE streams in a single API call per passage.
 *
 * Used by:
 *   scripts/generate-argument-maps.ts  (CLI, service-role Supabase client)
 *   app/api/admin/generate-argument-map/route.ts  (API route, SSR client)
 */
import Anthropic from '@anthropic-ai/sdk'
import type { SupabaseClient } from '@supabase/supabase-js'

// ── Types ─────────────────────────────────────────────────────────────────────

export type ArgumentStream = 'mula' | 'bhavadipika' | 'vadavaliprakasha'

export const ARGUMENT_STREAMS: ArgumentStream[] = ['mula', 'bhavadipika', 'vadavaliprakasha']

export interface ArgumentNodeRow {
  id: string
  passage_id: string
  stream: ArgumentStream
  node_type: string
  content_english: string
  content_sanskrit: string | null
  logical_flaw: string | null
  refutation_type: string | null
  parent_node_id: string | null
  display_order: number
  is_approved: boolean
  ai_generated: boolean
  ai_model: string | null
  created_at: string
  updated_at: string
}

export interface GenerateResult {
  nodes: ArgumentNodeRow[]
  streamCounts: Record<ArgumentStream, number>
  totalCount: number
}

// ── Prompts ───────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT =
  `You are an expert scholar of Mādhva Dvaita Vedānta (Tattvavāda) with deep mastery of ` +
  `nyāya-śāstra, Sanskrit grammar, and the Vādāvalī of Jayatīrtha. You generate rigorous ` +
  `argument maps that help students understand the precise logical flow of Sanskrit ` +
  `philosophical debate. Your Sanskrit is 100% pure classical Sanskrit — never Hindi, ` +
  `never mixed script, no grammatical errors. When quoting phrases from mūla or ` +
  `commentary, wrap them in **double asterisks**. Every explanation must be logically ` +
  `precise and pedagogically clear. ` +
  `CRITICAL ATTRIBUTION: The Vādāvalī mūla text is by Jayatīrtha (जयतीर्थमुनिः). ` +
  `The bhāvadīpikā commentary is by Rāghavendra Tīrtha (श्रीमद्राघवेन्द्रतीर्थाः) — ` +
  `never call him रघूत्तमतीर्थाः or any other name. ` +
  `The vādāvalīprakāśa commentary is by Śrīnivāsa Tīrtha (श्रीनिवासतीर्थाः). ` +
  `Use these exact Sanskrit names consistently throughout all generated content.`

function buildUserPrompt(
  sectionName: string | null,
  sequenceOrder: number,
  mulaText: string,
  bhavadipika: string | null,
  vadavaliprakasha: string | null,
): string {
  const texts: string[] = []
  texts.push(`── MŪLA TEXT ──────────────────────────────────────────────────────────────`)
  texts.push(mulaText)
  if (bhavadipika) {
    texts.push(``)
    texts.push(`── BHĀVADĪPIKĀ — श्रीमद्राघवेन्द्रतीर्थाः ───────────────────────────────────`)
    texts.push(bhavadipika)
  }
  if (vadavaliprakasha) {
    texts.push(``)
    texts.push(`── VĀDĀVALĪPRAKĀŚA — श्रीनिवासतीर्थाः ────────────────────────────────────────`)
    texts.push(vadavaliprakasha)
  }

  const noCommentary = !bhavadipika && !vadavaliprakasha

  return `Analyze this passage from the Vādāvalī of Jayatīrtha and generate a complete argument map.

Section: ${sectionName ?? '(unnumbered)'}
Passage: ${sequenceOrder}

${texts.join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1 — Generate MŪLA nodes first (stream: "mula").
The mūla nodes form the primary argument spine in logical sequence:
  purva_paksha → shanka → khandana → samadhanam → siddhanta → upasamhara
(use only the node types that genuinely appear in this passage)
- The root mūla node has parent_index: null
- Child mūla nodes point to their parent by 0-based index in the full output array

STEP 2 — Generate BHĀVADĪPIKĀ nodes (stream: "bhavadipika").${bhavadipika
  ? `
Each bhavadipika node elaborates on a specific mūla node.
- parent_index MUST point to the mūla node it elaborates (0-based index in the full array)
- Use the same node_type as the mūla node being elaborated`
  : `
No bhavadipika text available — output zero bhavadipika nodes.`}

STEP 3 — Generate VĀDĀVALĪPRAKĀŚA nodes (stream: "vadavaliprakasha").${vadavaliprakasha
  ? `
Each vadavaliprakasha node elaborates on a specific mūla node.
- parent_index MUST point to the mūla node it elaborates (0-based index in the full array)
- Use the same node_type as the mūla node being elaborated`
  : `
No vadavaliprakasha text available — output zero vadavaliprakasha nodes.`}

CONTENT RULES:

content_english — rigorous English explanation (2–5 sentences, technically precise)

content_sanskrit — CRITICAL RULES:
  • Must be a complete, grammatically correct Sanskrit explanation of the argument
  • Must read as proper Sanskrit philosophical prose — NOT a transliteration of the English
  • Any verbatim phrase quoted from mūla or commentary must be wrapped in **double asterisks**
  • Zero Hindi, zero mixed script, zero grammatical errors

For khandana nodes only:
  logical_flaw — the specific nyāya flaw being exposed:
    vyabhichara | asiddha | savyabhichara | badhita | viruddha |
    satpratipaksha | pratyakshabadhita | shrutivirodha | ashrayasiddha | null
  refutation_type — lakshanam | pramanam | anumanam | siddhanta

OUTPUT FORMAT:
Return ONLY a valid JSON array. No preamble. No explanation. No markdown fences.
Array order: all mūla nodes first (ascending display_order), then bhavadipika, then vadavaliprakasha.

Each element must have exactly these fields:
{
  "stream": "mula" | "bhavadipika" | "vadavaliprakasha",
  "node_type": "purva_paksha" | "shanka" | "khandana" | "samadhanam" | "siddhanta" | "upasamhara",
  "content_english": "...",
  "content_sanskrit": "...",
  "logical_flaw": null or string,
  "refutation_type": null | "lakshanam" | "pramanam" | "anumanam" | "siddhanta",
  "parent_index": null or 0-based integer index into this array,
  "display_order": 0-based integer (resets to 0 for each stream)
}
${noCommentary
  ? '\nNOTE: Only mūla text is available. Generate only stream: "mula" nodes.'
  : ''}`
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function cleanJson(raw: string): string {
  const first = Math.min(
    raw.indexOf('[') === -1 ? Infinity : raw.indexOf('['),
    raw.indexOf('{') === -1 ? Infinity : raw.indexOf('{'),
  )
  if (first === Infinity) return raw.trim()
  const last = Math.max(raw.lastIndexOf(']'), raw.lastIndexOf('}'))
  if (last === -1) return raw.trim()
  return raw.slice(first, last + 1).trim()
}

function countByStream(nodes: ArgumentNodeRow[]): Record<ArgumentStream, number> {
  const counts: Record<ArgumentStream, number> = { mula: 0, bhavadipika: 0, vadavaliprakasha: 0 }
  for (const n of nodes) counts[n.stream] = (counts[n.stream] ?? 0) + 1
  return counts
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Generates argument map nodes for ALL THREE streams in one Claude API call.
 * Deletes all existing nodes for this passage before inserting new ones.
 */
export async function generateArgumentMap(
  supabase: SupabaseClient,
  anthropic: Anthropic,
  passageId: string,
  model: string,
): Promise<GenerateResult> {
  // 1. Fetch passage + all commentaries in one round trip
  const [{ data: passage, error: passageErr }, { data: commentaries }] = await Promise.all([
    supabase
      .from('passages')
      .select('id, text_id, mula_text, section_name, sequence_order')
      .eq('id', passageId)
      .single(),
    supabase
      .from('commentaries')
      .select('commentary_text, commentator:commentators(name, name_transliterated)')
      .eq('passage_id', passageId),
  ])

  if (passageErr || !passage) {
    throw new Error(`Passage not found: ${passageId} — ${passageErr?.message ?? 'no data'}`)
  }

  function findCommentary(nameFragment: string): string | null {
    const found = (commentaries ?? []).find((c: any) => {
      const name: string = (
        c.commentator?.name_transliterated ??
        c.commentator?.name ??
        ''
      ).toLowerCase()
      return name.includes(nameFragment)
    })
    return found?.commentary_text ?? null
  }

  const bhavadipika = findCommentary('raghavendra')
  const vadavaliprakasha = findCommentary('shrinivasa')

  // 2. Call Claude once for all three streams
  const message = await anthropic.messages.create({
    model,
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: buildUserPrompt(
        passage.section_name,
        passage.sequence_order,
        passage.mula_text,
        bhavadipika,
        vadavaliprakasha,
      ),
    }],
  })

  const raw = (message.content[0] as { type: string; text: string }).text.trim()
  const rawNodes: Array<{
    stream: ArgumentStream
    node_type: string
    content_english: string
    content_sanskrit: string | null
    logical_flaw: string | null
    refutation_type: string | null
    parent_index: number | null
    display_order: number
  }> = (() => {
    try {
      return JSON.parse(cleanJson(raw))
    } catch (err) {
      console.error('JSON.parse failed. Raw response head (500):', raw.slice(0, 500))
      console.error('Raw response tail (500):', raw.slice(-500))
      throw err
    }
  })()

  // 3. Delete all existing nodes for this passage (all streams)
  await supabase
    .from('argument_nodes')
    .delete()
    .eq('passage_id', passageId)

  // 4. Insert nodes sequentially, resolving parent_index → UUID
  const insertedIds: string[] = []
  const insertedRows: ArgumentNodeRow[] = []

  for (const rawNode of rawNodes) {
    const parentNodeId: string | null =
      rawNode.parent_index != null && rawNode.parent_index < insertedIds.length
        ? (insertedIds[rawNode.parent_index] ?? null)
        : null

    const { data: inserted, error: insertErr } = await supabase
      .from('argument_nodes')
      .insert({
        passage_id:      passageId,
        stream:          rawNode.stream,
        node_type:       rawNode.node_type,
        content_english: rawNode.content_english,
        content_sanskrit: rawNode.content_sanskrit ?? null,
        logical_flaw:    rawNode.logical_flaw ?? null,
        refutation_type: rawNode.refutation_type ?? null,
        parent_node_id:  parentNodeId,
        display_order:   rawNode.display_order,
        is_approved:     false,
        ai_generated:    true,
        ai_model:        model,
      })
      .select('*')
      .single()

    if (insertErr || !inserted) {
      throw new Error(
        `Failed to insert node (stream=${rawNode.stream}, display_order=${rawNode.display_order}): ` +
        (insertErr?.message ?? 'no data returned'),
      )
    }
    insertedIds.push(inserted.id)
    insertedRows.push(inserted as ArgumentNodeRow)
  }

  // 5. Save version snapshots — one per stream
  const streamNodes = {
    mula:             insertedRows.filter(n => n.stream === 'mula'),
    bhavadipika:      insertedRows.filter(n => n.stream === 'bhavadipika'),
    vadavaliprakasha: insertedRows.filter(n => n.stream === 'vadavaliprakasha'),
  }

  for (const stream of ARGUMENT_STREAMS) {
    if (streamNodes[stream].length === 0) continue

    // Mark previous versions not current
    await supabase
      .from('argument_map_versions')
      .update({ is_current: false })
      .eq('passage_id', passageId)
      .eq('stream', stream)

    const { data: latest } = await supabase
      .from('argument_map_versions')
      .select('version_number')
      .eq('passage_id', passageId)
      .eq('stream', stream)
      .order('version_number', { ascending: false })
      .limit(1)
      .maybeSingle()

    await supabase.from('argument_map_versions').insert({
      passage_id:     passageId,
      stream,
      version_number: (latest?.version_number ?? 0) + 1,
      ai_model:       model,
      nodes_json:     rawNodes.filter(n => n.stream === stream),
      is_current:     true,
    })
  }

  return {
    nodes:        insertedRows,
    streamCounts: countByStream(insertedRows),
    totalCount:   insertedRows.length,
  }
}
