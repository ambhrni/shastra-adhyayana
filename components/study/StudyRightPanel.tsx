'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { Passage, Commentary, NyayaConcept, PassageNote, UserProgress, Commentator } from '@/types/database'
import LogicalRoleBadge from './LogicalRoleBadge'
import NyayaPanel from './NyayaPanel'
import PassageNotesPanel from './PassageNotesPanel'
import ProgressControls from './ProgressControls'
import FlagErrorModal from './FlagErrorModal'
import TutorSidebar from '@/components/tutor/TutorSidebar'
import Link from 'next/link'

interface NavPassage {
  id: string
  section_number: number | null
  section_name: string | null
  sequence_order: number
}

interface RelatedPassage {
  id: string
  textId: string
  sectionName: string | null
  mulaPreview: string
}

interface StudyRightPanelProps {
  passage: Passage
  commentaries: Commentary[]
  nyayaConcepts: NyayaConcept[]
  notes: PassageNote[]
  progress: UserProgress | null
  prevPassageId: string | null
  nextPassageId: string | null
  textId: string
  commentators: Commentator[]
  allPassages: NavPassage[]
  isLoggedIn: boolean
  relatedPassages?: RelatedPassage[]
}

export default function StudyRightPanel({
  passage, commentaries, nyayaConcepts, notes,
  progress, prevPassageId, nextPassageId, textId, commentators, allPassages, isLoggedIn,
  relatedPassages,
}: StudyRightPanelProps) {
  const router = useRouter()
  const [tutorOpen, setTutorOpen] = useState(false)
  const [flagOpen, setFlagOpen] = useState(false)
  const [relatedOpen, setRelatedOpen] = useState(true)
  const [currentStatus, setCurrentStatus] = useState(progress?.status ?? 'not_started')

  // Derive ordered sections and per-section passage lists from allPassages
  const sections = useMemo(() => {
    const map = new Map<number, { sectionNumber: number; sectionName: string | null; passages: NavPassage[] }>()
    for (const p of allPassages) {
      const key = p.section_number ?? 0
      if (!map.has(key)) map.set(key, { sectionNumber: key, sectionName: p.section_name, passages: [] })
      map.get(key)!.passages.push(p)
    }
    return Array.from(map.values())
  }, [allPassages])

  const currentSection = sections.find(s => s.sectionNumber === (passage.section_number ?? 0))

  // Auto-mark as studied on first visit (logged-in users only)
  useEffect(() => {
    if (!isLoggedIn) return
    if (!progress || progress.status === 'not_started') {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passage_id: passage.id,
          text_id: textId,
          status: 'studied',
        }),
      }).then(() => setCurrentStatus('studied'))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* Right panel */}
      <div className="h-full flex flex-col overflow-hidden">
        {/* Top toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-stone-50 shrink-0">
          {isLoggedIn ? (
            <ProgressControls
              passageId={passage.id}
              textId={textId}
              initialStatus={currentStatus}
            />
          ) : (
            <Link
              href="/login"
              className="text-xs text-stone-400 hover:text-saffron-600 transition-colors"
            >
              Login to track progress
            </Link>
          )}
          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <button
                onClick={() => setFlagOpen(true)}
                title="Flag an OCR error"
                className="text-stone-400 hover:text-amber-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                </svg>
              </button>
            )}
            {isLoggedIn ? (
              <button
                onClick={() => setTutorOpen(o => !o)}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                  tutorOpen
                    ? 'bg-saffron-600 text-white border-saffron-600'
                    : 'text-saffron-600 border-saffron-300 hover:bg-saffron-50'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                {tutorOpen ? 'Close tutor' : 'Ask the tutor'}
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border text-saffron-600 border-saffron-300 hover:bg-saffron-50 transition-colors"
              >
                Login to ask questions
              </Link>
            )}
          </div>
        </div>

        {/* Section dropdown + passage pills */}
        {sections.length > 0 && (
          <div className="shrink-0 border-b border-stone-200 bg-white px-4 py-2 space-y-2">
            {/* Section dropdown */}
            <select
              value={passage.section_number ?? 0}
              onChange={e => {
                const sec = sections.find(s => s.sectionNumber === Number(e.target.value))
                if (sec?.passages[0]) router.push(`/study/${textId}/${sec.passages[0].id}`)
              }}
              className="w-full text-xs border border-stone-200 rounded-lg px-2 py-1.5 bg-stone-50 text-stone-700 focus:outline-none focus:ring-2 focus:ring-saffron-500"
            >
              {sections.map(s => (
                <option key={s.sectionNumber} value={s.sectionNumber}>
                  {s.sectionName ?? `Section ${s.sectionNumber}`}
                </option>
              ))}
            </select>

            {/* Passage pills for current section */}
            {currentSection && currentSection.passages.length > 1 && (
              <div className="flex flex-wrap gap-1">
                {currentSection.passages.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => router.push(`/study/${textId}/${p.id}`)}
                    className={`w-7 h-7 text-xs rounded-md font-medium transition-colors ${
                      p.id === passage.id
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
        )}

        {/* Panel content */}
        {tutorOpen ? (
          <TutorSidebar passage={passage} commentaries={commentaries} />
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Logical role */}
            {passage.logical_argument_type && (
              <div>
                <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                  Logical Role
                </h3>
                <LogicalRoleBadge type={passage.logical_argument_type} />
                {passage.logical_argument_type.description && (
                  <p className="mt-1.5 text-xs text-stone-500 leading-relaxed">
                    {passage.logical_argument_type.description}
                  </p>
                )}
              </div>
            )}

            <NyayaPanel concepts={nyayaConcepts} />
            <PassageNotesPanel notes={notes} />

            {relatedPassages && relatedPassages.length > 0 && (
              <div>
                <button
                  onClick={() => setRelatedOpen(o => !o)}
                  className="flex items-center justify-between w-full text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2"
                >
                  Related Passages
                  <svg
                    className={`w-3.5 h-3.5 transition-transform ${relatedOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {relatedOpen && (
                  <div className="space-y-1.5">
                    {relatedPassages.map(rp => (
                      <Link
                        key={rp.id}
                        href={`/study/${rp.textId}/${rp.id}`}
                        className="block px-3 py-2 rounded-lg bg-stone-50 hover:bg-stone-100 transition-colors"
                      >
                        <div className="text-xs font-medium text-saffron-700 mb-0.5">
                          {rp.sectionName ?? 'Passage'}
                        </div>
                        <div className="text-xs text-stone-500 font-mono leading-relaxed line-clamp-2">
                          {rp.mulaPreview}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Passage navigation */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3 border-t border-stone-200 bg-stone-50">
          {prevPassageId ? (
            <Link
              href={`/study/${textId}/${prevPassageId}`}
              className="flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Previous
            </Link>
          ) : <div />}

          <Link
            href={`/pariksha/${textId}`}
            className="flex items-center gap-1 text-xs font-medium text-saffron-600 hover:text-saffron-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
            Parīkṣā
          </Link>

          {nextPassageId ? (
            <Link
              href={`/study/${textId}/${nextPassageId}`}
              className="flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ) : (
            <span className="text-xs text-stone-400">End of text</span>
          )}
        </div>
      </div>

      {flagOpen && (
        <FlagErrorModal
          passageId={passage.id}
          commentators={commentators}
          onClose={() => setFlagOpen(false)}
        />
      )}
    </>
  )
}
