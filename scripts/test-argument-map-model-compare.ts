/**
 * test-argument-map-model-compare.ts
 *
 * Side-by-side quality comparison of Opus 4.8 vs Sonnet 5 for argument-map
 * generation on bhedojjivanam, WITHOUT touching Supabase at all -- reads
 * sample entries directly from scripts/data/bhedojjivanam-units.json and
 * calls the Anthropic API twice per entry (once per model), using the exact
 * same prompt-building logic as the real pipeline (lib/argument-map-generator.ts).
 *
 * Purpose: decide whether Sonnet 5 is good enough for the full 176-passage
 * bhedojjivanam argument-map run, before spending ~$85-90 on Opus 4.8 for
 * all of them. Nothing here writes to the database -- pure text generation,
 * safe to run repeatedly.
 *
 * USAGE
 * -----
 *   npx ts-node --project tsconfig.scripts.json scripts/test-argument-map-model-compare.ts
 *     [--units 1,13,45.3,30.3,90.2,65,87.2,52]   # default shown below
 *     [--file scripts/data/bhedojjivanam-units.json]
 *
 * Requires ANTHROPIC_API_KEY in .env.local (same as the real generation script).
 *
 * OUTPUT (two files)
 * -------------------
 *   scripts/data/model-compare-output.html  -- READ THIS ONE. Side-by-side view,
 *     grouped by argumentative role (purva_paksha, khandana, ...) rather than raw
 *     array order, so you compare how each model handled the SAME logical move
 *     even if they emitted differing numbers of nodes or in a different order.
 *   scripts/data/model-compare-output.md    -- raw JSON per model, per passage.
 *     Fallback/debug reference only -- hard to visually compare, kept for when
 *     you need the exact unprocessed output (e.g. to check field-level details
 *     the HTML view simplifies away).
 */

import * as fs from 'fs'
import * as path from 'path'
import Anthropic from '@anthropic-ai/sdk'
import {
  buildSystemPrompt,
  buildUserPrompt,
  COMMENTARY_DETECTORS,
  type DetectedCommentary,
} from '../lib/argument-map-generator'

// ── Load .env.local ───────────────────────────────────────────────────────────

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

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
if (!ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY must be set in .env.local')
  process.exit(1)
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY })

// ── Config ────────────────────────────────────────────────────────────────────

const MODEL_A = 'claude-opus-4-8'
const MODEL_B = 'claude-sonnet-5'

// Chosen for a representative spread: the foundational opening passage, the
// most khandana/purva-paksha-dense passages by kashika length, one from the
// heavily-corrected 65/66 merge, and two short/simple ones for contrast.
const DEFAULT_UNITS = ['1', '13', '45.3', '30.3', '90.2', '65', '87.2', '52']

const DEFAULT_FILE = path.join('scripts', 'data', 'bhedojjivanam-units.json')
const MD_OUTPUT     = path.join('scripts', 'data', 'model-compare-output.md')
const HTML_OUTPUT   = path.join('scripts', 'data', 'model-compare-output.html')

const NODE_TYPE_ORDER = [
  'purva_paksha', 'shanka', 'khandana', 'samadhanam', 'siddhanta', 'upasamhara',
] as const
type NodeType = typeof NODE_TYPE_ORDER[number]
const NODE_TYPE_LABEL: Record<NodeType, string> = {
  purva_paksha: 'पूर्वपक्षः · Pūrvapakṣa',
  shanka:       'शङ्का · Śaṅkā',
  khandana:     'खण्डनम् · Khaṇḍana',
  samadhanam:   'समाधानम् · Samādhāna',
  siddhanta:    'सिद्धान्तः · Siddhānta',
  upasamhara:   'उपसंहारः · Upasaṃhāra',
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface SourceEntry {
  display_seq:  string
  seq:          number
  sub_index:    number
  section_name: string
  mula_text:    string
  kashika_text: string
  page_start:   number
  page_end:     number
}

interface ArgNode {
  stream:           string
  node_type:        NodeType | string
  content_english:  string
  content_sanskrit: string | null
  logical_flaw:     string | null
  refutation_type:  string | null
  parent_index:     number | null
  display_order:    number
}

interface ModelResult {
  nodes: ArgNode[] | null   // null if parse failed
  raw:   string
  error: string | null      // set if the API call itself failed
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag)
  return idx !== -1 ? process.argv[idx + 1] : undefined
}

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

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

