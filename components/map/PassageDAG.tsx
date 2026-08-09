'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ArgumentNodeRow {
  id: string
  stream: 'mula' | 'bhavadipika' | 'vadavaliprakasha' | 'kashika'
  node_type: string
  content_english: string
  content_sanskrit: string | null
  logical_flaw: string | null
  refutation_type: string | null
  parent_node_id: string | null
  display_order: number
}

interface PassageInfo {
  id: string
  section_number: number | null
  section_name: string | null
  sequence_order: number
  mula_text: string | null
}

interface Props {
  nodes: ArgumentNodeRow[]
  passage: PassageInfo
  textId: string
  isCurator: boolean
  isLoggedIn: boolean
}

// ── Layout constants ──────────────────────────────────────────────────────────

const NODE_W    = 280
const COL_GAP   = 72
const INNER_GAP = 16
const ROW_GAP   = 32
const PAD       = 48
const DEFAULT_H = 160

// ── Display constants ─────────────────────────────────────────────────────────

const NODE_TYPE_LABEL: Record<string, string> = {
  purva_paksha: 'Pūrva Pakṣa',
  shanka:       'Śaṅkā',
  khandana:     'Khaṇḍana',
  samadhanam:   'Samādhānam',
  siddhanta:    'Siddhānta',
  upasamhara:   'Upasaṃhāra',
}

const NODE_CARD_CLASS: Record<string, string> = {
  purva_paksha: 'bg-stone-800/90 border border-stone-600',
  shanka:       'bg-amber-950/80 border border-stone-600 border-l-4 border-l-amber-500',
  khandana:     'bg-red-950/80 border border-stone-600 border-l-4 border-l-red-500',
  samadhanam:   'bg-green-950/80 border border-stone-600 border-l-4 border-l-green-500',
  siddhanta:    'bg-blue-950/80 border border-stone-600 border-l-4 border-l-blue-500',
  upasamhara:   'bg-stone-800/90 border border-dashed border-stone-600',
}

const STREAM_ARROW_COLOR: Record<string, string> = {
  'mula-mula':             '#a8a29e',
  'mula-bhavadipika':      '#fdba74',
  'mula-vadavaliprakasha': '#93c5fd',
  'mula-kashika':          '#6ee7b7',
}

// Stream toggle config (dark theme)
const STREAM_CONFIG: Record<string, { devanagari: string; toggleOn: string; toggleOff: string }> = {
  bhavadipika: {
    devanagari: 'भावदीपिका',
    toggleOn:  'bg-orange-900/50 text-orange-300 border border-orange-700',
    toggleOff: 'bg-stone-800 text-stone-600 border border-stone-700 opacity-50',
  },
  vadavaliprakasha: {
    devanagari: 'वादावलीप्रकाशः',
    toggleOn:  'bg-blue-900/50 text-blue-300 border border-blue-700',
    toggleOff: 'bg-stone-800 text-stone-600 border border-stone-700 opacity-50',
  },
  kashika: {
    devanagari: 'काशिका',
    toggleOn:  'bg-emerald-900/50 text-emerald-300 border border-emerald-700',
    toggleOff: 'bg-stone-800 text-stone-600 border border-stone-700 opacity-50',
  },
}

// Stream node badge (dark theme)
const STREAM_BADGE: Record<string, { char: string; className: string }> = {
  mula:             { char: 'मू',  className: 'text-stone-400 bg-stone-700 border border-stone-600' },
  bhavadipika:      { char: 'रा',  className: 'text-orange-300 bg-orange-950/60 border border-orange-800' },
  vadavaliprakasha: { char: 'श्री', className: 'text-blue-300 bg-blue-950/60 border border-blue-800' },
  kashika:          { char: 'का',  className: 'text-emerald-300 bg-emerald-950/60 border border-emerald-800' },
}

// Canonical display order for known commentary streams
const KNOWN_STREAM_ORDER = ['bhavadipika', 'vadavaliprakasha', 'kashika']

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return <>{parts.map((p, i) => i % 2 === 1 ? <strong key={i}>{p}</strong> : p)}</>
}

// ── Layout algorithm ──────────────────────────────────────────────────────────

