'use client'

import { useState } from 'react'
import type { Commentary } from '@/types/database'
import InlineEditor from './InlineEditor'
import { renderPassageText } from '@/lib/render-passage-text'

interface CommentaryTabsProps {
  commentaries: Commentary[]
  isCurator: boolean
}

// Matches mūla hook phrases of the form "[Sanskrit words]इति ।।"
// The capturing group is used with String.split so matched segments are
// included as alternating elements in the resulting array.
// Declared outside the component so the RegExp object is shared, but we
// always call it via split (not test/exec) so lastIndex is not mutated.
// This is a VADAVALI-specific fallback: that pipeline's commentary text has
// no explicit **bold** markers, so pratika-like hook phrases are detected by
// this ending-pattern heuristic instead. bhedojjivanam's pipeline DOES emit
// explicit **bold** for pratikas plus [^key] footnote refs -- for any text
// that actually contains a ** span, renderPassageText (which also handles
// footnote tooltips) is used instead, leaving vadavali's existing rendering
// completely unaffected.
const HOOK_RE = /([^\u0964\u0965]{1,50}?\u0907\u0924\u093F\s*(?:\u0964\u0964|\u0965))/g

function renderWithHooks(text: string): React.ReactNode {
  if (text.includes('**')) return renderPassageText(text)
  // split with a capturing group returns: [before, match, between, match, after, …]
  const parts = text.split(HOOK_RE)
  return parts.map((part, i) => {
    // Every odd-indexed element is a captured hook match
    if (i % 2 === 1) {
      return (
        <strong key={i} className="font-semibold text-stone-900">
          {part}
        </strong>
      )
    }
    return part
  })
}

export default function CommentaryTabs({ commentaries, isCurator }: CommentaryTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (commentaries.length === 0) return null

  // Clamp in case commentaries shrinks between renders
  const safeIndex = activeIndex < commentaries.length ? activeIndex : 0
  const active = commentaries[safeIndex]

  return (
    <div>
      <div className="flex gap-1 border-b border-stone-200 mb-4">
        {commentaries.map((c, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              safeIndex === i
                ? 'border-saffron-500 text-saffron-700'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            {(c as any).commentator?.name ?? `Commentary ${i + 1}`}
          </button>
        ))}
      </div>

      {active && (
        <div>
          {active.commentary_text ? (
            isCurator ? (
              <InlineEditor
                key={active.id}
                table="commentaries"
                field="commentary_text"
                recordId={active.id}
                initialValue={active.commentary_text}
                isDevanagari
                displayClassName="text-[18px] leading-relaxed whitespace-pre-line"
                renderDisplay={renderWithHooks}
              />
            ) : (
              <div className="text-[18px] text-stone-800 leading-relaxed font-devanagari whitespace-pre-line">
                {renderWithHooks(active.commentary_text)}
              </div>
            )
          ) : (
            <p className="text-sm text-stone-400 italic">No commentary available for this passage.</p>
          )}

          {active.commentary_transliterated && !isCurator && (
            <p className="mt-3 text-xs text-stone-400 italic leading-relaxed">
              {active.commentary_transliterated}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
