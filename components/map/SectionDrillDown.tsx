'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import PassageChain, { type PassageRow } from './PassageChain'

// ── Types ─────────────────────────────────────────────────────────────────────

type ArgumentType = 'lakshanam' | 'pramanam' | 'anumanam' | 'siddhanta' | 'opening_closing'

interface Props {
  textId: string
  sectionNumber: number
  sectionName: string | null
  argumentType: ArgumentType
  isCurator?: boolean
}

// ── Argument type badge styles ─────────────────────────────────────────────────

const ARG_TYPE_BADGE: Record<ArgumentType, string> = {
  lakshanam:       'bg-orange-100 text-orange-700 border border-orange-200',
  pramanam:        'bg-blue-100 text-blue-700 border border-blue-200',
  anumanam:        'bg-red-100 text-red-700 border border-red-200',
  siddhanta:       'bg-green-100 text-green-700 border border-green-200',
  opening_closing: 'bg-stone-100 text-stone-600 border border-stone-200',
}

const ARG_TYPE_LABEL: Record<ArgumentType, string> = {
  lakshanam:       'Lakṣaṇam',
  pramanam:        'Pramāṇam',
  anumanam:        'Anumānam',
  siddhanta:       'Siddhānta',
  opening_closing: 'Opening / Closing',
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function SectionDrillDown({ textId, sectionNumber, sectionName, argumentType, isCurator }: Props) {
  const [passages, setPassages] = useState<PassageRow[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setPassages([])
      const supabase = createClient()
      const { data } = await supabase
        .from('passages')
        .select('id, sequence_order, section_name, mula_text')
        .eq('text_id', textId)
        .eq('section_number', sectionNumber)
        .eq('is_approved', true)
        .order('sequence_order')
      if (!cancelled) {
        setPassages(data ?? [])
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [textId, sectionNumber])

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-7 pb-5 border-b border-stone-100">
        <span className="text-2xl font-bold text-stone-800">§{sectionNumber}</span>
        {sectionName && (
          <span className="font-devanagari text-lg text-stone-700">{sectionName}</span>
        )}
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${ARG_TYPE_BADGE[argumentType]}`}>
          {ARG_TYPE_LABEL[argumentType]}
        </span>
        {!loading && (
          <span className="text-xs text-stone-400 ml-auto">
            {passages.length} passage{passages.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Passage chain */}
      {loading ? (
        <p className="text-sm text-stone-400">Loading passages…</p>
      ) : passages.length === 0 ? (
        <p className="text-sm text-stone-400 italic">No approved passages in this section.</p>
      ) : (
        <PassageChain textId={textId} passages={passages} isCurator={isCurator} />
      )}
    </div>
  )
}
