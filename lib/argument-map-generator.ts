/**
 * lib/argument-map-generator.ts
 *
 * Shared logic for generating argument map nodes via Claude.
 * Detects available commentary streams dynamically — works for both
 * Vādāvalī (bhavadipika + vadavaliprakasha) and Bhēdōjjīvanam (kashika).
 *
 * Used by:
 *   scripts/generate-argument-maps.ts  (CLI, service-role Supabase client)
 *   app/api/admin/generate-argument-map/route.ts  (API route, SSR client)
 */
import Anthropic from '@anthropic-ai/sdk'
import type { SupabaseClient } from '@supabase/supabase-js'

// ── Types ─────────────────────────────────────────────────────────────────────

export type ArgumentStream = 'mula' | 'bhavadipika' | 'vadavaliprakasha' | 'kashika'

/** All streams supported by vādāvalī — kept for backwards-compat with callers. */
export const ARGUMENT_STREAMS: ArgumentStream[] = ['mula', 'bhavadipika', 'vadavaliprakasha']

export interface ArgumentNodeRow {
  id: string
  passage_id: string
  stream: ArgumentStream
  node_type: string
  content_english: string
  content_sanskrit: string | null
  source_excerpt: string | null
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
  streamCounts: Record<string, number>
  totalCount: number
}

// ── Commentary detection ──────────────────────────────────────────────────────

interface CommentaryDetector {
  fragment:       string
  stream:         ArgumentStream
  headerLabel:    string          // used in prompt section dividers
  authorSanskrit: string          // used in prompt and system attribution
}

const COMMENTARY_DETECTORS: CommentaryDetector[] = [
  {
    fragment:       'raghavendra',
    stream:         'bhavadipika',
    headerLabel:    'BHĀVADĪPIKĀ',
    authorSanskrit: 'श्रीमद्राघवेन्द्रतीर्थाः',
  },
  {
    fragment:       'shrinivasa',
    stream:         'vadavaliprakasha',
    headerLabel:    'VĀDĀVALĪPRAKĀŚA',
    authorSanskrit: 'श्रीनिवासतीर्थाः',
  },
  {
    fragment:       'kashitirumal',
    stream:         'kashika',
    headerLabel:    'KĀŚIKĀ',
    authorSanskrit: 'Kāśītirumalācārya',
  },
]

interface DetectedCommentary extends CommentaryDetector {
  text: string
}

export type { CommentaryDetector, DetectedCommentary }
export { COMMENTARY_DETECTORS }

// ── Prompts ───────────────────────────────────────────────────────────────────

const SYSTEM_PROMPT_BASE =
  `You are an expert scholar of Mādhva Dvaita Vedānta (Tattvavāda) with deep mastery of ` +
  `nyāya-śāstra, Sanskrit grammar, and Dvaita philosophical literature. You generate rigorous ` +
  `argument maps that help students understand the precise logical flow of Sanskrit ` +
  `philosophical debate. Your Sanskrit is 100% pure classical Sanskrit — never Hindi, ` +
  `never mixed script, no grammatical errors. When quoting phrases from mūla or ` +
  `commentary, wrap them in **double asterisks**. Every explanation must be logically ` +
  `precise and pedagogically clear. `

export function buildSystemPrompt(detected: DetectedCommentary[]): string {
  const attributions: string[] = [
    `CRITICAL ATTRIBUTION: Always use the exact Sanskrit names given below for all authors.`,
  ]
  for (const c of detected) {
    attributions.push(`The ${c.headerLabel} commentary is by ${c.authorSanskrit}.`)
  }
  return SYSTEM_PROMPT_BASE + attributions.join(' ')
}

