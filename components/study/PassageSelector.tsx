'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Commentator } from '@/types/database'
import FlagErrorModal from './FlagErrorModal'

interface NavPassage {
  id: string
  section_number: number | null
  section_name: string | null
  sequence_order: number
}

interface Props {
  allPassages: NavPassage[]
  passageId: string
  sectionNumber: number | null
  textId: string
  isLoggedIn: boolean
  commentators: Commentator[]
}

export default function PassageSelector({
  allPassages, passageId, sectionNumber, textId, isLoggedIn, commentators,
}: Props) {
  const router = useRouter()
  const [flagOpen, setFlagOpen] = useState(false)

  const sections = useMemo(() => {
    const map = new Map<number, { sectionNumber: number; sectionName: string | null; passages: NavPassage[] }>()
    for (const p of allPassages) {
      const key = p.section_number ?? 0
      if (!map.has(key)) map.set(key, { sectionNumber: key, sectionName: p.section_name, passages: [] })
      map.get(key)!.passages.push(p)
    }
    return Array.from(map.values())
  }, [allPassages])

  const currentSection = sections.find(s => s.sectionNumber === (sectionNumber ?? 0))

  if (sections.length === 0) return null

  return (
    <>
      {/* Course title + full map link */}
      <div className="shrink-0 flex items-center justify-between px-4 pt-3 pb-2 border-b border-stone-100 bg-white">
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
          Vādāvalī
        </span>
        <Link
          href={`/texts/${textId}/map`}
          className="inline-flex items-center gap-1.5 border border-saffron-600 text-saffron-700 hover:bg-saffron-50 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          Argument Map — Full
        </Link>
      </div>

      <div className="shrink-0 border-b border-stone-200 bg-white px-4 py-2 space-y-2">
        <div className="flex items-center gap-2">
          <select
            value={sectionNumber ?? 0}
            onChange={e => {
              const sec = sections.find(s => s.sectionNumber === Number(e.target.value))
              if (sec?.passages[0]) router.push(`/study/${textId}/${sec.passages[0].id}`)
            }}
            className="flex-1 text-xs border border-stone-200 rounded-lg px-2 py-1.5 bg-stone-50 text-stone-700 focus:outline-none focus:ring-2 focus:ring-saffron-500"
          >
            {sections.map(s => (
              <option key={s.sectionNumber} value={s.sectionNumber}>
                {s.sectionName ?? `Section ${s.sectionNumber}`}
              </option>
            ))}
          </select>
          {isLoggedIn && (
            <button
              onClick={() => setFlagOpen(true)}
              title="Flag an OCR error"
              className="shrink-0 text-stone-400 hover:text-amber-600 transition-colors p-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
              </svg>
            </button>
          )}
        </div>

        {currentSection && currentSection.passages.length > 1 && (
          <div className="flex flex-wrap gap-1">
            {currentSection.passages.map((p, i) => (
              <button
                key={p.id}
                onClick={() => router.push(`/study/${textId}/${p.id}`)}
                className={`w-7 h-7 text-xs rounded-md font-medium transition-colors ${
                  p.id === passageId
                    ? 'bg-saffron-600 text-white'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {flagOpen && (
        <FlagErrorModal
          passageId={passageId}
          commentators={commentators}
          onClose={() => setFlagOpen(false)}
        />
      )}
    </>
  )
}
