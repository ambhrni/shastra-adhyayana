'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PassageRow {
  id: string
  sequence_order: number
  section_name: string | null
  mula_text: string | null
}

export interface ArgumentNodeRow {
  id: string
  stream: 'mula' | 'bhavadipika' | 'vadavaliprakasha'
  node_type: string
  content_english: string
  content_sanskrit: string | null
  logical_flaw: string | null
  refutation_type: string | null
  parent_node_id: string | null
  display_order: number
}

interface MulaNodeWithChildren {
  node: ArgumentNodeRow
  bhavadipika: ArgumentNodeRow[]
  vadavaliprakasha: ArgumentNodeRow[]
}

interface Props {
  textId: string
  passages: PassageRow[]
  isCurator?: boolean
}

// ── Constants ─────────────────────────────────────────────────────────────────

const NODE_TYPE_LABEL: Record<string, string> = {
  purva_paksha: 'Pūrva Pakṣa',
  shanka:       'Śaṅkā',
  khandana:     'Khaṇḍana',
  samadhanam:   'Samādhānam',
  siddhanta:    'Siddhānta',
  upasamhara:   'Upasaṃhāra',
}

const NODE_CARD_CLASS: Record<string, string> = {
  purva_paksha: 'bg-stone-50 border border-stone-200',
  shanka:       'bg-amber-50 border border-stone-200 border-l-4 border-l-amber-400',
  khandana:     'bg-red-50 border border-stone-200 border-l-4 border-l-red-300',
  samadhanam:   'bg-green-50 border border-stone-200 border-l-4 border-l-green-300',
  siddhanta:    'bg-blue-50 border border-stone-200 border-l-4 border-l-blue-400',
  upasamhara:   'bg-stone-100 border border-dashed border-stone-300',
}

const REFUTATION_BADGE: Record<string, string> = {
  lakshanam: 'bg-orange-100 text-orange-700 border-orange-200',
  pramanam:  'bg-blue-100 text-blue-700 border-blue-200',
  anumanam:  'bg-red-100 text-red-700 border-red-200',
  siddhanta: 'bg-green-100 text-green-700 border-green-200',
}

// ── Bold markdown parser ──────────────────────────────────────────────────────

function parseBold(text: string): React.ReactNode {
  const parts = text.split(/\*\*(.+?)\*\*/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      )}
    </>
  )
}

// ── Stream badge ──────────────────────────────────────────────────────────────

function StreamBadge({ stream }: { stream: ArgumentNodeRow['stream'] }) {
  if (stream === 'mula') return (
    <span className="text-[11px] font-devanagari font-bold text-stone-600 bg-stone-200 border border-stone-300 rounded px-1.5 py-0.5 leading-none">
      मू
    </span>
  )
  if (stream === 'bhavadipika') return (
    <span className="text-[11px] font-devanagari font-bold text-saffron-600 bg-saffron-50 border border-saffron-200 rounded px-1.5 py-0.5 leading-none">
      रा
    </span>
  )
  return (
    <span className="text-[11px] font-devanagari font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 leading-none">
      श्री
    </span>
  )
}

// ── Node card ─────────────────────────────────────────────────────────────────

