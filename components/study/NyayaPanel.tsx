'use client'

import { useState } from 'react'
import type { NyayaConcept } from '@/types/database'

const difficultyBadge = [
  '',
  'bg-green-100 text-green-700',   // 1
  'bg-green-100 text-green-700',   // 2
  'bg-amber-100 text-amber-700',   // 3
  'bg-red-100 text-red-700',       // 4
  'bg-red-100 text-red-700',       // 5
]

export default function NyayaPanel({ concepts }: { concepts: NyayaConcept[] }) {
  const [open, setOpen] = useState(false)
  const [expandedSkt, setExpandedSkt] = useState<Set<string>>(new Set())

  if (concepts.length === 0) return null

  const sorted = [...concepts].sort((a, b) => (a.difficulty_level ?? 0) - (b.difficulty_level ?? 0))

  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-stone-50 text-left"
      >
        <span className="flex items-center gap-2">
          <span className="font-devanagari text-sm font-semibold text-stone-700">न्यायसंकल्पाः</span>
          <span className="text-xs text-stone-400 font-normal">Nyāya Concepts</span>
          <span className="bg-stone-200 text-stone-600 text-xs font-medium px-1.5 py-0.5 rounded-full">
            {concepts.length}
          </span>
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
          {sorted.map(c => (
            <div key={c.id} className="px-4 py-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-devanagari text-base font-bold text-stone-900">{c.term_sanskrit}</span>
                  <span className="ml-2 text-xs text-stone-400 italic">{c.term_transliterated}</span>
                </div>
                {c.difficulty_level && (
                  <span className={`shrink-0 text-xs font-medium px-1.5 py-0.5 rounded-full ${difficultyBadge[c.difficulty_level]}`}>
                    {c.difficulty_level}
                  </span>
                )}
              </div>
              <p className="text-sm text-stone-600 mt-1 leading-relaxed">{c.definition_english}</p>
              {c.definition_sanskrit && (
                <button
                  onClick={() => setExpandedSkt(s => {
                    const next = new Set(s)
                    next.has(c.id) ? next.delete(c.id) : next.add(c.id)
                    return next
                  })}
                  className="mt-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {expandedSkt.has(c.id) ? 'Hide Sanskrit' : 'Show Sanskrit'}
                </button>
              )}
              {expandedSkt.has(c.id) && c.definition_sanskrit && (
                <p className="mt-2 font-devanagari text-sm text-stone-600 commentary-text leading-relaxed">
                  {c.definition_sanskrit}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
