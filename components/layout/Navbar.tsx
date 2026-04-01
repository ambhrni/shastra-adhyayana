'use client'

import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/types/database'

interface TextNavItem {
  id: string
  title_transliterated: string
  firstPassageId: string | null
}

interface NavbarProps {
  displayName: string | null
  role: UserRole | null
  texts: TextNavItem[]
}

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

const linkClass = (active: boolean) =>
  `px-3 py-1.5 rounded-md text-sm transition-colors ${
    active
      ? 'bg-stone-700 text-white'
      : 'text-stone-300 hover:text-white hover:bg-stone-800'
  }`

export default function Navbar({ displayName, role, texts }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      setDropdownOpen(false)
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
        setDropdownOpen(true)
      } catch {
        setResults({ passages: [], chunks: [], nyaya: [] })
        setDropdownOpen(true)
      } finally {
        setLoading(false)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [query])

  // Close on Escape or click outside
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false)
        setQuery('')
      }
    }
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    document.addEventListener('mousedown', handleClick)
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  const navigate = useCallback((textId: string, passageId: string) => {
    router.push(`/study/${textId}/${passageId}`)
    setDropdownOpen(false)
    setQuery('')
  }, [router])

  const pathParts = pathname.split('/')
  const onStudyOrPariksha = pathname.startsWith('/study/') || pathname.startsWith('/pariksha/')
  const textId = onStudyOrPariksha ? pathParts[2] : null

  const hasResults = results && (
    results.passages.length > 0 || results.chunks.length > 0 || results.nyaya.length > 0
  )
  const isEmpty = results && !hasResults

  return (
    <nav className="h-14 bg-stone-900 text-white flex items-center px-6 gap-4 shrink-0">
      {/* Brand */}
      <Link href="/" className="font-semibold tracking-tight text-amber-400 shrink-0 mr-2">
        Tattvasudhā
      </Link>

      {/* Nav groups */}
      <div className="flex items-center gap-1 flex-1 min-w-0">

        {/* Group 1: texts, Parīkṣā, Dashboard */}
        {texts.map(text => {
          const href = text.firstPassageId
            ? `/study/${text.id}/${text.firstPassageId}`
            : '#'
          const active =
            pathname.startsWith(`/study/${text.id}`) ||
            pathname.startsWith(`/pariksha/${text.id}`)
          return (
            <Link key={text.id} href={href} className={linkClass(active)}>
              {text.title_transliterated}
            </Link>
          )
        })}

        {textId && (
          <Link
            href={`/pariksha/${textId}`}
            className={linkClass(pathname.startsWith(`/pariksha/${textId}`))}
          >
            Parīkṣā
          </Link>
        )}

        {displayName && (
          <Link href="/dashboard" className={linkClass(pathname === '/dashboard')}>
            Dashboard
          </Link>
        )}

        {role === 'curator' || role === 'admin' ? (
          <Link href="/curator" className={linkClass(pathname.startsWith('/curator'))}>
            Curator
          </Link>
        ) : null}

        {/* Divider */}
        {(texts.length > 0 || displayName) && (
          <div className="w-px h-5 bg-stone-600 mx-2 shrink-0" />
        )}

        {/* Group 2: NotebookLMs, About */}
        <Link href="/notebooks" className={linkClass(pathname === '/notebooks')}>
          NotebookLMs
        </Link>
        <Link href="/about" className={linkClass(pathname === '/about')}>
          About
        </Link>
      </div>

      {/* Inline Search */}
      <div ref={containerRef} className="relative hidden md:block shrink-0">
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search vādāvalī, reference texts, and nyāya concepts"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-80 bg-stone-800 border border-stone-700 rounded-lg text-stone-300 text-sm placeholder-stone-500 pl-8 pr-8 py-1.5 focus:border-saffron-600 focus:outline-none transition-colors"
          />
          {loading && (
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
        </div>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute top-full mt-1 right-0 w-[480px] bg-stone-900 border border-stone-700 rounded-lg shadow-xl max-h-[400px] overflow-y-auto z-50">
            {isEmpty && (
              <div className="py-8 text-center text-sm text-stone-400">No results found</div>
            )}

            {results && results.passages.length > 0 && (
              <div className="px-3 py-2.5">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">Passages</p>
                <div className="space-y-0.5">
                  {results.passages.map(p => (
                    <button
                      key={p.id}
                      onClick={() => navigate(p.textId, p.id)}
                      className="w-full text-left px-2.5 py-2 rounded-md hover:bg-stone-800 transition-colors"
                    >
                      <div className="text-xs font-medium text-saffron-500 mb-0.5">
                        {p.sectionName ?? 'Passage'}
                      </div>
                      <div className="text-xs text-stone-400 line-clamp-2 font-mono leading-relaxed">
                        {p.mulaPreview}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {results && results.nyaya.length > 0 && (
              <div className="px-3 py-2.5 border-t border-stone-800">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">Nyāya Concepts</p>
                <div className="space-y-0.5">
                  {results.nyaya.map(n => (
                    <div key={n.id} className="px-2.5 py-2">
                      <div className="text-xs font-medium text-stone-300 mb-0.5">{n.termSanskrit}</div>
                      <div className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{n.definition}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results && results.chunks.length > 0 && (
              <div className="px-3 py-2.5 border-t border-stone-800">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">Reference Texts</p>
                <div className="space-y-0.5">
                  {results.chunks.map(c => (
                    <div key={c.id} className="px-2.5 py-2">
                      <div className="text-xs font-medium text-stone-400 mb-0.5">{c.sectionLabel}</div>
                      <div className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{c.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User / auth */}
      <div className="flex items-center gap-3 shrink-0">
        {displayName ? (
          <>
            <span className="text-sm text-stone-400">{displayName}</span>
            <button
              onClick={handleSignOut}
              className="text-sm text-stone-400 hover:text-white transition-colors"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-stone-300 hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="text-sm bg-saffron-600 hover:bg-saffron-700 text-white px-3 py-1.5 rounded-md transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
