'use client'

import { useState } from 'react'
import Badge from '@/components/ui/Badge'

interface ArgumentMapFlagRow {
  id: string
  passage_id: string
  text_id: string
  user_id: string | null
  issue_type: string
  description: string
  node_id: string | null
  status: string
  curator_response: string | null
  created_at: string
  passage?: { mula_text: string; section_name: string | null; sequence_order: number } | null
  text?: { title_transliterated: string } | null
}

interface Props {
  flags: ArgumentMapFlagRow[]
}

const statusVariant: Record<string, 'amber' | 'green' | 'stone'> = {
  open:      'amber',
  resolved:  'green',
  dismissed: 'stone',
}

const issueTypeVariant: Record<string, 'amber' | 'stone'> = {
  'Incorrect Sanskrit':    'amber',
  'Wrong logical flow':    'amber',
  'Incorrect attribution': 'amber',
  'Missing node':          'amber',
  'Other':                 'stone',
}

export default function ArgumentMapFlagsList({ flags: initialFlags }: Props) {
  const [flags, setFlags] = useState(initialFlags)
  const [updating, setUpdating] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  async function updateStatus(flagId: string, status: 'resolved' | 'dismissed') {
    setUpdating(flagId)
    await fetch('/api/argument-map-flags', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flag_id: flagId, status }),
    })
    setFlags(prev => prev.map(f => f.id === flagId ? { ...f, status } : f))
    setUpdating(null)
  }

  async function saveResponse(flagId: string) {
    const curator_response = drafts[flagId] ?? ''
    setUpdating(flagId)
    await fetch('/api/argument-map-flags', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flag_id: flagId, curator_response }),
    })
    setFlags(prev => prev.map(f => f.id === flagId ? { ...f, curator_response } : f))
    setUpdating(null)
  }

  const openFlags = flags.filter(f => f.status === 'open')
  const closedFlags = flags.filter(f => f.status !== 'open')

  const renderFlag = (flag: ArgumentMapFlagRow) => {
    const draft = drafts[flag.id] ?? flag.curator_response ?? ''
    const dirty = draft !== (flag.curator_response ?? '')

    return (
      <div key={flag.id} className="bg-white border border-stone-200 rounded-xl p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Badge variant={statusVariant[flag.status] ?? 'stone'}>{flag.status}</Badge>
              <Badge variant={issueTypeVariant[flag.issue_type] ?? 'stone'}>{flag.issue_type}</Badge>
              {flag.text && (
                <span className="text-xs text-stone-400 font-devanagari">{flag.text.title_transliterated}</span>
              )}
              {flag.passage?.section_name && (
                <span className="text-xs text-stone-400">
                  §{flag.passage.sequence_order} {flag.passage.section_name}
                </span>
              )}
            </div>
            {flag.passage && (
              <p className="text-xs text-stone-400 font-devanagari truncate mb-1">
                {flag.passage.mula_text.slice(0, 80)}…
              </p>
            )}
            <p className="text-sm text-stone-700">{flag.description}</p>
            <p className="text-xs text-stone-400 mt-1">
              {new Date(flag.created_at).toLocaleDateString()}
            </p>
          </div>

          {flag.status === 'open' && (
            <div className="flex gap-1.5 shrink-0">
              <button
                onClick={() => updateStatus(flag.id, 'resolved')}
                disabled={updating === flag.id}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-800 border border-emerald-200 hover:border-emerald-400 px-2.5 py-1 rounded-lg disabled:opacity-50"
              >
                Resolve
              </button>
              <button
                onClick={() => updateStatus(flag.id, 'dismissed')}
                disabled={updating === flag.id}
                className="text-xs font-medium text-stone-500 hover:text-stone-700 border border-stone-200 px-2.5 py-1 rounded-lg disabled:opacity-50"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>

        {/* Curator response -- independent of status, so a curator can ask a
            clarifying question without closing the flag, or add a note after
            resolving */}
        <div className="mt-3 pt-3 border-t border-stone-100">
          <label className="block text-xs font-medium text-stone-500 mb-1">
            Response to reporter {flag.user_id ? '' : '(anonymous -- not visible to anyone)'}
          </label>
          <textarea
            value={draft}
            onChange={e => setDrafts(prev => ({ ...prev, [flag.id]: e.target.value }))}
            rows={2}
            placeholder="Fixed, or a clarifying question for the reporter…"
            className="w-full text-sm border border-stone-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-saffron-400 resize-y"
          />
          {dirty && (
            <button
              onClick={() => saveResponse(flag.id)}
              disabled={updating === flag.id}
              className="mt-1.5 text-xs font-medium text-saffron-700 hover:text-saffron-900 border border-saffron-200 hover:border-saffron-400 px-2.5 py-1 rounded-lg disabled:opacity-50"
            >
              {updating === flag.id ? 'Saving…' : 'Save response'}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-stone-700 mb-3">
          Open ({openFlags.length})
        </h3>
        {openFlags.length === 0 ? (
          <p className="text-sm text-stone-400 italic">No open argument map flags.</p>
        ) : (
          <div className="space-y-2">{openFlags.map(renderFlag)}</div>
        )}
      </div>

      {closedFlags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-stone-500 mb-3">
            Resolved / Dismissed ({closedFlags.length})
          </h3>
          <div className="space-y-2">{closedFlags.map(renderFlag)}</div>
        </div>
      )}
    </div>
  )
}
