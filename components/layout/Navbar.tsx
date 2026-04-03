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

const mobileLinkClass = (active: boolean) =>
  `flex items-center px-6 py-3 text-sm transition-colors ${
    active
      ? 'bg-stone-700 text-white'
      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
  }`

export default function Navbar({ displayName, role, texts }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Close mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Reset expanded item when query changes
  useEffect(() => { setExpandedId(null) }, [query])

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

  // Close search dropdown on Escape or click outside
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false)
        setQuery('')
        setMenuOpen(false)
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
    <nav className="h-14 bg-stone-900 text-white flex items-center px-4 gap-3 shrink-0 relative">
      {/* Brand */}
      <Link href="/" className="font-semibold tracking-tight text-amber-400 shrink-0 mr-2">
        Tattvasudhā
      </Link>

      {/* Centered auspicious marker */}
      <div className="absolute left-1/2 -translate-x-1/2 font-devanagari text-sm text-amber-400 pointer-events-none">
        ॥ श्रीः ॥
      </div>

      {/* Desktop nav groups — hidden on mobile */}
      <div className="hidden md:flex items-center gap-1 flex-1 min-w-0">
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

        <Link href="/notebooks" className={linkClass(pathname === '/notebooks')}>
          NotebookLMs
        </Link>
        <Link href="/about" className={linkClass(pathname === '/about')}>
          About
        </Link>
      </div>

      {/* Search — desktop only */}
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
                      onClick={() => p.textId ? navigate(p.textId, p.id) : undefined}
                      disabled={!p.textId}
                      className={`w-full text-left px-2.5 py-2 rounded-md transition-colors ${
                        p.textId
                          ? 'hover:bg-stone-800 cursor-pointer'
                          : 'opacity-40 cursor-not-allowed'
                      }`}
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
                    <div
                      key={n.id}
                      className="px-2.5 py-2 cursor-pointer hover:bg-stone-800 rounded-md transition-colors"
                      onClick={() => setExpandedId(expandedId === n.id ? null : n.id)}
                    >
                      <div className="text-xs font-medium text-stone-300 mb-0.5 flex items-center justify-between">
                        <span>{n.termSanskrit}</span>
                        <span className="text-stone-500 text-[10px]">{expandedId === n.id ? '▲' : '▼'}</span>
                      </div>
                      <div className={`text-xs text-stone-400 leading-relaxed ${
                        expandedId === n.id ? '' : 'line-clamp-2'
                      }`}>
                        {n.definition}
                      </div>
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
                    <div
                      key={c.id}
                      className="px-2.5 py-2 cursor-pointer hover:bg-stone-800 rounded-md transition-colors"
                      onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                    >
                      <div className="text-xs font-medium text-stone-400 mb-0.5 flex items-center justify-between">
                        <span>{c.sectionLabel}</span>
                        <span className="text-stone-500 text-[10px]">{expandedId === c.id ? '▲' : '▼'}</span>
                      </div>
                      <div className={`text-xs text-stone-500 leading-relaxed ${
                        expandedId === c.id ? '' : 'line-clamp-2'
                      }`}>
                        {c.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Auth + hamburger — pushed to right, always visible */}
      <div className="ml-auto flex items-center gap-3 shrink-0">
        {displayName ? (
          <>
            <span className="hidden md:inline text-sm text-stone-400 max-w-[120px] truncate">{displayName}</span>
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
              className="text-sm text-stone-300 hover:text-white transition-colors md:bg-saffron-600 md:hover:bg-saffron-700 md:text-white md:px-3 md:py-1.5 md:rounded-md"
            >
              Register
            </Link>
          </>
        )}

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden p-1 text-stone-300 hover:text-white transition-colors"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 top-14 z-40"
            onClick={() => setMenuOpen(false)}
          />
          {/* Menu panel */}
          <div className="md:hidden absolute top-14 left-0 right-0 bg-stone-900 border-t border-stone-700 shadow-xl z-50 py-2">
            {texts.map(text => {
              const href = text.firstPassageId
                ? `/study/${text.id}/${text.firstPassageId}`
                : '#'
              const active =
                pathname.startsWith(`/study/${text.id}`) ||
                pathname.startsWith(`/pariksha/${text.id}`)
              return (
                <Link key={text.id} href={href} className={mobileLinkClass(active)}>
                  {text.title_transliterated}
                </Link>
              )
            })}

            {textId && (
              <Link
                href={`/pariksha/${textId}`}
                className={mobileLinkClass(pathname.startsWith(`/pariksha/${textId}`))}
              >
                Parīkṣā
              </Link>
            )}

            {displayName && (
              <Link href="/dashboard" className={mobileLinkClass(pathname === '/dashboard')}>
                Dashboard
              </Link>
            )}

            {(role === 'curator' || role === 'admin') && (
              <Link href="/curator" className={mobileLinkClass(pathname.startsWith('/curator'))}>
                Curator
              </Link>
            )}

            <div className="h-px bg-stone-700 my-2 mx-6" />

            <Link href="/notebooks" className={mobileLinkClass(pathname === '/notebooks')}>
              NotebookLMs
            </Link>
            <Link href="/about" className={mobileLinkClass(pathname === '/about')}>
              About
            </Link>
          </div>
        </>
      )}
    </nav>
  )
}
