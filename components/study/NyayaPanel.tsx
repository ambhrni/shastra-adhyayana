'use client'

import { useState } from 'react'
import type { NyayaConcept } from '@/types/database'

const difficultyLabel = ['', 'Introductory', 'Basic', 'Intermediate', 'Advanced', 'Expert']
const difficultyColor = ['', 'text-emerald-600', 'text-blue-600', 'text-amber-600', 'text-orange-600', 'text-red-600']

export default function NyayaPanel({ concepts }: { concepts: NyayaConcept[] }) {
  const [open, setOpen] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  if (concepts.length === 0) return null

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 text-left"
      >
        <span className="text-sm font-semibold text-stone-700">
          Nyāya Concepts
          <span className="ml-2 text-xs font-normal text-stone-400">({concepts.length})</span>
        </span>
        <svg
          className={`w-4 h-4 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="divide-y divide-stone-100">
          {concepts.map(c => (
            <div key={c.id} className="px-4 py-3">
              <button
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                className="w-full text-left"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div>
                    <span className="font-devanagari text-base text-stone-900">{c.term_sanskrit}</span>
                    <span className="ml-2 text-xs text-stone-500 italic">{c.term_transliterated}</span>
                  </div>
                  {c.difficulty_level && (
                    <span className={`text-xs shrink-0 ${difficultyColor[c.difficulty_level]}`}>
                      {difficultyLabel[c.difficulty_level]}
                    </span>
                  )}
                </div>
                <p className="text-sm text-stone-600 mt-1 leading-relaxed">
                  {c.definition_english}
                </p>
              </button>

              {expanded === c.id && (
                <div className="mt-3 space-y-2 text-sm text-stone-600">
                  {c.definition_sanskrit && (
                    <p className="font-devanagari commentary-text">{c.definition_sanskrit}</p>
                  )}
                  {c.example_text && (
                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      <span className="text-xs font-medium text-amber-700 uppercase tracking-wide">Example</span>
                      <p className="mt-1">{c.example_text}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