interface NodePos { x: number; y: number; h: number }
interface Arrow { x1: number; y1: number; x2: number; y2: number; type: string }
interface Layout { positions: Map<string, NodePos>; arrows: Arrow[]; canvasW: number; canvasH: number }

function computeLayout(
  nodes: ArgumentNodeRow[],
  activeCommentaryStreams: string[],
  measuredHeights: Map<string, number>,
): Layout {
  const mulaNodes = nodes
    .filter(n => n.stream === 'mula')
    .sort((a, b) => a.display_order - b.display_order)
  const mulaIds = new Set(mulaNodes.map(n => n.id))

  // BFS rank assignment
  const mulaChildMap = new Map<string, string[]>()
  for (const m of mulaNodes) {
    if (m.parent_node_id && mulaIds.has(m.parent_node_id)) {
      if (!mulaChildMap.has(m.parent_node_id)) mulaChildMap.set(m.parent_node_id, [])
      mulaChildMap.get(m.parent_node_id)!.push(m.id)
    }
  }
  const ranks = new Map<string, number>()
  const roots = mulaNodes.filter(n => !n.parent_node_id || !mulaIds.has(n.parent_node_id))
  roots.forEach(r => ranks.set(r.id, 0))
  const bfsQueue = [...roots]; let qi = 0
  while (qi < bfsQueue.length) {
    const curr = bfsQueue[qi++]
    const rank = ranks.get(curr.id)!
    for (const cid of (mulaChildMap.get(curr.id) ?? [])) {
      if (!ranks.has(cid)) {
        ranks.set(cid, rank + 1)
        const child = mulaNodes.find(n => n.id === cid)
        if (child) bfsQueue.push(child)
      }
    }
  }
  mulaNodes.forEach((m, i) => { if (!ranks.has(m.id)) ranks.set(m.id, i) })

  // Group commentary nodes by stream → mulaParentId (orphans → nearest preceding mula)
  const commentaryByStream = new Map<string, Map<string, ArgumentNodeRow[]>>()
  for (const n of nodes) {
    if (n.stream === 'mula') continue
    if (!commentaryByStream.has(n.stream)) commentaryByStream.set(n.stream, new Map())
    const byMula = commentaryByStream.get(n.stream)!

    let parentId: string | null =
      (n.parent_node_id && mulaIds.has(n.parent_node_id)) ? n.parent_node_id : null
    if (!parentId && mulaNodes.length > 0) {
      let nearest = mulaNodes[0]
      for (const m of mulaNodes) {
        if (m.display_order <= n.display_order) nearest = m; else break
      }
      parentId = nearest.id
    }
    if (!parentId) continue
    if (!byMula.has(parentId)) byMula.set(parentId, [])
    byMula.get(parentId)!.push(n)
  }

  const sortedMula = [...mulaNodes].sort((a, b) => {
    const ra = ranks.get(a.id) ?? 0, rb = ranks.get(b.id) ?? 0
    return ra !== rb ? ra - rb : a.display_order - b.display_order
  })

  // Column x positions: [mula, stream0, stream1, ...]
  const xCols: number[] = [PAD]
  for (let i = 0; i < activeCommentaryStreams.length; i++) {
    xCols.push(PAD + (i + 1) * (NODE_W + COL_GAP))
  }

  const positions = new Map<string, NodePos>()
  const arrows: Arrow[] = []
  let currentY = PAD
  const nextColY = activeCommentaryStreams.map(() => PAD)

  for (const m of sortedMula) {
    const mulaH = measuredHeights.get(m.id) ?? DEFAULT_H
    const mulaY = currentY
    positions.set(m.id, { x: xCols[0], y: mulaY, h: mulaH })

    let rowH = mulaH

    for (let ci = 0; ci < activeCommentaryStreams.length; ci++) {
      const stream = activeCommentaryStreams[ci]
      const streamNodes = (commentaryByStream.get(stream)?.get(m.id) ?? [])
        .sort((a, b) => a.display_order - b.display_order)

      const startY = Math.max(mulaY, nextColY[ci])
      let colY = startY
      let totalH = 0

      for (const n of streamNodes) {
        const h = measuredHeights.get(n.id) ?? DEFAULT_H
        positions.set(n.id, { x: xCols[ci + 1], y: colY, h })
        colY   += h + INNER_GAP
        totalH += h + INNER_GAP
      }

      if (totalH > 0) {
        totalH    -= INNER_GAP
        nextColY[ci] = colY
        rowH = Math.max(rowH, (startY - mulaY) + totalH)
      }
    }

    currentY += rowH + ROW_GAP
  }

  // Mūla → mūla arrows
  for (const m of sortedMula) {
    const pos = positions.get(m.id)!
    for (const cid of (mulaChildMap.get(m.id) ?? [])) {
      const cpos = positions.get(cid); if (!cpos) continue
      arrows.push({ x1: pos.x + NODE_W / 2, y1: pos.y + pos.h, x2: cpos.x + NODE_W / 2, y2: cpos.y, type: 'mula-mula' })
    }
  }

  // Mūla → commentary arrows
  for (let ci = 0; ci < activeCommentaryStreams.length; ci++) {
    const stream = activeCommentaryStreams[ci]
    const byMula = commentaryByStream.get(stream); if (!byMula) continue
    for (const [mid, cNodes] of byMula) {
      const mpos = positions.get(mid); if (!mpos) continue
      for (const n of cNodes) {
        const npos = positions.get(n.id); if (!npos) continue
        arrows.push({ x1: mpos.x + NODE_W, y1: mpos.y + mpos.h / 2, x2: npos.x, y2: npos.y + npos.h / 2, type: `mula-${stream}` })
      }
    }
  }

  const numCols = 1 + activeCommentaryStreams.length
  const canvasW = Math.max(PAD + numCols * NODE_W + (numCols - 1) * COL_GAP + PAD, 900)
  const canvasH = currentY + PAD

  return { positions, arrows, canvasW, canvasH }
}

