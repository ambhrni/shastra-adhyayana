'use client'

import { useState, useEffect } from 'react'
import type { Passage, Commentary, NyayaConcept, PassageNote, UserProgress, Commentator } from '@/types/database'
import LogicalRoleBadge from './LogicalRoleBadge'
import NyayaPanel from './NyayaPanel'
import PassageNotesPanel from './PassageNotesPanel'
import ProgressControls from './ProgressControls'
import FlagErrorModal from './FlagErrorModal'
import TutorSidebar from '@/components/tutor/TutorSidebar'
import Link from 'next/link'

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
}

export default function StudyRightPanel({
  passage, commentaries, nyayaConcepts, notes,
  progress, prevPassageId, nextPassageId, textId, commentators
}: StudyRightPanelProps) {
  const [tutorOpen, setTutorOpen] = useState(false)
  const [flagOpen, setFlagOpen] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(progress?.status ?? 'not_started')

  // Auto-mark as studied on first visit
  useEffect(() => {
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
          <ProgressControls
            passageId={passage.id}
            textId={textId}
            initialStatus={currentStatus}
          />
          <div className="flex items-center gap-2">
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
          </div>
        </div>

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
