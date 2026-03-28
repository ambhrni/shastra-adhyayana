'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/types/database'

interface NavbarProps {
  displayName: string | null
  role: UserRole | null
}

export default function Navbar({ displayName, role }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Extract textId when on a study or parīkṣā page
  const pathParts = pathname.split('/')
  const textId = (pathname.startsWith('/study/') || pathname.startsWith('/pariksha/'))
    ? pathParts[2]
    : null

  const links = [
    { href: '/', label: 'Library', exact: true },
  ]

  if (displayName) {
    links.push({ href: '/dashboard', label: 'Dashboard', exact: true })
  }

  if (textId) {
    links.push({ href: `/pariksha/${textId}`, label: 'Parīkṣā', exact: false })
  }

  if (role === 'curator' || role === 'admin') {
    links.push({ href: '/curator', label: 'Curator', exact: true })
  }

  return (
    <nav className="h-14 bg-stone-900 text-white flex items-center px-6 gap-6 shrink-0">
      <Link href="/" className="font-semibold tracking-tight text-amber-400 mr-2">
        Tattvasudhā
      </Link>

      <div className="flex items-center gap-1 flex-1">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
              (link.exact ? pathname === link.href : pathname.startsWith(link.href))
                ? 'bg-stone-700 text-white'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
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
            <Link
              href="/login"
              className="text-sm text-stone-300 hover:text-white transition-colors"
            >
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
