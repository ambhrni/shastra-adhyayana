'use client'

import { useState } from 'react'
import type { ProgressStatus } from '@/types/database'

interface ProgressControlsProps {
  passageId: string
  textId: string
  initialStatus: ProgressStatus
}

const nextAction: Partial<Record<ProgressStatus, { label: string; next: ProgressStatus }>> = {
  studied:   { label: 'Mark as reviewed',  next: 'reviewed' },
  reviewed:  { label: 'Mark as mastered',  next: 'mastered' },
}

const statusLabel: Record<ProgressStatus, string> = {
  not_started: 'Not started',
  studied:     'Studied',
  reviewed:    'Reviewed',
  mastered:    'Mastered',
}

const statusColor: Record<ProgressStatus, string> = {
  not_started: 'text-stone-400',
  studied:     'text-blue-600',
  reviewed:    'text-amber-600',
  mastered:    'text-emerald-600',
}

export default function ProgressControls({ passageId, textId, initialStatus }: ProgressControlsProps) {
  const [status, setStatus] = useState<ProgressStatus>(initialStatus)
  const [loading, setLoading] = useState(false)

  const action = nextAction[status]

  async function advance() {
    if (!action) return
    setLoading(true)
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passage_id: passageId, text_id: textId, status: action.next }),
    })
    if (res.ok) setStatus(action.next)
    setLoading(false)
  }

  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs font-medium ${statusColor[status]}`}>
        ● {statusLabel[status]}
      </span>

      {action && (
        <button
          onClick={advance}
          disabled={loading}
          className="text-xs font-medium text-saffron-600 hover:text-saffron-800 disabled:opacity-50 border border-saffron-300 hover:border-saffron-500 px-3 py-1.5 rounded-lg transition-colors"
        >
          {loading ? '…' : action.label}
        </button>
      )}

      {status === 'mastered' && (
        <span className="text-xs text-emerald-600 font-medium">✓ Mastered</span>
      )}
    </div>
  )
}
