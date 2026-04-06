'use client'

import { useState, useEffect } from 'react'
import type { Passage, Commentary, NyayaConcept, PassageNote, UserProgress } from '@/types/database'
import LogicalRoleBadge from './LogicalRoleBadge'
import NyayaPanel from './NyayaPanel'
import PassageNotesPanel from './PassageNotesPanel'
import ProgressControls from './ProgressControls'
import TutorSidebar from '@/components/tutor/TutorSidebar'
import PassageArgumentMap from './PassageArgumentMap'
import Link from 'next/link'

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
  isLoggedIn: boolean
  isCurator?: boolean
  relatedPassages?: RelatedPassage[]
}

type Mode = 'info' | 'tutor' | 'map'

export default function StudyRightPanel({
  passage, commentaries, nyayaConcepts, notes,
  progress, prevPassageId, nextPassageId, textId, isLoggedIn, isCurator,
  relatedPassages,
}: StudyRightPanelProps) {
  const [mode, setMode] = useState<Mode>('map')
  const [relatedOpen, setRelatedOpen] = useState(true)
  const [currentStatus, setCurrentStatus] = useState(progress?.status ?? 'not_started')

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
    <div className="h-full flex flex-col overflow-hidden">
      {/* Progress controls */}
      <div className="shrink-0 px-4 py-3 border-b border-stone-200 bg-stone-50">
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
      </div>

      {/* Three-tab mode switcher */}
      <div className="shrink-0 px-3 py-2 border-b border-stone-200 bg-stone-50">
        <div className="flex gap-1 bg-stone-200 rounded-lg p-1">
          <button
            onClick={() => setMode('map')}
            className={`flex-1 flex flex-col items-center py-2 px-1 rounded-md text-sm font-medium transition-colors leading-tight ${
              mode === 'map'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-stone-500 hover:bg-stone-300 cursor-pointer'
            }`}
          >
            <span>Argument Map</span>
            <span className={`text-xs ${mode === 'map' ? 'opacity-75' : 'opacity-60'}`}>Passage</span>
          </button>
          <button
            onClick={() => setMode('tutor')}
            className={`flex-1 flex flex-col items-center py-2 px-1 rounded-md text-sm font-medium transition-colors leading-tight ${
              mode === 'tutor'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-stone-500 hover:bg-stone-300 cursor-pointer'
            }`}
          >
            <span>AI Chat</span>
            <span className={`text-xs ${mode === 'tutor' ? 'opacity-75' : 'opacity-60'}`}>Tutor</span>
          </button>
          <button
            onClick={() => setMode('info')}
            className={`flex-1 flex flex-col items-center py-2 px-1 rounded-md text-sm font-medium transition-colors leading-tight ${
              mode === 'info'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-stone-500 hover:bg-stone-300 cursor-pointer'
            }`}
          >
            <span>Info</span>
            <span className={`text-xs ${mode === 'info' ? 'opacity-75' : 'opacity-60'}`}>Concepts</span>
          </button>
        </div>
      </div>

      {/* Panel content */}
      {mode === 'tutor' ? (
        <TutorSidebar passage={passage} commentaries={commentaries} />
      ) : mode === 'map' ? (
        <PassageArgumentMap passageId={passage.id} textId={textId} isLoggedIn={isLoggedIn} isCurator={isCurator} />
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
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
  )
}
