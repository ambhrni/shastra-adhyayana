'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Passage } from '@/types/database'
import Badge from '@/components/ui/Badge'

interface PassageListProps {
  passages: (Passage & { text_id: string })[]
  textId: string
}

export default function PassageList({ passages: initial, textId }: PassageListProps) {
  const [passages, setPassages] = useState(initial)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')

  async function toggleApproval(passageId: string, currentApproved: boolean) {
    const supabase = createClient()
    await supabase.from('passages')
      .update({ is_approved: !currentApproved })
      .eq('id', passageId)

    setPassages(prev =>
      prev.map(p => p.id === passageId ? { ...p, is_approved: !currentApproved } : p)
    )
  }

  const filtered = passages.filter(p => {
    if (filter === 'pending') return !p.is_approved
    if (filter === 'approved') return p.is_approved
    return true
  })

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-1 mb-4">
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
                {passage.mula_text.slice(0, 120)}…
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