// ── DAG node card ─────────────────────────────────────────────────────────────

function DAGNodeCard({ node, expanded, onToggleExpand, isCurator, onNodeUpdate, onHeightChange }: {
  node: ArgumentNodeRow
  expanded: boolean
  onToggleExpand: () => void
  isCurator: boolean
  onNodeUpdate: (updated: ArgumentNodeRow) => void
  onHeightChange: (id: string, height: number) => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [editing,   setEditing]   = useState(false)
  const [draft,     setDraft]     = useState({
    stream: node.stream, node_type: node.node_type,
    content_english: node.content_english, content_sanskrit: node.content_sanskrit ?? '',
    logical_flaw: node.logical_flaw ?? '', refutation_type: node.refutation_type ?? '',
  })
  const [saving,    setSaving]    = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    const el = cardRef.current; if (!el) return
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) onHeightChange(node.id, entry.contentRect.height)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [node.id, onHeightChange, editing])

  const label     = NODE_TYPE_LABEL[node.node_type] ?? node.node_type.replace(/_/g, ' ')
  const cardClass = NODE_CARD_CLASS[node.node_type]  ?? 'bg-stone-800/90 border border-stone-600'
  const badge     = STREAM_BADGE[node.stream]

  function startEditing() {
    setDraft({
      stream: node.stream, node_type: node.node_type,
      content_english: node.content_english, content_sanskrit: node.content_sanskrit ?? '',
      logical_flaw: node.logical_flaw ?? '', refutation_type: node.refutation_type ?? '',
    })
    setSaveError(null); setEditing(true)
  }

  async function handleSave() {
    setSaving(true); setSaveError(null)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('argument_nodes')
      .update({
        stream: draft.stream, node_type: draft.node_type,
        content_english: draft.content_english, content_sanskrit: draft.content_sanskrit || null,
        logical_flaw: draft.logical_flaw || null, refutation_type: draft.refutation_type || null,
      })
      .eq('id', node.id).select().single()
    setSaving(false)
    if (error) { setSaveError(error.message); return }
    if (data) {
      onNodeUpdate((data as any).stream !== node.stream
        ? { ...(data as ArgumentNodeRow), _refetch: true } as any
        : data as ArgumentNodeRow)
      setEditing(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this node? This cannot be undone.')) return
    const supabase = createClient()
    const { error } = await supabase.from('argument_nodes').delete().eq('id', node.id)
    if (error) { setSaveError(error.message); return }
    onNodeUpdate({ ...node, _deleted: true } as any)
    setEditing(false)
  }

  if (editing) {
    return (
      <div ref={cardRef} className={`w-full p-3 rounded-lg ${cardClass}`}>
        <div className="space-y-2">
          <div className="flex gap-1.5">
            <select value={draft.stream} onChange={e => setDraft(d => ({ ...d, stream: e.target.value as any }))}
              className="flex-1 text-xs border border-stone-600 rounded px-2 py-1 bg-stone-900 text-stone-200 focus:outline-none focus:ring-1 focus:ring-saffron-500">
              <option value="mula">Mūla</option>
              <option value="bhavadipika">Bhāvadīpikā</option>
              <option value="vadavaliprakasha">Vādāvalīprakāśa</option>
              <option value="kashika">Kāśikā</option>
            </select>
            <select value={draft.node_type} onChange={e => setDraft(d => ({ ...d, node_type: e.target.value }))}
              className="flex-1 text-xs border border-stone-600 rounded px-2 py-1 bg-stone-900 text-stone-200 focus:outline-none focus:ring-1 focus:ring-saffron-500">
              <option value="purva_paksha">Pūrva Pakṣa</option>
              <option value="shanka">Śaṅkā</option>
              <option value="khandana">Khaṇḍana</option>
              <option value="samadhanam">Samādhānam</option>
              <option value="siddhanta">Siddhānta</option>
              <option value="upasamhara">Upasaṃhāra</option>
            </select>
          </div>
          <textarea value={draft.content_sanskrit} onChange={e => setDraft(d => ({ ...d, content_sanskrit: e.target.value }))}
            rows={3} placeholder="Sanskrit…"
            className="w-full text-xs font-devanagari border border-stone-600 rounded p-1.5 bg-stone-900 text-stone-200 focus:outline-none resize-none" />
          <textarea value={draft.content_english} onChange={e => setDraft(d => ({ ...d, content_english: e.target.value }))}
            rows={3} placeholder="English…"
            className="w-full text-xs border border-stone-600 rounded p-1.5 bg-stone-900 text-stone-200 focus:outline-none resize-none" />
          <div className="flex gap-1.5">
            <input type="text" value={draft.logical_flaw} onChange={e => setDraft(d => ({ ...d, logical_flaw: e.target.value }))}
              placeholder="Logical flaw (opt.)"
              className="flex-1 text-xs border border-stone-600 rounded px-2 py-1 bg-stone-900 text-stone-200 focus:outline-none" />
            <select value={draft.refutation_type} onChange={e => setDraft(d => ({ ...d, refutation_type: e.target.value }))}
              className="flex-1 text-xs border border-stone-600 rounded px-2 py-1 bg-stone-900 text-stone-200 focus:outline-none">
              <option value="">Refutation — none</option>
              <option value="lakshanam">lakshanam</option>
              <option value="pramanam">pramanam</option>
              <option value="anumanam">anumanam</option>
              <option value="siddhanta">siddhanta</option>
            </select>
          </div>
          <div className="flex gap-1.5 pt-0.5">
            <button onClick={handleSave} disabled={saving}
              className="px-2.5 py-1 text-xs font-medium bg-saffron-600 hover:bg-saffron-700 disabled:opacity-50 text-white rounded-md transition-colors">
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setEditing(false)}
              className="px-2.5 py-1 text-xs text-stone-400 border border-stone-600 hover:bg-stone-700 rounded-md transition-colors">
              Cancel
            </button>
            <button onClick={handleDelete}
              className="ml-auto px-2.5 py-1 text-xs bg-red-900/40 border border-red-700 text-red-400 hover:bg-red-900/70 rounded-md transition-colors">
              Delete
            </button>
          </div>
          {saveError && <p className="text-xs text-red-400 mt-1">{saveError}</p>}
        </div>
      </div>
    )
  }

  return (
    <div ref={cardRef}
      className={`w-full rounded-lg cursor-pointer select-none transition-opacity hover:opacity-90 ${cardClass}`}
      onClick={onToggleExpand}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-widest text-stone-400 font-medium leading-none">{label}</span>
          <div className="flex items-center gap-1.5">
            {isCurator && (
              <button onClick={e => { e.stopPropagation(); startEditing() }} title="Edit node"
                className="text-stone-600 hover:text-saffron-400 transition-colors">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                </svg>
              </button>
            )}
            {badge && (
              <span className={`text-[10px] font-devanagari font-bold rounded px-1 py-0.5 leading-none ${badge.className}`}>
                {badge.char}
              </span>
            )}
          </div>
        </div>
        {node.content_sanskrit && (
          <p className={`font-devanagari text-xs font-semibold text-stone-200 leading-snug mb-1 ${expanded ? '' : 'line-clamp-2'}`}>
            {parseBold(node.content_sanskrit)}
          </p>
        )}
        <p className={`text-xs text-stone-400 leading-snug ${expanded ? '' : 'line-clamp-2'}`}>
          {parseBold(node.content_english)}
        </p>
        {!expanded ? (
          <p className="text-[10px] text-stone-700 mt-1.5">click to expand</p>
        ) : (node.logical_flaw || node.refutation_type) ? (
          <div className="flex flex-wrap gap-1 mt-2">
            {node.logical_flaw && (
              <span className="text-[10px] bg-red-950/50 text-red-400 border border-red-800 rounded px-1.5 py-0.5">{node.logical_flaw}</span>
            )}
            {node.refutation_type && (
              <span className="text-[10px] bg-blue-950/50 text-blue-400 border border-blue-800 rounded px-1.5 py-0.5">{node.refutation_type}</span>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

// ── PassageDAG ────────────────────────────────────────────────────────────────

export default function PassageDAG({ nodes: initialNodes, passage, textId, isCurator, isLoggedIn }: Props) {
  const [localNodes,       setLocalNodes]       = useState<ArgumentNodeRow[]>(initialNodes)
  const [streamVisibility, setStreamVisibility] = useState<Record<string, boolean>>({})
  const [expandedIds,      setExpandedIds]      = useState<Set<string>>(new Set())
  const [measuredHeights,  setMeasuredHeights]  = useState<Map<string, number>>(new Map())

  const commentaryStreams = useMemo(() => {
    const streams = new Set<string>()
    for (const n of localNodes) { if (n.stream !== 'mula') streams.add(n.stream) }
    return [
      ...KNOWN_STREAM_ORDER.filter(s => streams.has(s)),
      ...[...streams].filter(s => !KNOWN_STREAM_ORDER.includes(s)).sort(),
    ]
  }, [localNodes])

  useEffect(() => {
    setStreamVisibility(prev => {
      const next = { ...prev }; let changed = false
      for (const s of commentaryStreams) { if (!(s in next)) { next[s] = true; changed = true } }
      return changed ? next : prev
    })
  }, [commentaryStreams])

  const activeCommentaryStreams = useMemo(() =>
    commentaryStreams.filter(s => streamVisibility[s] !== false),
    [commentaryStreams, streamVisibility],
  )

  const visibleNodes = useMemo(() =>
    localNodes.filter(n => n.stream === 'mula' || streamVisibility[n.stream]),
    [localNodes, streamVisibility],
  )

  const layout = useMemo(
    () => computeLayout(localNodes, activeCommentaryStreams, measuredHeights),
    [localNodes, activeCommentaryStreams, measuredHeights],
  )

  const arrowTypes = useMemo(() =>
    ['mula-mula', ...activeCommentaryStreams.map(s => `mula-${s}`)],
    [activeCommentaryStreams],
  )

  function toggleExpand(id: string) {
    setExpandedIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next })
  }

  const handleHeightChange = useCallback((id: string, height: number) => {
    setMeasuredHeights(prev => {
      if (prev.get(id) === height) return prev
      const next = new Map(prev); next.set(id, height); return next
    })
  }, [])

  const fetchNodes = useCallback(async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('argument_nodes')
      .select('id, stream, node_type, content_english, content_sanskrit, logical_flaw, refutation_type, parent_node_id, display_order')
      .eq('passage_id', passage.id).order('display_order')
    if (data) setLocalNodes(data as ArgumentNodeRow[])
  }, [passage.id])

  function handleNodeUpdate(updated: ArgumentNodeRow) {
    if ((updated as any)._deleted) {
      setLocalNodes(prev => prev.filter(n => n.id !== updated.id))
      setMeasuredHeights(prev => { const next = new Map(prev); next.delete(updated.id); return next })
    } else if ((updated as any)._refetch) {
      fetchNodes()
    } else {
      setLocalNodes(prev => prev.map(n => n.id === updated.id ? updated : n))
    }
  }

  const backHref  = `/texts/${textId}/map${passage.section_number != null ? `?section=${passage.section_number}` : ''}`
  const pageTitle = passage.section_name ? `§${passage.section_number} — ${passage.section_name}` : `Passage ${passage.sequence_order}`

  return (
    <div className="h-screen flex flex-col bg-stone-950 overflow-hidden">
      {/* ── Top bar ── */}
      <div className="shrink-0 flex items-center gap-3 px-5 py-3 border-b border-stone-800 bg-stone-900/90 backdrop-blur">
        <Link href={backHref}
          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-200 transition-colors shrink-0 whitespace-nowrap">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Section Map
        </Link>
        <div className="flex-1 text-center min-w-0">
          <h1 className="text-sm font-semibold text-stone-300 font-devanagari truncate">{pageTitle}</h1>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-devanagari font-medium rounded-full px-2.5 py-1 bg-stone-700 text-stone-400 border border-stone-600 cursor-default">
            मूलम्
          </span>
          {commentaryStreams.map(stream => {
            const cfg = STREAM_CONFIG[stream]; if (!cfg) return null
            const isOn = streamVisibility[stream] !== false
            return (
              <button key={stream}
                onClick={() => setStreamVisibility(prev => ({ ...prev, [stream]: !isOn }))}
                className={`text-[11px] font-devanagari font-medium rounded-full px-2.5 py-1 transition-all ${isOn ? cfg.toggleOn : cfg.toggleOff}`}>
                {cfg.devanagari}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Canvas ── */}
      <div className="flex-1 overflow-auto" style={{ scrollbarColor: '#44403c #1c1917', scrollbarWidth: 'thin' }}>
        <div className="relative" style={{ width: layout.canvasW, height: layout.canvasH, minWidth: '100%', minHeight: '100%' }}>
          <svg className="absolute inset-0 pointer-events-none" width={layout.canvasW} height={layout.canvasH} style={{ zIndex: 0 }}>
            <defs>
              {arrowTypes.map(type => (
                <marker key={type} id={`dag-arrow-${type}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill={STREAM_ARROW_COLOR[type] ?? '#a8a29e'} fillOpacity="0.7" />
                </marker>
              ))}
            </defs>
            {layout.arrows.map((a, i) => {
              const isVertical = a.type === 'mula-mula'
              const d = isVertical
                ? `M ${a.x1} ${a.y1} C ${a.x1} ${a.y1 + 32} ${a.x2} ${a.y2 - 32} ${a.x2} ${a.y2}`
                : `M ${a.x1} ${a.y1} C ${a.x1 + 36} ${a.y1} ${a.x2 - 36} ${a.y2} ${a.x2} ${a.y2}`
              return (
                <path key={i} d={d} fill="none"
                  stroke={STREAM_ARROW_COLOR[a.type] ?? '#a8a29e'}
                  strokeWidth="1.5" strokeOpacity="0.5"
                  markerEnd={`url(#dag-arrow-${a.type})`} />
              )
            })}
          </svg>

          {visibleNodes.map(node => {
            const pos = layout.positions.get(node.id); if (!pos) return null
            return (
              <div key={node.id} className="absolute"
                style={{ left: pos.x, top: pos.y, width: NODE_W, zIndex: expandedIds.has(node.id) ? 10 : 1 }}>
                <DAGNodeCard node={node} expanded={expandedIds.has(node.id)}
                  onToggleExpand={() => toggleExpand(node.id)}
                  isCurator={isCurator} onNodeUpdate={handleNodeUpdate} onHeightChange={handleHeightChange} />
              </div>
            )
          })}

          {localNodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-stone-600 text-sm italic">No argument nodes for this passage yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
