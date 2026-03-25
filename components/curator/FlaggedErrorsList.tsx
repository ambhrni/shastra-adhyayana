'use client'

import { useState } from 'react'
import type { FlaggedError, FlagStatus } from '@/types/database'
import Badge from '@/components/ui/Badge'

interface FlaggedErrorsListProps {
  flags: (FlaggedError & { passage?: { mula_text: string } | null; commentator?: { name: string } | null })[]
}

const statusVariant: Record<FlagStatus, 'amber' | 'green' | 'stone'> = {
  open:       'amber',
  resolved:   'green',
  dismissed:  'stone',
}

export default function FlaggedErrorsList({ flags: initialFlags }: FlaggedErrorsListProps) {
  const [flags, setFlags] = useState(initialFlags)
  const [updating, setUpdating] = useState<string | null>(null)

  async function updateStatus(flagId: string, status: FlagStatus) {
    setUpdating(flagId)
    await fetch('/api/flags', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flag_id: flagId, status }),
    })
    setFlags(prev => prev.map(f => f.id === flagId ? { ...f, status } : f))
    setUpdating(null)
  }

  const openFlags = flags.filter(f => f.status === 'open')
  const closedFlags = flags.filter(f => f.status !== 'open')

  const renderFlag = (flag: typeof flags[0]) => (
    <div key={flag.id} className="bg-white border border-stone-200 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={statusVariant[flag.status]}>{flag.status}</Badge>
            <span className="text-xs text-stone-400">
              {flag.commentator ? flag.commentator.name : 'Mūla text'}
            </span>
          </div>
          {flag.passage && (
            <p className="text-xs text-stone-400 font-devanagari truncate mb-1">
              {flag.passage.mula_text.slice(0, 80)}…
            </p>
          )}
          <p className="text-sm text-stone-700">{flag.description_of_error}</p>
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
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-stone-700 mb-3">
          Open ({openFlags.length})
        </h3>
        {openFlags.length === 0 ? (
          <p className="text-sm text-stone-400 italic">No open flags.</p>
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