export function buildUserPrompt(
  sectionName: string | null,
  sequenceOrder: number,
  mulaText: string,
  detected: DetectedCommentary[],
  textTitle: string,
  maxCommentaryChars = 8000,
): string {
  // Build the text block, truncating each commentary if needed
  const textLines: string[] = [
    `── MŪLA TEXT ──────────────────────────────────────────────────────────────`,
    mulaText,
  ]
  for (const c of detected) {
    const body = c.text.length > maxCommentaryChars
      ? c.text.slice(0, maxCommentaryChars) + '... [truncated for length]'
      : c.text
    textLines.push(``)
    textLines.push(`── ${c.headerLabel} — ${c.authorSanskrit} ${'─'.repeat(Math.max(0, 40 - c.headerLabel.length - c.authorSanskrit.length))}`)
    textLines.push(body)
  }

  // Build step instructions for each commentary stream
  const commentarySteps = detected.map((c, i) => {
    const stepNum = i + 2
    return `STEP ${stepNum} — Generate ${c.headerLabel} nodes (stream: "${c.stream}").
Each ${c.stream} node elaborates on a specific mūla node.
- parent_index MUST point to the mūla node it elaborates (0-based index in the full array)
- Use the same node_type as the mūla node being elaborated`
  }).join('\n\n')

  const allStreams = ['mula', ...detected.map(c => `"${c.stream}"`)].join(' | ')
  const noCommentary = detected.length === 0

  return `Analyze this passage from ${textTitle} and generate a complete argument map.

Section: ${sectionName ?? '(unnumbered)'}
Passage: ${sequenceOrder}

${textLines.join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1 — Generate MŪLA nodes first (stream: "mula").
The mūla nodes form the primary argument spine in logical sequence:
  purva_paksha → shanka → khandana → samadhanam → siddhanta → upasamhara
(use only the node types that genuinely appear in this passage)
- The root mūla node has parent_index: null
- Child mūla nodes point to their parent by 0-based index in the full output array

${noCommentary
  ? 'No commentary available — generate only stream: "mula" nodes.'
  : commentarySteps}

CONTENT RULES:

STREAM PURITY — MANDATORY, applies to content_english AND content_sanskrit BOTH,
not just source_excerpt:
  • A "mula"-stream node's ENTIRE explanation must be derivable from the MŪLA TEXT
    ALONE. Do not import, paraphrase, or silently rely on interpretive nuance that
    only exists in a commentary -- even if the commentary would clarify or enrich
    the explanation, even if it makes the explanation more accurate or complete.
    This is the most common way stream purity gets violated: explaining WHY a
    mūla assertion holds by quietly reaching for a commentary's specific
    justification. Resist this. A mūla node states what the mūla itself asserts
    and the logical connections visible purely within the mūla's own words and
    grammar -- nothing that depends on a commentator's gloss to be true.
  • If the mūla text alone genuinely cannot justify a claim you want to make, that
    claim does NOT belong in the mūla node -- it belongs in the corresponding
    commentary-stream node (linked via parent_index), which exists precisely to
    supply that layer of interpretation.
  • Symmetrically, a commentary-stream node's explanation should center on what
    THAT SPECIFIC commentary says. Referencing the mūla text it elaborates is
    fine and expected (that's its anchor) -- but do not pull in a DIFFERENT
    commentary's content, or content from your own outside knowledge not present
    in either source.
  • This rule applies even though **bold** verbatim spans (below) may technically
    contain text from the other stream when directly quoting it -- but if you find
    yourself needing a commentary quote to support a MULA node's explanation, that
    is itself a sign the explanation has drifted out of the mula node's proper
    scope and belongs in the commentary node instead.

content_english — rigorous English explanation (2–5 sentences, technically precise)

content_sanskrit — CRITICAL RULES:
  • Must be a complete, grammatically correct Sanskrit explanation of the argument
  • Must read as proper Sanskrit philosophical prose — NOT a transliteration of the English
  • Any verbatim phrase quoted from mūla or commentary must be wrapped in **double asterisks**
  • Zero Hindi, zero mixed script, zero grammatical errors

source_excerpt — CRITICAL, SEPARATE FROM content_sanskrit:
  • The single clearest, most representative EXACT verbatim quote from THIS NODE'S
    OWN SOURCE ONLY -- copy it character-for-character, do not paraphrase or normalize it
  • STREAM DISCIPLINE IS MANDATORY: a "mula"-stream node's source_excerpt MUST be
    quoted from the MŪLA TEXT block above, and ONLY the mūla text -- NEVER from a
    commentary, even if your content_sanskrit explanation references how the
    commentary glosses it. A commentary-stream node's source_excerpt MUST be quoted
    from THAT SPECIFIC commentary's own text block, not the mūla and not a
    different commentary. Mixing streams here is a serious error -- the reader
    uses this field to verify the quote against the correct source, and a
    mūla-node showing commentary text (or vice versa) is actively misleading.
  • This is NOT the same as the **bold** spans inside content_sanskrit -- source_excerpt
    is a separate, standalone field the reader can check directly against the source
    text. It follows the SAME stream-purity rule as the rest of the node (above) --
    own stream only, no exceptions.
  • Prefer ONE clean, contiguous phrase over multiple disconnected fragments
  • If nothing in this node's OWN source is being directly quoted (a purely
    synthesized/summary node, or the only fitting quote is from the other stream),
    use null -- do not force a same-stream quote that isn't really there, and do
    not substitute a quote from the other stream

For khandana nodes only:
  logical_flaw — the specific nyāya flaw being exposed:
    vyabhichara | asiddha | savyabhichara | badhita | viruddha |
    satpratipaksha | pratyakshabadhita | shrutivirodha | ashrayasiddha | null
  refutation_type — lakshanam | pramanam | anumanam | siddhanta

OUTPUT FORMAT:
Return ONLY a valid JSON array. No preamble. No explanation. No markdown fences.
Array order: all mūla nodes first (ascending display_order), then each commentary stream in order.

Each element must have exactly these fields:
{
  "stream": "mula" | ${allStreams},
  "node_type": "purva_paksha" | "shanka" | "khandana" | "samadhanam" | "siddhanta" | "upasamhara",
  "content_english": "...",
  "content_sanskrit": "...",
  "source_excerpt": null or "exact verbatim quote from mūla/commentary",
  "logical_flaw": null or string,
  "refutation_type": null | "lakshanam" | "pramanam" | "anumanam" | "siddhanta",
  "parent_index": null or 0-based integer index into this array,
  "display_order": 0-based integer (resets to 0 for each stream)
}`
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

function countByStream(nodes: ArgumentNodeRow[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const n of nodes) counts[n.stream] = (counts[n.stream] ?? 0) + 1
  return counts
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Generates argument map nodes for all available streams in one Claude API call.
 * Detects streams dynamically from the passage's commentaries — supports both
 * vādāvalī (bhavadipika + vadavaliprakasha) and bhēdōjjīvanam (kashika).
 * Deletes all existing nodes for this passage before inserting new ones.
 */
export async function generateArgumentMap(
  supabase: SupabaseClient,
  anthropic: Anthropic,
  passageId: string,
  model: string,
): Promise<GenerateResult> {
  // 1. Fetch passage + all commentaries in one round trip
  const [{ data: passage, error: passageErr }, { data: commentaries }, { data: textRow }] =
    await Promise.all([
      supabase
        .from('passages')
        .select('id, text_id, mula_text, section_name, sequence_order')
        .eq('id', passageId)
        .single(),
      supabase
        .from('commentaries')
        .select('commentary_text, commentator:commentators(name, name_transliterated)')
        .eq('passage_id', passageId),
      // We fetch text title separately after getting passage — handled below
      supabase.from('texts').select('title_transliterated').limit(1).maybeSingle(), // placeholder
    ])

  if (passageErr || !passage) {
    throw new Error(`Passage not found: ${passageId} — ${passageErr?.message ?? 'no data'}`)
  }

  // Fetch the text title for the prompt
  const { data: text } = await supabase
    .from('texts')
    .select('title_transliterated')
    .eq('id', passage.text_id)
    .single()

  const textTitle = text?.title_transliterated ?? 'this text'

  // 2. Detect which commentary streams are actually present
  function findCommentary(fragment: string): string | null {
    const found = (commentaries ?? []).find((c: any) => {
      const name: string = (
        c.commentator?.name_transliterated ??
        c.commentator?.name ??
        ''
      ).toLowerCase()
      return name.includes(fragment)
    })
    return found?.commentary_text ?? null
  }

  const detected: DetectedCommentary[] = []
  for (const detector of COMMENTARY_DETECTORS) {
    const text = findCommentary(detector.fragment)
    if (text) detected.push({ ...detector, text })
  }

  // 3. Call Claude once for all detected streams
  const combinedCommentaryLength = detected.reduce((sum, c) => sum + c.text.length, 0)
  const maxCommentaryChars = combinedCommentaryLength > 12000 ? 6000 : 8000

  // Sonnet 5 defaults to adaptive thinking when `thinking` is omitted (the
  // OPPOSITE of Opus 4.x, where omitting it means thinking is off) -- and
  // max_tokens caps thinking + text combined, so it can eat the whole budget
  // before writing any answer. This is structured extraction with no real
  // need for visible reasoning, so disable thinking explicitly on Sonnet-5-
  // family models. Sonnet 5's new tokenizer also produces ~30% more tokens
  // for the same text, so give it a larger max_tokens ceiling too.
  const isSonnet5 = model.includes('sonnet-5')
  const requestParams: Anthropic.MessageCreateParams = {
    model,
    max_tokens: isSonnet5 ? 24000 : 16000,
    system: buildSystemPrompt(detected),
    messages: [{
      role: 'user',
      content: buildUserPrompt(
        passage.section_name,
        passage.sequence_order,
        passage.mula_text,
        detected,
        textTitle,
        maxCommentaryChars,
      ),
    }],
  }
  if (isSonnet5) {
    ;(requestParams as any).thinking = { type: 'disabled' }
  }

  // The SDK refuses non-streaming calls it estimates could run past 10 minutes
  // (a safety guard against silently-hanging connections) -- max_tokens=24000
  // trips that estimate even though actual generation is much faster. Use
  // streaming and collect the final message, which has the identical shape
  // to what .create() would have returned, so nothing else below changes.
  const stream = anthropic.messages.stream(requestParams)
  const message = await stream.finalMessage()

  const raw = (() => {
    const textBlock = message.content.find(b => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
      const blockTypes = message.content.map(b => b.type).join(', ') || '(empty)'
      const stopInfo = message.stop_reason ? ` stop_reason=${message.stop_reason}` : ''
      throw new Error(`No text block in response (content types: [${blockTypes}]${stopInfo})`)
    }
    if (message.stop_reason === 'max_tokens') {
      console.warn(`  ⚠ stop_reason=max_tokens for ${model} on passage ${passageId} — output may be truncated mid-JSON`)
    }
    return textBlock.text.trim()
  })()
  const rawNodes: Array<{
    stream: ArgumentStream
    node_type: string
    content_english: string
    content_sanskrit: string | null
    source_excerpt: string | null
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

  // 4. Validate + sanitize BEFORE touching existing data. The old flow deleted
  // existing nodes first, then inserted one-by-one, throwing immediately on any
  // constraint violation -- which left the passage with ZERO or PARTIAL nodes
  // (old ones gone, new ones aborted mid-way) rather than either a clean success
  // or an untouched, safely-retriable failure. Validate everything up front instead.
  const ALLOWED_STREAMS = new Set(['mula', ...detected.map(c => c.stream)])
  const ALLOWED_NODE_TYPES = new Set([
    'purva_paksha', 'shanka', 'khandana', 'samadhanam', 'siddhanta', 'upasamhara',
  ])
  const ALLOWED_REFUTATION_TYPES = new Set(['lakshanam', 'pramanam', 'anumanam', 'siddhanta'])
  const ALLOWED_LOGICAL_FLAWS = new Set([
    'vyabhichara', 'asiddha', 'savyabhichara', 'badhita', 'viruddha',
    'satpratipaksha', 'pratyakshabadhita', 'shrutivirodha', 'ashrayasiddha',
  ])

  // Map each stream to ITS OWN source text, for verifying source_excerpt actually
  // belongs to the node's own stream -- not trusting the prompt alone, since this
  // is exactly the kind of cross-stream mixup that showed up in practice (a mula
  // node's excerpt containing kashika text). Normalize by stripping whitespace so
  // minor spacing differences don't cause false rejections, while still catching
  // genuine wrong-source content (which won't match even after normalization).
  const sourceTextByStream = new Map<string, string>()
  sourceTextByStream.set('mula', passage.mula_text)
  for (const c of detected) sourceTextByStream.set(c.stream, c.text)

  function normalize(s: string): string {
    return s.replace(/\s+/g, '')
  }

  for (const [i, n] of rawNodes.entries()) {
    // stream / node_type are NOT NULL with no safe default -- a bad value here
    // means the generation itself is malformed, so fail BEFORE deleting anything.
    if (!ALLOWED_STREAMS.has(n.stream)) {
      throw new Error(
        `Node ${i} has invalid stream "${n.stream}" (allowed: ${[...ALLOWED_STREAMS].join(', ')}). ` +
        `Aborting before deleting existing nodes for passage ${passageId} -- nothing was changed.`
      )
    }
    if (!ALLOWED_NODE_TYPES.has(n.node_type)) {
      throw new Error(
        `Node ${i} has invalid node_type "${n.node_type}". ` +
        `Aborting before deleting existing nodes for passage ${passageId} -- nothing was changed.`
      )
    }
    // refutation_type / logical_flaw are nullable sub-classifications -- if the
    // model produced a value outside the allowed set, drop just that field
    // (log it so we can see what the model actually said, and reconsider
    // whether the CHECK constraint or the prompt needs adjusting) rather than
    // losing the whole node's real content over a mis-categorized label.
    if (n.refutation_type != null && !ALLOWED_REFUTATION_TYPES.has(n.refutation_type)) {
      console.warn(
        `  ⚠ Node ${i} (passage ${passageId}) had invalid refutation_type ` +
        `"${n.refutation_type}" -- dropping it, keeping the node. ` +
        `Allowed: ${[...ALLOWED_REFUTATION_TYPES].join(', ')}`
      )
      n.refutation_type = null
    }
    if (n.logical_flaw != null && !ALLOWED_LOGICAL_FLAWS.has(n.logical_flaw)) {
      console.warn(
        `  ⚠ Node ${i} (passage ${passageId}) had invalid logical_flaw ` +
        `"${n.logical_flaw}" -- dropping it, keeping the node. ` +
        `Allowed: ${[...ALLOWED_LOGICAL_FLAWS].join(', ')}`
      )
      n.logical_flaw = null
    }
    // source_excerpt must be verifiably present in THIS NODE'S OWN stream's source
    // text -- not the mula text for a commentary node, not a different commentary,
    // etc. This caught a real bug in practice (a mula node's excerpt drawn from
    // kashika) -- don't trust the prompt alone for something this accuracy-critical.
    if (n.source_excerpt != null) {
      const ownSourceText = sourceTextByStream.get(n.stream)
      const matchesOwnStream = ownSourceText ? normalize(ownSourceText).includes(normalize(n.source_excerpt)) : false
      if (!matchesOwnStream) {
        const wrongStream = [...sourceTextByStream.entries()]
          .find(([s, text]) => s !== n.stream && normalize(text).includes(normalize(n.source_excerpt!)))?.[0]
        console.warn(
          `  ⚠ Node ${i} (passage ${passageId}, stream=${n.stream}) source_excerpt did NOT match its ` +
          `own stream's source text${wrongStream ? ` -- it matched "${wrongStream}" instead (cross-stream mixup)` : ' (no match in any known source -- possibly paraphrased)'}. ` +
          `Dropping the excerpt, keeping the node. Excerpt was: "${n.source_excerpt.slice(0, 80)}"`
        )
        n.source_excerpt = null
      }
    }
  }

  // 4b. Only now delete existing nodes -- validation above already passed, so
  // this generation attempt is safe to commit to.
  await supabase
    .from('argument_nodes')
    .delete()
    .eq('passage_id', passageId)

  // 5. Insert nodes sequentially, resolving parent_index → UUID
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
        passage_id:       passageId,
        stream:           rawNode.stream,
        node_type:        rawNode.node_type,
        content_english:  rawNode.content_english,
        content_sanskrit: rawNode.content_sanskrit ?? null,
        source_excerpt:   rawNode.source_excerpt ?? null,
        logical_flaw:     rawNode.logical_flaw ?? null,
        refutation_type:  rawNode.refutation_type ?? null,
        parent_node_id:   parentNodeId,
        display_order:    rawNode.display_order,
        is_approved:      false,
        ai_generated:     true,
        ai_model:         model,
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

  // 6. Save version snapshots — one per detected stream (plus mula)
  const activeStreams: ArgumentStream[] = ['mula', ...detected.map(c => c.stream)]

  for (const stream of activeStreams) {
    const streamNodes = insertedRows.filter(n => n.stream === stream)
    if (streamNodes.length === 0) continue

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
