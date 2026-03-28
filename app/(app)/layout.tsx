import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('user_profiles').select('display_name, role').eq('id', user.id).single()
    : { data: null }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar
        displayName={profile?.display_name ?? user?.email ?? null}
        role={profile?.role ?? null}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <footer className="shrink-0 border-t border-stone-200 bg-stone-50 px-6 py-2 flex items-center justify-between text-xs text-stone-400">
        <span>© 2025 Narayanan Venkataraman. Platform and curation rights reserved. Sanskrit source texts are in the public domain.</span>
        <span className="hidden md:block font-devanagari">तत्त्वसुधा — A jñānayajña for mokṣasādhana</span>
        <Link href="/about" className="hover:text-stone-600 transition-colors shrink-0">About</Link>
      </footer>
    </div>
  )
}
