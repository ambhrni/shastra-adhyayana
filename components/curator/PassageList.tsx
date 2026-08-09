'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Passage } from '@/types/database'
import Badge from '@/components/ui/Badge'
import { stripPassageMarkup } from '@/lib/render-passage-text'

interface PassageListProps {
  passages: (Passage & { text_id: string })[]
  textId: string
}

export default function PassageList({ passages: initial, textId }: PassageListProps) {
  const [passages, setPassages] = useState(initial)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')
  const [bulkApproving, setBulkApproving] = useState(false)

  async function toggleApproval(passageId: string, currentApproved: boolean) {
    const supabase = createClient()
    const nextApproved = !currentApproved
    // commentaries have their OWN separate is_approved flag -- approving a
    // passage alone leaves its commentary invisible to non-curator contexts
    // (e.g. the AI Tutor, which unconditionally filters is_approved=true with
    // no curator bypass). Keep passage + commentary approval in sync as one
    // action, matching how a curator actually thinks about "approving a passage".
    await Promise.all([
      supabase.from('passages').update({ is_approved: nextApproved }).eq('id', passageId),
      supabase.from('commentaries').update({ is_approved: nextApproved }).eq('passage_id', passageId),
    ])

    setPassages(prev =>
      prev.map(p => p.id === passageId ? { ...p, is_approved: nextApproved } : p)
    )
  }

  const pendingCount = passages.filter(p => !p.is_approved).length

  async function approveAllPending() {
    if (pendingCount === 0) return
    const confirmed = window.confirm(
      `Approve all ${pendingCount} pending passage(s) AND their commentaries for this text? This cannot be bulk-undone -- you'd have to unapprove them one at a time.`
    )
    if (!confirmed) return

    setBulkApproving(true)
    const supabase = createClient()
    const pendingIds = passages.filter(p => !p.is_approved).map(p => p.id)

    const [{ error: passageErr }, { error: commentaryErr }] = await Promise.all([
      supabase.from('passages').update({ is_approved: true }).eq('text_id', textId).eq('is_approved', false),
      supabase.from('commentaries').update({ is_approved: true }).in('passage_id', pendingIds),
    ])
    setBulkApproving(false)

    if (passageErr || commentaryErr) {
      alert(`Bulk approve failed: ${passageErr?.message ?? commentaryErr?.message}`)
      return
    }
    setPassages(prev => prev.map(p => ({ ...p, is_approved: true })))
  }

  const filtered = passages.filter(p => {
    if (filter === 'pending') return !p.is_approved
    if (filter === 'approved') return p.is_approved
    return true
  })

  return (
    <div>
      {/* Filter tabs + bulk approve */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex gap-1">
          {(['all', 'pending', 'approved'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-stone-800 text-white'
                  : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'
              }`}
            >
              {f}
              <span className="ml-1.5 text-xs opacity-60">
                ({f === 'all' ? passages.length : passages.filter(p => f === 'approved' ? p.is_approved : !p.is_approved).length})
              </span>
            </button>
          ))}
        </div>
        {pendingCount > 0 && (
          <button
            onClick={approveAllPending}
            disabled={bulkApproving}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {bulkApproving ? 'Approving…' : `Approve All Pending (${pendingCount})`}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {filtered.map(passage => (
          <div key={passage.id} className="bg-white border border-stone-200 rounded-xl p-4 flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-stone-400">
                  §{passage.section_number ?? '—'}{passage.subsection_number ? `.${passage.subsection_number}` : ''}
                </span>
                <Badge variant={passage.is_approved ? 'green' : 'amber'}>
                  {passage.is_approved ? 'Approved' : 'Pending'}
                </Badge>
              </div>
              <p className="font-devanagari text-stone-800 text-sm leading-relaxed truncate">
                {stripPassageMarkup(passage.mula_text).slice(0, 120)}…
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/study/${textId}/${passage.id}`}
                className="text-xs text-saffron-600 hover:underline font-medium"
              >
                Edit
              </Link>
              <button
                onClick={() => toggleApproval(passage.id, passage.is_approved)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                  passage.is_approved
                    ? 'text-stone-500 border-stone-200 hover:bg-stone-50'
                    : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                {passage.is_approved ? 'Unapprove' : 'Approve'}
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-sm text-stone-400 italic py-4">No passages in this category.</p>
        )}
      </div>
    </div>
  )
}
