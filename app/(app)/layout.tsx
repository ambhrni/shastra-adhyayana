import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Link from 'next/link'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()

  const [
    { data: { user } },
    { data: textsData },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from('texts')
      .select('id, title_transliterated')
      .eq('is_published', true)
      .order('created_at'),
  ])

  const { data: profile } = user
    ? await supabase.from('user_profiles').select('display_name, role').eq('id', user.id).single()
    : { data: null }

  // Fetch first approved passage id for each text (for nav links)
  const texts = await Promise.all(
    (textsData ?? []).map(async (text) => {
      const { data: firstPassage } = await supabase
        .from('passages')
        .select('id')
        .eq('text_id', text.id)
        .eq('is_approved', true)
        .order('sequence_order')
        .limit(1)
        .single()
      return {
        id: text.id,
        title_transliterated: text.title_transliterated,
        firstPassageId: firstPassage?.id ?? null,
      }
    })
  )

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar
        displayName={profile?.display_name ?? user?.email ?? null}
        role={profile?.role ?? null}
        texts={texts}
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
