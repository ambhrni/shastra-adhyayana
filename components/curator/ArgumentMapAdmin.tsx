'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ArgumentStream } from '@/lib/argument-map-generator'

// ── Types ─────────────────────────────────────────────────────────────────────

interface PassageOption {
  id: string
  text_id: string
  section_number: number | null
  section_name: string | null
  sequence_order: number
}

interface ArgumentNodeRow {
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

interface PassageTextData {
  sectionName: string | null
  mulaText: string
  commentaryText: string | null
}

interface EditState {
  nodeId: string
  field: string
  value: string
}

interface Props {
  passages: PassageOption[]
}

// ── Constants ─────────────────────────────────────────────────────────────────

const STREAM_LABELS: Record<ArgumentStream, string> = {
  mula: 'मूलम्',
  bhavadipika: 'भावदीपिका',
  vadavaliprakasha: 'वादावलीप्रकाशः',
}

const NODE_TYPE_BADGE: Record<string, string> = {
  purva_paksha: 'bg-red-100 text-red-700 border border-red-200',
  khandana:     'bg-green-100 text-green-700 border border-green-200',
  siddhanta:    'bg-blue-100 text-blue-700 border border-blue-200',
  shanka:       'bg-amber-100 text-amber-700 border border-amber-200',
  samadhanam:   'bg-teal-100 text-teal-700 border border-teal-200',
  upasamhara:   'bg-stone-100 text-stone-700 border border-stone-200',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ArgumentMapAdmin({ passages }: Props) {
  const [selectedPassageId, setSelectedPassageId] = useState<string>(passages[0]?.id ?? '')
  const [selectedStream, setSelectedStream] = useState<ArgumentStream>('mula')
  const [nodes, setNodes] = useState<ArgumentNodeRow[]>([])
  const [passageText, setPassageText] = useState<PassageTextData | null>(null)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editState, setEditState] = useState<EditState | null>(null)
  const [saving, setSaving] = useState(false)

  // Group passages by section for the dropdown
  const sectionMap = new Map<number, PassageOption[]>()
  for (const p of passages) {
    const sec = p.section_number ?? 0
    if (!sectionMap.has(sec)) sectionMap.set(sec, [])
    sectionMap.get(sec)!.push(p)
  }
  const sections = Array.from(sectionMap.entries()).sort(([a], [b]) => a - b)

  // Fetch when selection changes
  useEffect(() => {
    if (!selectedPassageId) return

    async function load() {
      setLoading(true)
      setError(null)
      setPassageText(null)

      const supabase = createClient()

      // Fetch mūla + commentary in parallel
      const [passageRes, commentaryRes] = await Promise.all([
        supabase
          .from('passages')
          .select('mula_text, section_name')
          .eq('id', selectedPassageId)
          .single(),
        supabase
          .from('commentaries')
          .select('commentary_text, commentator:commentators(name_transliterated)')
          .eq('passage_id', selectedPassageId),
      ])

      let commentaryText: string | null = null
      if (selectedStream !== 'mula') {
        const targetName = selectedStream === 'bhavadipika' ? 'raghavendra' : 'shrinivasa'
        const found = (commentaryRes.data ?? []).find((c: any) =>
          (c.commentator?.name_transliterated ?? '').toLowerCase().includes(targetName)
        )
        commentaryText = found?.commentary_text ?? null
      }

      setPassageText({
        sectionName: passageRes.data?.section_name ?? null,
        mulaText: passageRes.data?.mula_text ?? '',
        commentaryText,
      })

      // Fetch nodes
      const { data: nodesData, error: nodesErr } = await supabase
        .from('argument_nodes')
        .select('*')
        .eq('passage_id', selectedPassageId)
        .eq('stream', selectedStream)
        .order('display_order')

      if (nodesErr) setError(nodesErr.message)
      setNodes(nodesData ?? [])
      setLoading(false)
    }

    load()
  }, [selectedPassageId, selectedStream])

  // ── Actions ─────────────────────────────────────────────────────────────────

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/generate-argument-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passageId: selectedPassageId, stream: selectedStream }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Generation failed')
      setNodes(json.nodes ?? [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  async function handleApproveAll() {
    const supabase = createClient()
    await supabase
      .from('argument_nodes')
      .update({ is_approved: true })
      .eq('passage_id', selectedPassageId)
      .eq('stream', selectedStream)
    setNodes(prev => prev.map(n => ({ ...n, is_approved: true })))
  }

  async function handleToggleApprove(node: ArgumentNodeRow) {
    const supabase = createClient()
    const newVal = !node.is_approved
    await supabase.from('argument_nodes').update({ is_approved: newVal }).eq('id', node.id)
    setNodes(prev => prev.map(n => n.id === node.id ? { ...n, is_approved: newVal } : n))
  }

  async function handleDelete(nodeId: string) {
    const supabase = createClient()
    await supabase.from('argument_nodes').delete().eq('id', nodeId)
    setNodes(prev => prev.filter(n => n.id !== nodeId))
  }

  async function saveEdit() {
    if (!editState || saving) return
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('argument_nodes')
      .update({ [editState.field]: editState.value || null })
      .eq('id', editState.nodeId)
    setNodes(prev => prev.map(n =>
      n.id === editState.nodeId
        ? { ...n, [editState.field]: editState.value || null }
        : n
    ))
    setEditState(null)
    setSaving(false)
  }

  // ── Derived ──────────────────────────────────────────────────────────────────

  const approvedCount = nodes.filter(n => n.is_approved).length
  const aiModel = nodes[0]?.ai_model ?? null

  // ── Render ───────────────────────────────────────────────────────────────────

  if (passages.length === 0) {
    return <p className="text-stone-400 text-sm italic">No passages found. Ingest text first.</p>
  }

  return (
    <div className="space-y-4">

      {/* Top bar: passage selector + stream selector */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedPassageId}
          onChange={e => setSelectedPassageId(e.target.value)}
          className="flex-1 min-w-[220px] text-sm border border-stone-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-saffron-400"
        >
          {sections.map(([secNum, secPassages]) => (
            <optgroup
              key={secNum}
              label={`§${secNum} — ${secPassages[0]?.section_name ?? ''}`}
            >
              {secPassages.map(p => (
                <option key={p.id} value={p.id}>
                  Passage {p.sequence_order}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <div className="flex gap-1">
          {(['mula', 'bhavadipika', 'vadavaliprakasha'] as ArgumentStream[]).map(stream => (
            <button
              key={stream}
              onClick={() => setSelectedStream(stream)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors font-devanagari ${
                selectedStream === stream
                  ? 'bg-saffron-600 text-white'
                  : 'border border-stone-200 text-stone-600 hover:border-saffron-400 hover:text-saffron-700'
              }`}
            >
              {STREAM_LABELS[stream]}
            </button>
          ))}
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-4 items-start">

        {/* Left: passage text (40%) */}
        <div
          className="w-[40%] shrink-0 bg-stone-50 border border-stone-200 rounded-xl p-5 max-h-[700px] overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#d6d3d1 #f5f5f4' }}
        >
          {passageText ? (
            <>
              {passageText.sectionName && (
                <p className="text-xs text-stone-400 font-devanagari mb-3 leading-snug">
                  {passageText.sectionName}
                </p>
              )}
              <p className="font-devanagari text-[18px] text-stone-900 leading-relaxed">
                {passageText.mulaText}
              </p>
              {passageText.commentaryText && (
                <>
                  <div className="border-t border-stone-200 mt-5 mb-4" />
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3 font-devanagari">
                    {STREAM_LABELS[selectedStream]}
                  </p>
                  <p className="font-devanagari text-sm text-stone-700 leading-relaxed">
                    {passageText.commentaryText}
                  </p>
                </>
              )}
            </>
          ) : (
            <p className="text-stone-400 text-sm">Loading…</p>
          )}
        </div>

        {/* Right: argument nodes (60%) */}
        <div className="flex-1 min-w-0">

          {/* Right panel toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-3 py-1.5 text-xs font-medium bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {generating ? 'Generating…' : nodes.length > 0 ? 'Regenerate' : 'Generate'}
            </button>
            {nodes.length > 0 && (
              <button
                onClick={handleApproveAll}
                className="px-3 py-1.5 text-xs font-medium border border-green-400 text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                Approve All
              </button>
            )}
            <span className="text-xs text-stone-400">
              {nodes.length} nodes — {approvedCount} approved
            </span>
            {aiModel && (
              <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded font-mono">
                {aiModel}
              </span>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <p className="text-stone-400 text-sm">Loading nodes…</p>
          ) : nodes.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <p className="text-sm">No argument nodes yet.</p>
              <p className="text-xs mt-1">Click Generate to create with AI.</p>
            </div>
          ) : (
            <div
              className="space-y-3 max-h-[650px] overflow-y-auto pr-1"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#d6d3d1 #f5f5f4' }}
            >
              {nodes.map(node => {
                const parentNode = node.parent_node_id
                  ? nodes.find(n => n.id === node.parent_node_id)
                  : null

                return (
                  <div
                    key={node.id}
                    className={`border rounded-xl p-4 ${
                      node.is_approved
                        ? 'border-green-200 bg-green-50/30'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    {/* Node header row */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Node type badge */}
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${NODE_TYPE_BADGE[node.node_type] ?? 'bg-stone-100 text-stone-600 border border-stone-200'}`}>
                          {node.node_type.replace(/_/g, ' ')}
                        </span>
                        {/* Logical flaw chip */}
                        {node.logical_flaw && (
                          <span className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full">
                            {node.logical_flaw}
                          </span>
                        )}
                        {/* Refutation type chip */}
                        {node.refutation_type && (
                          <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full">
                            {node.refutation_type}
                          </span>
                        )}
                        {/* Parent indicator */}
                        {parentNode && (
                          <span className="text-xs text-stone-400">
                            ↳ {parentNode.node_type.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>

                      {/* Approve / Delete controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleToggleApprove(node)}
                          className={`text-xs px-2 py-0.5 rounded-lg transition-colors ${
                            node.is_approved
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                          }`}
                        >
                          {node.is_approved ? '✓ Approved' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleDelete(node.id)}
                          className="text-xs px-2 py-0.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    </div>

                    {/* content_english — editable */}
                    {editState?.nodeId === node.id && editState.field === 'content_english' ? (
                      <textarea
                        autoFocus
                        value={editState.value}
                        onChange={e => setEditState(prev => prev ? { ...prev, value: e.target.value } : null)}
                        onBlur={saveEdit}
                        rows={4}
                        className="w-full text-sm border border-saffron-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-saffron-400 resize-y"
                      />
                    ) : (
                      <p
                        onClick={() => setEditState({ nodeId: node.id, field: 'content_english', value: node.content_english })}
                        className="text-sm text-stone-800 leading-snug cursor-pointer hover:bg-stone-50 rounded p-1 -m-1 transition-colors"
                        title="Click to edit"
                      >
                        {node.content_english}
                      </p>
                    )}

                    {/* content_sanskrit — editable */}
                    <div className="mt-2">
                      {editState?.nodeId === node.id && editState.field === 'content_sanskrit' ? (
                        <input
                          autoFocus
                          type="text"
                          value={editState.value}
                          onChange={e => setEditState(prev => prev ? { ...prev, value: e.target.value } : null)}
                          onBlur={saveEdit}
                          className="w-full text-sm font-devanagari border border-saffron-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-saffron-400"
                        />
                      ) : (
                        <p
                          onClick={() => setEditState({ nodeId: node.id, field: 'content_sanskrit', value: node.content_sanskrit ?? '' })}
                          className="text-sm font-devanagari text-stone-500 cursor-pointer hover:bg-stone-50 rounded p-0.5 -m-0.5 transition-colors"
                          title="Click to edit"
                        >
                          {node.content_sanskrit || (
                            <span className="text-stone-300 not-italic text-xs">Sanskrit terms — click to add</span>
                          )}
                        </p>
                      )}
                    </div>

                    {/* Editable chips: logical_flaw + refutation_type */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {/* logical_flaw */}
                      {editState?.nodeId === node.id && editState.field === 'logical_flaw' ? (
                        <input
                          autoFocus
                          type="text"
                          value={editState.value}
                          onChange={e => setEditState(prev => prev ? { ...prev, value: e.target.value } : null)}
                          onBlur={saveEdit}
                          placeholder="logical flaw"
                          className="text-xs border border-orange-300 rounded px-2 py-0.5 focus:outline-none w-36"
                        />
                      ) : (
                        <span
                          onClick={() => setEditState({ nodeId: node.id, field: 'logical_flaw', value: node.logical_flaw ?? '' })}
                          className="text-xs bg-stone-50 text-stone-400 border border-dashed border-stone-200 px-2 py-0.5 rounded cursor-pointer hover:border-stone-400 transition-colors"
                          title="Click to edit logical flaw"
                        >
                          {node.logical_flaw || 'flaw…'}
                        </span>
                      )}

                      {/* refutation_type */}
                      {editState?.nodeId === node.id && editState.field === 'refutation_type' ? (
                        <input
                          autoFocus
                          type="text"
                          value={editState.value}
                          onChange={e => setEditState(prev => prev ? { ...prev, value: e.target.value } : null)}
                          onBlur={saveEdit}
                          placeholder="refutation type"
                          className="text-xs border border-purple-300 rounded px-2 py-0.5 focus:outline-none w-36"
                        />
                      ) : (
                        <span
                          onClick={() => setEditState({ nodeId: node.id, field: 'refutation_type', value: node.refutation_type ?? '' })}
                          className="text-xs bg-stone-50 text-stone-400 border border-dashed border-stone-200 px-2 py-0.5 rounded cursor-pointer hover:border-stone-400 transition-colors"
                          title="Click to edit refutation type"
                        >
                          {node.refutation_type || 'type…'}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
