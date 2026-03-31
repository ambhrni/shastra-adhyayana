'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/types/database'
import SearchModal from '@/components/search/SearchModal'

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

const linkClass = (active: boolean) =>
  `px-3 py-1.5 rounded-md text-sm transition-colors ${
    active
      ? 'bg-stone-700 text-white'
      : 'text-stone-300 hover:text-white hover:bg-stone-800'
  }`

export default function Navbar({ displayName, role, texts }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const pathParts = pathname.split('/')
  const onStudyOrPariksha = pathname.startsWith('/study/') || pathname.startsWith('/pariksha/')
  const textId = onStudyOrPariksha ? pathParts[2] : null

  return (
    <>
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

      {/* Search */}
      <button
        onClick={() => setSearchOpen(true)}
        title="Search"
        className="text-stone-400 hover:text-white transition-colors shrink-0"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </button>

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
    {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  )
}