function NodeCard({
  node,
  stream,
  textId,
  passageId,
  isCurator,
  onNodeUpdate,
}: {
  node: ArgumentNodeRow
  stream: 'mula' | 'bhavadipika' | 'vadavaliprakasha'
  textId: string
  passageId: string
  isCurator?: boolean
  onNodeUpdate?: (updated: ArgumentNodeRow) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Omit<ArgumentNodeRow, 'id' | 'parent_node_id' | 'display_order'>>(
    { stream: node.stream, node_type: node.node_type, content_english: node.content_english,
      content_sanskrit: node.content_sanskrit, logical_flaw: node.logical_flaw, refutation_type: node.refutation_type }
  )
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const label     = NODE_TYPE_LABEL[node.node_type] ?? node.node_type.replace(/_/g, ' ')
  const cardClass = NODE_CARD_CLASS[node.node_type] ?? 'bg-stone-50 border border-stone-200'

  function startEditing() {
    setDraft({
      stream: node.stream, node_type: node.node_type,
      content_english: node.content_english, content_sanskrit: node.content_sanskrit,
      logical_flaw: node.logical_flaw, refutation_type: node.refutation_type,
    })
    setSaveError(null)
    setEditing(true)
  }

  async function handleSave() {
    setSaving(true)
    setSaveError(null)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('argument_nodes')
      .update({
        stream:           draft.stream,
        node_type:        draft.node_type,
        content_english:  draft.content_english,
        content_sanskrit: draft.content_sanskrit || null,
        logical_flaw:     draft.logical_flaw     || null,
        refutation_type:  draft.refutation_type  || null,
      })
      .eq('id', node.id)
      .select()
      .single()
    setSaving(false)
    if (error) {
      console.error('[NodeCard] update error:', error)
      setSaveError(error.message)
      return
    }
    if (data) {
      // If stream changed, signal parent to re-fetch so the tree rebuilds correctly
      const streamChanged = (data as any).stream !== node.stream
      onNodeUpdate?.(streamChanged ? { ...(data as ArgumentNodeRow), _refetch: true } as any : data as ArgumentNodeRow)
      setEditing(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this node? This cannot be undone.')) return
    const supabase = createClient()
    const { error } = await supabase.from('argument_nodes').delete().eq('id', node.id)
    if (error) {
      console.error('[NodeCard] delete error:', error)
      setSaveError(error.message)
      return
    }
    // Signal parent to remove this node by passing a sentinel with a special flag
    onNodeUpdate?.({ ...node, _deleted: true } as any)
    setEditing(false)
  }

  // ── Edit form ────────────────────────────────────────────────────────────────

  if (editing) {
    return (
      <div className={`w-full p-4 rounded-lg ${cardClass}`}>
        <div className="space-y-2.5">
          <div className="flex gap-2">
            <select
              value={draft.stream}
              onChange={e => setDraft(d => ({ ...d, stream: e.target.value as ArgumentNodeRow['stream'] }))}
              className="text-xs border border-stone-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-saffron-400"
            >
              <option value="mula">Mūla</option>
              <option value="bhavadipika">Bhāvadīpikā</option>
              <option value="vadavaliprakasha">Vādāvalīprakāśa</option>
            </select>
            <select
              value={draft.node_type}
              onChange={e => setDraft(d => ({ ...d, node_type: e.target.value }))}
              className="text-xs border border-stone-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-saffron-400"
            >
              <option value="purva_paksha">Pūrva Pakṣa</option>
              <option value="shanka">Śaṅkā</option>
              <option value="khandana">Khaṇḍana</option>
              <option value="samadhanam">Samādhānam</option>
              <option value="siddhanta">Siddhānta</option>
              <option value="upasamhara">Upasaṃhāra</option>
            </select>
          </div>
          <textarea
            value={draft.content_sanskrit ?? ''}
            onChange={e => setDraft(d => ({ ...d, content_sanskrit: e.target.value }))}
            rows={3}
            placeholder="Sanskrit content…"
            className="w-full text-sm font-devanagari border border-stone-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-saffron-400 resize-none"
          />
          <textarea
            value={draft.content_english}
            onChange={e => setDraft(d => ({ ...d, content_english: e.target.value }))}
            rows={3}
            placeholder="English content…"
            className="w-full text-sm border border-stone-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-saffron-400 resize-none"
          />
          <input
            type="text"
            value={draft.logical_flaw ?? ''}
            onChange={e => setDraft(d => ({ ...d, logical_flaw: e.target.value }))}
            placeholder="Logical flaw (optional)"
            className="w-full text-xs border border-stone-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-saffron-400"
          />
          <select
            value={draft.refutation_type ?? ''}
            onChange={e => setDraft(d => ({ ...d, refutation_type: e.target.value || null }))}
            className="w-full text-xs border border-stone-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-saffron-400"
          >
            <option value="">Refutation type — none</option>
            <option value="lakshanam">lakshanam</option>
            <option value="pramanam">pramanam</option>
            <option value="anumanam">anumanam</option>
            <option value="siddhanta">siddhanta</option>
          </select>
          <div className="flex gap-2 pt-0.5">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1 text-xs font-medium bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-1 text-xs font-medium text-stone-600 border border-stone-200 hover:bg-stone-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="ml-auto px-3 py-1 text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
          {saveError && (
            <p className="text-xs text-red-600 mt-1">{saveError}</p>
          )}
        </div>
      </div>
    )
  }

  // ── Display (curator mode — div, no link) ────────────────────────────────────

  if (isCurator) {
    return (
      <div className={`w-full p-4 rounded-lg ${cardClass}`}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-medium">
            {label}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={startEditing}
              title="Edit node"
              className="text-stone-300 hover:text-saffron-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            </button>
            <StreamBadge stream={stream} />
          </div>
        </div>
        {node.content_sanskrit && (
          <p className="font-devanagari text-sm font-semibold text-stone-800 leading-snug mb-1">
            {parseBold(node.content_sanskrit)}
          </p>
        )}
        <p className="text-sm text-stone-500 leading-snug">
          {parseBold(node.content_english)}
        </p>
        {(node.logical_flaw || node.refutation_type) && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {node.logical_flaw && (
              <span className="text-[10px] font-medium bg-red-50 text-red-600 border border-red-200 rounded px-1.5 py-0.5">
                {node.logical_flaw}
              </span>
            )}
            {node.refutation_type && (
              <span className={`text-[10px] font-medium border rounded px-1.5 py-0.5 ${REFUTATION_BADGE[node.refutation_type] ?? 'bg-stone-100 text-stone-500 border-stone-200'}`}>
                {node.refutation_type}
              </span>
            )}
          </div>
        )}
      </div>
    )
  }

  // ── Display (read-only — Link) ────────────────────────────────────────────────

  return (
    <Link
      href={`/texts/${textId}/map/passage/${passageId}`}
      className={`block w-full p-4 rounded-lg hover:opacity-80 transition-opacity ${cardClass}`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs uppercase tracking-widest text-stone-400 font-medium">
          {label}
        </span>
        <StreamBadge stream={stream} />
      </div>
      {node.content_sanskrit && (
        <p className="font-devanagari text-sm font-semibold text-stone-800 leading-snug mb-1">
          {parseBold(node.content_sanskrit)}
        </p>
      )}
      <p className="text-sm text-stone-500 leading-snug">
        {parseBold(node.content_english)}
      </p>
      {(node.logical_flaw || node.refutation_type) && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {node.logical_flaw && (
            <span className="text-[10px] font-medium bg-red-50 text-red-600 border border-red-200 rounded px-1.5 py-0.5">
              {node.logical_flaw}
            </span>
          )}
          {node.refutation_type && (
            <span className={`text-[10px] font-medium border rounded px-1.5 py-0.5 ${REFUTATION_BADGE[node.refutation_type] ?? 'bg-stone-100 text-stone-500 border-stone-200'}`}>
              {node.refutation_type}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}

// ── Argument flow diagram ─────────────────────────────────────────────────────

export function ArgumentFlowDiagram({
  nodes,
  textId,
  passageId,
  isCurator,
  onNodeUpdate,
}: {
  nodes: ArgumentNodeRow[]
  textId: string
  passageId: string
  isCurator?: boolean
  onNodeUpdate?: (updated: ArgumentNodeRow) => void
}) {
  const [showBhava, setShowBhava] = useState(true)
  const [showVada,  setShowVada]  = useState(true)

  const mulaNodes = nodes
    .filter(n => n.stream === 'mula')
    .sort((a, b) => a.display_order - b.display_order)

  const mulaIds = new Set(mulaNodes.map(n => n.id))

  const bhavaByParent = new Map<string, ArgumentNodeRow[]>()
  const vadaByParent  = new Map<string, ArgumentNodeRow[]>()

  for (const n of nodes) {
    if (n.stream === 'mula') continue
    // Only index nodes whose parent is a real mūla node
    if (n.parent_node_id && mulaIds.has(n.parent_node_id)) {
      const map = n.stream === 'bhavadipika' ? bhavaByParent : vadaByParent
      if (!map.has(n.parent_node_id)) map.set(n.parent_node_id, [])
      map.get(n.parent_node_id)!.push(n)
    }
  }

  const tree: MulaNodeWithChildren[] = mulaNodes.map(node => ({
    node,
    bhavadipika:      (bhavaByParent.get(node.id) ?? []).sort((a, b) => a.display_order - b.display_order),
    vadavaliprakasha: (vadaByParent.get(node.id)  ?? []).sort((a, b) => a.display_order - b.display_order),
  }))

  // Attach orphaned commentary nodes (null parent or parent not a mūla node)
  // to the nearest preceding mūla node by display_order
  const orphanBhava = nodes.filter(n =>
    n.stream === 'bhavadipika' && (!n.parent_node_id || !mulaIds.has(n.parent_node_id))
  )
  const orphanVada = nodes.filter(n =>
    n.stream === 'vadavaliprakasha' && (!n.parent_node_id || !mulaIds.has(n.parent_node_id))
  )

  function findNearestMulaIndex(orphanOrder: number): number {
    let idx = 0
    for (let i = 0; i < mulaNodes.length; i++) {
      if (mulaNodes[i].display_order <= orphanOrder) idx = i
      else break
    }
    return idx
  }

  for (const orphan of orphanBhava) {
    const idx = findNearestMulaIndex(orphan.display_order)
    tree[idx].bhavadipika.push(orphan)
    tree[idx].bhavadipika.sort((a, b) => a.display_order - b.display_order)
  }
  for (const orphan of orphanVada) {
    const idx = findNearestMulaIndex(orphan.display_order)
    tree[idx].vadavaliprakasha.push(orphan)
    tree[idx].vadavaliprakasha.sort((a, b) => a.display_order - b.display_order)
  }

  if (tree.length === 0) {
    return <p className="text-xs text-stone-400 italic">No argument nodes yet.</p>
  }

  return (
    <div>
      {/* Stream toggle buttons */}
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xs font-devanagari font-medium rounded-full px-3 py-1 bg-stone-200 text-stone-700 border border-stone-300 cursor-default">
          मूलम्
        </span>
        <button
          onClick={() => setShowBhava(v => !v)}
          className={`text-xs font-devanagari font-medium rounded-full px-3 py-1 transition-all ${
            showBhava
              ? 'bg-orange-100 text-orange-700 border border-orange-300'
              : 'bg-white text-stone-400 border border-stone-200 opacity-50'
          }`}
        >
          भावदीपिका
        </button>
        <button
          onClick={() => setShowVada(v => !v)}
          className={`text-xs font-devanagari font-medium rounded-full px-3 py-1 transition-all ${
            showVada
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-white text-stone-400 border border-stone-200 opacity-50'
          }`}
        >
          वादावलीप्रकाशः
        </button>
      </div>

      {/* Continuous spine with dot markers */}
      <div className="relative border-l-2 border-stone-200 ml-6 pl-4">
        {tree.map((item) => (
          <div key={item.node.id} className="mb-4">
            <div className="absolute -left-[9px] mt-4 w-3 h-3 rounded-full bg-stone-300 border-2 border-white" />

            <NodeCard
              node={item.node} stream="mula"
              textId={textId} passageId={passageId}
              isCurator={isCurator} onNodeUpdate={onNodeUpdate}
            />

            {showBhava && item.bhavadipika.length > 0 && (
              <div className="ml-8 mt-2 space-y-2">
                {item.bhavadipika.map(n => (
                  <NodeCard key={n.id} node={n} stream="bhavadipika"
                    textId={textId} passageId={passageId}
                    isCurator={isCurator} onNodeUpdate={onNodeUpdate}
                  />
                ))}
              </div>
            )}

            {showVada && item.vadavaliprakasha.length > 0 && (
              <div className="ml-16 mt-2 space-y-2">
                {item.vadavaliprakasha.map(n => (
                  <NodeCard key={n.id} node={n} stream="vadavaliprakasha"
                    textId={textId} passageId={passageId}
                    isCurator={isCurator} onNodeUpdate={onNodeUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── PassageChain ──────────────────────────────────────────────────────────────

export default function PassageChain({ textId, passages, isCurator }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [nodesMap, setNodesMap]     = useState<Record<string, ArgumentNodeRow[]>>({})
  const [loadingId, setLoadingId]   = useState<string | null>(null)

  async function fetchNodes(passageId: string) {
    setLoadingId(passageId)
    const supabase = createClient()
    const { data } = await supabase
      .from('argument_nodes')
      .select('id, stream, node_type, content_english, content_sanskrit, logical_flaw, refutation_type, parent_node_id, display_order')
      .eq('passage_id', passageId)
      .order('display_order')
    setNodesMap(prev => ({ ...prev, [passageId]: (data ?? []) as ArgumentNodeRow[] }))
    setLoadingId(null)
  }

  async function handleToggle(passageId: string) {
    if (expandedId === passageId) {
      setExpandedId(null)
      return
    }
    setExpandedId(passageId)
    if (nodesMap[passageId] !== undefined) return
    await fetchNodes(passageId)
  }

  function handleNodeUpdate(passageId: string, updated: ArgumentNodeRow) {
    if ((updated as any)._deleted) {
      setNodesMap(prev => ({
        ...prev,
        [passageId]: (prev[passageId] ?? []).filter(n => n.id !== updated.id),
      }))
    } else if ((updated as any)._refetch) {
      fetchNodes(passageId)
    } else {
      setNodesMap(prev => ({
        ...prev,
        [passageId]: (prev[passageId] ?? []).map(n => n.id === updated.id ? updated : n),
      }))
    }
  }

  return (
    <div>
      {passages.map((passage) => {
        const isExpanded = expandedId === passage.id
        const nodes      = nodesMap[passage.id] ?? []
        const isLoading  = loadingId === passage.id
        const label      = passage.section_name ?? `Passage ${passage.sequence_order}`

        return (
          <div key={passage.id}>
            <button
              onClick={() => handleToggle(passage.id)}
              className={`w-full text-left border rounded-xl px-4 py-3 transition-all ${
                isExpanded
                  ? 'border-saffron-400 bg-saffron-50 shadow-sm rounded-b-none'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-stone-400 shrink-0">
                  {passage.sequence_order}
                </span>
                <span className="text-sm font-devanagari text-stone-800 leading-snug flex-1">
                  {label}
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-stone-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {!isExpanded && passage.mula_text && (
                <p className="text-[11px] font-devanagari text-stone-400 mt-1 leading-snug line-clamp-1">
                  {passage.mula_text}
                </p>
              )}
            </button>

            {isExpanded && (
              <div className="border border-t-0 border-saffron-400 rounded-b-xl bg-white px-5 py-5">
                {isLoading ? (
                  <p className="text-xs text-stone-400">Loading…</p>
                ) : (
                  <ArgumentFlowDiagram
                    nodes={nodes}
                    textId={textId}
                    passageId={passage.id}
                    isCurator={isCurator}
                    onNodeUpdate={(updated) => handleNodeUpdate(passage.id, updated)}
                  />
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