async function generateWithModel(entry: SourceEntry, model: string): Promise<ModelResult> {
  const kashikaDetector = COMMENTARY_DETECTORS.find(d => d.stream === 'kashika')!
  const detected: DetectedCommentary[] = [{ ...kashikaDetector, text: entry.kashika_text }]

  const combinedLength = entry.kashika_text.length
  const maxCommentaryChars = combinedLength > 12000 ? 6000 : 8000

  // Sonnet 5 defaults to adaptive thinking when `thinking` is omitted (the
  // OPPOSITE of Opus 4.x, where omitting it means thinking is off) -- and
  // max_tokens caps thinking + text combined, so it can eat the whole budget
  // before writing any answer. This is a structured-extraction task with no
  // real need for visible reasoning, so disable thinking explicitly on
  // Sonnet-5-family models -- this also makes the comparison fair, matching
  // Opus's default no-thinking behavior rather than silently advantaging one
  // model. Sonnet 5's new tokenizer also produces ~30% more tokens for the
  // same text, so give it a larger max_tokens ceiling too.
  const isSonnet5 = model.includes('sonnet-5')
  const requestParams: Anthropic.MessageCreateParams = {
    model,
    max_tokens: isSonnet5 ? 24000 : 16000,
    system: buildSystemPrompt(detected),
    messages: [{
      role: 'user',
      content: buildUserPrompt(
        entry.section_name,
        entry.seq,
        entry.mula_text,
        detected,
        'Bhēdōjjīvanam',
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

  // Sonnet 5 has adaptive thinking on by default, which can put a `thinking`
  // block BEFORE the `text` block in the content array -- content[0] is not
  // reliably the text response anymore. Find the text block by type instead
  // of assuming position (robust for any model, thinking or not).
  const textBlock = message.content.find(b => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    const blockTypes = message.content.map(b => b.type).join(', ') || '(empty)'
    const stopInfo = message.stop_reason ? ` stop_reason=${message.stop_reason}` : ''
    throw new Error(`No text block in response (content types: [${blockTypes}]${stopInfo})`)
  }
  const raw = textBlock.text.trim()

  if (message.stop_reason === 'max_tokens') {
    console.warn(`    ⚠ stop_reason=max_tokens for ${model} — output may be truncated mid-JSON`)
  }

  try {
    const nodes = JSON.parse(cleanJson(raw)) as ArgNode[]
    return { nodes, raw, error: null }
  } catch {
    return { nodes: null, raw, error: null }
  }
}

/** Group a model's nodes by argumentative role for side-by-side comparison.
 *  Mūla nodes group by their own node_type. Kāśikā nodes group by the
 *  node_type of the mūla node they elaborate (resolved via parent_index),
 *  so "how did each model handle the khaṇḍana" compares like with like even
 *  if node counts/ordering differ between models. */
function groupByRole(nodes: ArgNode[]): Record<NodeType, { mula: ArgNode[]; kashika: ArgNode[] }> {
  const groups = {} as Record<NodeType, { mula: ArgNode[]; kashika: ArgNode[] }>
  for (const t of NODE_TYPE_ORDER) groups[t] = { mula: [], kashika: [] }

  nodes.forEach((n, i) => {
    if (n.stream === 'mula') {
      const t = (NODE_TYPE_ORDER as readonly string[]).includes(n.node_type) ? n.node_type as NodeType : 'purva_paksha'
      groups[t].mula.push(n)
    }
  })
  nodes.forEach(n => {
    if (n.stream !== 'mula') {
      const parent = n.parent_index != null ? nodes[n.parent_index] : null
      const t = parent && (NODE_TYPE_ORDER as readonly string[]).includes(parent.node_type)
        ? parent.node_type as NodeType
        : ((NODE_TYPE_ORDER as readonly string[]).includes(n.node_type) ? n.node_type as NodeType : 'purva_paksha')
      groups[t].kashika.push(n)
    }
  })
  return groups
}

function nodeCardHtml(n: ArgNode): string {
  const badges = [
    n.logical_flaw ? `<span class="badge flaw">${esc(n.logical_flaw)}</span>` : '',
    n.refutation_type ? `<span class="badge refutation">${esc(n.refutation_type)}</span>` : '',
  ].join('')
  return `
    <div class="node-card">
      ${badges ? `<div class="node-badges">${badges}</div>` : ''}
      ${n.content_sanskrit ? `<div class="node-skt">${esc(n.content_sanskrit).replace(/\*\*(.+?)\*\*/gs, '<b>$1</b>')}</div>` : ''}
      <div class="node-en">${esc(n.content_english)}</div>
    </div>`
}

function columnHtml(result: ModelResult, nodeType: NodeType): string {
  if (result.error) return `<div class="col-error">ERROR: ${esc(result.error)}</div>`
  if (!result.nodes) return `<div class="col-error">JSON parse failed — see .md file for raw output</div>`
  const g = groupByRole(result.nodes)[nodeType]
  if (g.mula.length === 0 && g.kashika.length === 0) return `<div class="col-empty">— none —</div>`
  const parts: string[] = []
  if (g.mula.length) {
    parts.push(`<div class="sub-label">मूलम्</div>`)
    parts.push(...g.mula.map(nodeCardHtml))
  }
  if (g.kashika.length) {
    parts.push(`<div class="sub-label">काशिका</div>`)
    parts.push(...g.kashika.map(nodeCardHtml))
  }
  return parts.join('\n')
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const filePath = getArg('--file') ?? DEFAULT_FILE
  const unitsArg = getArg('--units')
  const wantedUnits = unitsArg ? unitsArg.split(',').map(s => s.trim()) : DEFAULT_UNITS

  const resolvedPath = path.resolve(filePath)
  if (!fs.existsSync(resolvedPath)) {
    console.error(`Error: file not found: ${resolvedPath}`)
    process.exit(1)
  }

  const allEntries: SourceEntry[] = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'))
  const byDisplaySeq = new Map(allEntries.map(e => [e.display_seq, e]))

  const entries: SourceEntry[] = []
  for (const u of wantedUnits) {
    const e = byDisplaySeq.get(u)
    if (!e) {
      console.warn(`  Warning: unit "${u}" not found in ${filePath} — skipping`)
      continue
    }
    entries.push(e)
  }

  if (entries.length === 0) {
    console.error('No matching units found. Check --units values against display_seq in the JSON.')
    process.exit(1)
  }

  const mdPath = path.resolve(MD_OUTPUT)
  const htmlPath = path.resolve(HTML_OUTPUT)

  fs.writeFileSync(mdPath, `# Argument Map Model Comparison — ${MODEL_A} vs ${MODEL_B}\n\n` +
    `Generated ${new Date().toISOString()}. ${entries.length} passages, no DB writes.\n` +
    `Raw JSON reference only -- see model-compare-output.html for the readable side-by-side view.\n\n---\n\n`, 'utf-8')

  const navLinks: string[] = []
  const passageSections: string[] = []

  for (const entry of entries) {
    process.stdout.write(`  [${entry.display_seq}] ${MODEL_A}...`)
    let resultA: ModelResult
    try {
      resultA = await generateWithModel(entry, MODEL_A)
      process.stdout.write(resultA.nodes ? ' ✓' : ' ⚠ (parse failed)')
    } catch (err: any) {
      const detail = err?.status ? `HTTP ${err.status} — ${err.message}` : String(err?.message ?? err)
      resultA = { nodes: null, raw: '', error: detail }
      process.stdout.write(`\n    ✗ ${MODEL_A} FAILED: ${detail}\n`)
    }

    process.stdout.write(`  [${entry.display_seq}] ${MODEL_B}...`)
    let resultB: ModelResult
    try {
      resultB = await generateWithModel(entry, MODEL_B)
      process.stdout.write(resultB.nodes ? ' ✓\n' : ' ⚠ (parse failed)\n')
    } catch (err: any) {
      const detail = err?.status ? `HTTP ${err.status} — ${err.message}` : String(err?.message ?? err)
      resultB = { nodes: null, raw: '', error: detail }
      process.stdout.write(`\n    ✗ ${MODEL_B} FAILED: ${detail}\n`)
    }

    // -- markdown (raw reference) --
    const mdChunk = [
      `## [${entry.display_seq}] ${entry.section_name}`,
      ``,
      `**mūla:** ${entry.mula_text.slice(0, 200)}${entry.mula_text.length > 200 ? '…' : ''}`,
      ``,
      `### ${MODEL_A}`,
      '```json',
      resultA.error ? `[ERROR: ${resultA.error}]` : (resultA.nodes ? JSON.stringify(resultA.nodes, null, 2) : `[PARSE FAILED]\n\n${resultA.raw}`),
      '```',
      ``,
      `### ${MODEL_B}`,
      '```json',
      resultB.error ? `[ERROR: ${resultB.error}]` : (resultB.nodes ? JSON.stringify(resultB.nodes, null, 2) : `[PARSE FAILED]\n\n${resultB.raw}`),
      '```',
      ``, `---`, ``,
    ].join('\n')
    fs.appendFileSync(mdPath, mdChunk + '\n', 'utf-8')

    // -- html (side-by-side, grouped by role) --
    const anchor = `p-${entry.display_seq.replace('.', '-')}`
    navLinks.push(`<a href="#${anchor}">${esc(entry.display_seq)}</a>`)

    const roleSections = NODE_TYPE_ORDER
      .filter(t => {
        const ga = resultA.nodes ? groupByRole(resultA.nodes)[t] : null
        const gb = resultB.nodes ? groupByRole(resultB.nodes)[t] : null
        const aEmpty = !ga || (ga.mula.length === 0 && ga.kashika.length === 0)
        const bEmpty = !gb || (gb.mula.length === 0 && gb.kashika.length === 0)
        return !(aEmpty && bEmpty)
      })
      .map(t => `
        <div class="role-block">
          <div class="role-header">${NODE_TYPE_LABEL[t]}</div>
          <div class="role-cols">
            <div class="role-col">${columnHtml(resultA, t)}</div>
            <div class="role-col">${columnHtml(resultB, t)}</div>
          </div>
        </div>`)
      .join('\n')

    passageSections.push(`
      <section class="passage" id="${anchor}">
        <div class="passage-head">
          <span class="passage-num">#${esc(entry.display_seq)}</span>
          <span class="passage-name skt">${esc(entry.section_name)}</span>
        </div>
        <div class="passage-mula skt">${esc(entry.mula_text.slice(0, 300))}${entry.mula_text.length > 300 ? '…' : ''}</div>
        <div class="model-header-row">
          <div class="model-header-col">${MODEL_A}</div>
          <div class="model-header-col">${MODEL_B}</div>
        </div>
        ${roleSections || '<div class="col-empty">No nodes parsed for either model.</div>'}
      </section>`)
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Argument Map Model Comparison — ${MODEL_A} vs ${MODEL_B}</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root {
  --saffron:#B85C1A; --gold:#A8861C; --cream:#FDF8EE; --parchment:#F8F0DC;
  --ink:#241507; --ink-mid:#4A3010; --muted:#7A5C30; --rule:rgba(168,134,28,0.25); --rule-s:rgba(168,134,28,0.5);
}
* { box-sizing:border-box; }
body { margin:0; background:var(--cream); color:var(--ink); font-family:'Inter',system-ui,sans-serif; font-size:14px; line-height:1.55; }
.skt { font-family:'Noto Sans Devanagari',sans-serif; }
header { position:sticky; top:0; z-index:50; background:rgba(253,248,238,0.97); backdrop-filter:blur(8px); border-bottom:1px solid var(--rule-s); padding:12px 20px; }
header h1 { font-size:1rem; margin:0 0 6px; color:var(--saffron); }
header p { margin:0 0 8px; color:var(--muted); font-size:0.82rem; }
.nav { display:flex; flex-wrap:wrap; gap:6px; }
.nav a { font-size:0.78rem; padding:3px 9px; border:1px solid var(--rule-s); border-radius:4px; color:var(--muted); text-decoration:none; }
.nav a:hover { color:var(--saffron); border-color:var(--saffron); }
main { max-width:1100px; margin:0 auto; padding:18px 20px 80px; }

.passage { background:#fff; border:1px solid var(--rule); border-radius:8px; margin-bottom:22px; overflow:hidden; }
.passage-head { display:flex; align-items:center; gap:10px; padding:12px 16px; background:var(--parchment); border-bottom:1px solid var(--rule); }
.passage-num { font-weight:700; color:var(--gold); font-size:0.85rem; }
.passage-name { font-weight:600; font-size:1rem; }
.passage-mula { padding:10px 16px; font-size:0.95rem; color:var(--ink-mid); border-bottom:1px solid var(--rule); background:#FFFCF5; }

.model-header-row { display:grid; grid-template-columns:1fr 1fr; border-bottom:2px solid var(--saffron); }
.model-header-col { padding:8px 16px; font-weight:700; font-size:0.8rem; letter-spacing:0.03em; color:var(--saffron); text-align:center; }
.model-header-col:first-child { border-right:1px solid var(--rule-s); }

.role-block { border-bottom:1px solid var(--rule); }
.role-block:last-child { border-bottom:none; }
.role-header { padding:8px 16px; background:#FBF6EA; font-weight:600; font-size:0.85rem; color:var(--ink-mid); border-bottom:1px dashed var(--rule-s); }
.role-cols { display:grid; grid-template-columns:1fr 1fr; }
.role-col { padding:12px 16px; border-right:1px solid var(--rule-s); }
.role-col:last-child { border-right:none; }

.sub-label { font-size:0.68rem; letter-spacing:0.08em; text-transform:uppercase; color:var(--gold); margin:8px 0 4px; }
.sub-label:first-child { margin-top:0; }
.node-card { background:#FFFDF8; border:1px solid var(--rule-s); border-radius:6px; padding:9px 11px; margin-bottom:8px; }
.node-badges { margin-bottom:5px; }
.badge { display:inline-block; font-size:0.66rem; padding:2px 7px; border-radius:3px; margin-right:5px; }
.badge.flaw { background:#F3E0D8; color:#8a3f1c; }
.badge.refutation { background:#EDE6D0; color:#6b5518; }
.node-skt { font-size:0.95rem; line-height:1.7; margin-bottom:5px; }
.node-skt b { color:var(--saffron); }
.node-en { font-size:0.86rem; color:var(--ink-mid); line-height:1.55; }
.col-empty { color:var(--muted); font-style:italic; font-size:0.82rem; }
.col-error { color:#a33; font-size:0.82rem; }

footer { text-align:center; padding:20px; color:var(--muted); font-size:0.75rem; }
</style>
</head>
<body>
<header>
  <h1>Argument Map Model Comparison — ${MODEL_A} vs ${MODEL_B}</h1>
  <p>Generated ${new Date().toISOString()}. Grouped by argumentative role (pūrvapakṣa, khaṇḍana, …) so you compare
     how each model handled the SAME logical move, not raw array position. Judge on nyāya-śāstra precision,
     not just fluency.</p>
  <div class="nav">${navLinks.join(' ')}</div>
</header>
<main>
${passageSections.join('\n')}
</main>
<footer>bhēdōjjīvanam model comparison · तत्त्वसुधा</footer>
</body>
</html>`

  fs.writeFileSync(htmlPath, html, 'utf-8')

  console.log(`\nDone.`)
  console.log(`  Read this one : ${HTML_OUTPUT}`)
  console.log(`  Raw reference : ${MD_OUTPUT}`)
}

main().catch(err => { console.error('Fatal error:', err); process.exit(1) })
