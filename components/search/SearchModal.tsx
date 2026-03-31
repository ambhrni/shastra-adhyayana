'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface PassageResult {
  id: string
  textId: string
  sectionName: string | null
  mulaPreview: string
  similarity: number
}

interface ChunkResult {
  id: string
  sectionLabel: string
  content: string
  similarity: number
}

interface NyayaResult {
  id: string
  termSanskrit: string
  definition: string
  similarity: number
}

interface SearchResults {
  passages: PassageResult[]
  chunks: ChunkResult[]
  nyaya: NyayaResult[]
}

interface SearchModalProps {
  onClose: () => void
}

export default function SearchModal({ onClose }: SearchModalProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      return
    }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query }),
        })
        const data = await res.json()
        setResults(data)
      } catch {
        setResults({ passages: [], chunks: [], nyaya: [] })
      } finally {
        setLoading(false)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [query])

  const hasResults = results && (
    results.passages.length > 0 || results.chunks.length > 0 || results.nyaya.length > 0
  )
  const isEmpty = results && !hasResults

  const navigate = useCallback((textId: string, passageId: string) => {
    router.push(`/study/${textId}/${passageId}`)
    onClose()
  }, [router, onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-200">
          <svg className="w-5 h-5 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search passages, concepts, reference texts…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 text-sm text-stone-900 placeholder-stone-400 outline-none bg-transparent"
          />
          {loading && (
            <svg className="w-4 h-4 text-stone-400 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Results */}
        {(hasResults || isEmpty) && (
          <div className="max-h-[60vh] overflow-y-auto divide-y divide-stone-100">
            {isEmpty && (
              <div className="py-10 text-center text-sm text-stone-400">No results found</div>
            )}

            {results!.passages.length > 0 && (
              <div className="px-4 py-3">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Passages</p>
                <div className="space-y-1">
                  {results!.passages.map(p => (
                    <button
                      key={p.id}
                      onClick={() => navigate(p.textId, p.id)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      <div className="text-xs font-medium text-saffron-700 mb-0.5">
                        {p.sectionName ?? 'Passage'}
                      </div>
                      <div className="text-xs text-stone-500 line-clamp-2 font-mono leading-relaxed">
                        {p.mulaPreview}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results!.chunks.length > 0 && (
              <div className="px-4 py-3">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Reference Texts</p>
                <div className="space-y-1">
                  {results!.chunks.map(c => (
                    <div key={c.id} className="px-3 py-2">
                      <div className="text-xs font-medium text-stone-600 mb-0.5">{c.sectionLabel}</div>
                      <div className="text-xs text-stone-500 line-clamp-3 leading-relaxed">{c.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results!.nyaya.length > 0 && (
              <div className="px-4 py-3">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">Nyāya Concepts</p>
                <div className="space-y-1">
                  {results!.nyaya.map(n => (
                    <div key={n.id} className="px-3 py-2">
                      <div className="text-xs font-medium text-stone-700 mb-0.5">{n.termSanskrit}</div>
                      <div className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{n.definition}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!query.trim() && (
          <div className="py-8 text-center text-sm text-stone-400">
            Type to search across vādāvalī, reference texts, and nyāya concepts
          </div>
        )}
      </div>
    </div>
  )
}
