/**
 * lib/argument-map-generator.ts
 *
 * Shared logic for generating argument map nodes via Claude.
 * Used by:
 *   scripts/generate-argument-maps.ts  (CLI, service-role Supabase client)
 *   app/api/admin/generate-argument-map/route.ts  (API route, SSR client)
 */
import Anthropic from '@anthropic-ai/sdk'
import type { SupabaseClient } from '@supabase/supabase-js'

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
  versionNumber: number
  nodeCount: number
}

// ── Prompt ────────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT =
  `You are a Mādhva Dvaita Vedānta scholar analyzing the logical argument structure ` +
  `of the Vādāvalī text. You extract argument nodes from Sanskrit philosophical text with precision.`

function buildUserPrompt(
  stream: ArgumentStream,
  sectionName: string | null,
  sequenceOrder: number,
  textContent: string,
): string {
  return `Analyze the following Sanskrit philosophical text from the Vādāvalī of Jayatīrtha and extract its argument structure.

Text stream: ${stream}
Section: ${sectionName ?? '(unnumbered)'}
Passage number: ${sequenceOrder}

Text to analyze:
${textContent}

Extract the argument nodes in sequence. For each node provide:
1. node_type: one of:
   - purva_paksha: the Advaitin's objection or position
   - khandana: Jayatīrtha/commentator's refutation
   - siddhanta: positive Tattvavāda conclusion established
   - shanka: a sub-objection or doubt raised
   - samadhanam: resolution of a shanka
   - upasamhara: summary or consolidation

2. content_english: clear English statement of this argument node (2-4 sentences max, technically precise)

3. content_sanskrit: key Sanskrit technical terms used (5-10 words, not full sentences)

4. logical_flaw: if node_type is khandana, name the specific logical flaw being exposed. Use standard nyāya terms:
   vyabhicara, asiddhi, viruddha, satpratipaksha, pratyaksha_badha, shruti_virodha,
   pratijnа_virodha, sopadhikatva, ashrayasiddhi, or null if not applicable

5. refutation_type: if node_type is khandana, classify as:
   - lakshanam: attacking a definition
   - pramanam: attacking means of knowledge
   - anumanam: attacking an inference (paksha/sadhya/hetu/drishtanta)
   - siddhanta: establishing positive position
   or null if not khandana

6. parent_index: 0-based index of parent node (for branching), or null if this is a root-level node

7. display_order: sequential integer starting from 0

Return ONLY a JSON array. No preamble. No explanation. Example:
[
  {
    "node_type": "purva_paksha",
    "content_english": "The Advaitin argues...",
    "content_sanskrit": "अनिर्वचनीयत्वम्, मिथ्यात्वम्",
    "logical_flaw": null,
    "refutation_type": null,
    "parent_index": null,
    "display_order": 0
  },
  {
    "node_type": "khandana",
    "content_english": "Jayatīrtha refutes...",
    "content_sanskrit": "व्याघातः, सिद्धसाधनम्",
    "logical_flaw": "vyabhicara",
    "refutation_type": "anumanam",
    "parent_index": 0,
    "display_order": 1
  }
]`
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

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Generates (or regenerates) argument map nodes for a passage × stream.
 * Deletes all existing nodes for that combination before inserting new ones.
 */
export async function generateArgumentMap(
  supabase: SupabaseClient,
  anthropic: Anthropic,
  passageId: string,
  stream: ArgumentStream,
  model: string,
): Promise<GenerateResult> {
  // 1. Fetch passage
  const { data: passage, error: passageErr } = await supabase
    .from('passages')
    .select('id, text_id, mula_text, section_name, sequence_order')
    .eq('id', passageId)
    .single()
  if (passageErr || !passage) {
    throw new Error(`Passage not found: ${passageId} — ${passageErr?.message ?? 'no data'}`)
  }

  // 2. Determine text content based on stream
  let textContent: string
  if (stream === 'mula') {
    textContent = passage.mula_text
  } else {
    const { data: commentaries } = await supabase
      .from('commentaries')
      .select('commentary_text, commentator:commentators(name, name_transliterated)')
      .eq('passage_id', passageId)

    // Rāghavendra Tīrtha → bhavadipika; Śrīnivāsa Tīrtha → vadavaliprakasha
    const targetName = stream === 'bhavadipika' ? 'raghavendra' : 'shrinivasa'
    const found = (commentaries ?? []).find((c: any) => {
      const name: string = (
        c.commentator?.name_transliterated ??
        c.commentator?.name ??
        ''
      ).toLowerCase()
      return name.includes(targetName)
    })
    if (!found?.commentary_text) {
      throw new Error(`No ${stream} commentary text found for passage ${passageId}`)
    }
    textContent = found.commentary_text
  }

  // 3. Call Claude
  const message = await anthropic.messages.create({
    model,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: buildUserPrompt(stream, passage.section_name, passage.sequence_order, textContent),
    }],
  })

  const raw = (message.content[0] as { type: string; text: string }).text.trim()
  const rawNodes: Array<{
    node_type: string
    content_english: string
    content_sanskrit: string | null
    logical_flaw: string | null
    refutation_type: string | null
    parent_index: number | null
    display_order: number
  }> = JSON.parse(cleanJson(raw))

  // 4. Delete existing nodes for this passage+stream (regeneration support)
  await supabase
    .from('argument_nodes')
    .delete()
    .eq('passage_id', passageId)
    .eq('stream', stream)

  // 5. Insert nodes sequentially, resolving parent_index → parent_node_id
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
        passage_id: passageId,
        stream,
        node_type: rawNode.node_type,
        content_english: rawNode.content_english,
        content_sanskrit: rawNode.content_sanskrit ?? null,
        logical_flaw: rawNode.logical_flaw ?? null,
        refutation_type: rawNode.refutation_type ?? null,
        parent_node_id: parentNodeId,
        display_order: rawNode.display_order,
        is_approved: false,
        ai_generated: true,
        ai_model: model,
      })
      .select('*')
      .single()

    if (insertErr || !inserted) {
      throw new Error(`Failed to insert node at display_order ${rawNode.display_order}: ${insertErr?.message}`)
    }
    insertedIds.push(inserted.id)
    insertedRows.push(inserted as ArgumentNodeRow)
  }

  // 6. Save version snapshot
  const { data: latestVersion } = await supabase
    .from('argument_map_versions')
    .select('version_number')
    .eq('passage_id', passageId)
    .eq('stream', stream)
    .order('version_number', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextVersion = (latestVersion?.version_number ?? 0) + 1

  // Mark previous versions as not current
  await supabase
    .from('argument_map_versions')
    .update({ is_current: false })
    .eq('passage_id', passageId)
    .eq('stream', stream)

  await supabase.from('argument_map_versions').insert({
    passage_id: passageId,
    stream,
    version_number: nextVersion,
    ai_model: model,
    nodes_json: rawNodes,
    is_current: true,
  })

  return { nodes: insertedRows, versionNumber: nextVersion, nodeCount: insertedRows.length }
}
