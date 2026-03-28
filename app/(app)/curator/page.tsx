import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PassageList from '@/components/curator/PassageList'
import FlaggedErrorsList from '@/components/curator/FlaggedErrorsList'
import NotebooksAdmin from '@/components/curator/NotebooksAdmin'

interface Props {
  searchParams: { tab?: string }
}

export default async function CuratorPage({ searchParams }: Props) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()

  if (!profile || !['curator', 'admin'].includes(profile.role)) {
    redirect('/')
  }

  const isAdmin = profile.role === 'admin'
  const activeTab = searchParams.tab ?? 'passages'

  // Guard: non-admins can't access notebooks tab
  if (activeTab === 'notebooks' && !isAdmin) redirect('/curator')

  // ── Fetch data for active tab only ───────────────────────────────────────

  let texts: any[] = []
  let passagesByText: Record<string, any[]> = {}
  let flags: any[] = []
  let notebooks: any[] = []

  if (activeTab === 'passages') {
    const { data: textsData } = await supabase
      .from('texts').select('id, title, title_transliterated').order('created_at')
    const { data: passagesData } = await supabase
      .from('passages').select('*, text_id').order('sequence_order')

    texts = textsData ?? []
    for (const p of passagesData ?? []) {
      if (!passagesByText[p.text_id]) passagesByText[p.text_id] = []
      passagesByText[p.text_id]!.push(p)
    }
  }

  if (activeTab === 'flags') {
    const { data: flagsData } = await supabase
      .from('flagged_errors')
      .select('*, passage:passages(mula_text), commentator:commentators(name)')
      .order('created_at', { ascending: false })
    flags = flagsData ?? []
  }

  if (activeTab === 'notebooks' && isAdmin) {
    const { data: notebooksData } = await supabase
      .from('notebooks').select('*').order('display_order')
    notebooks = notebooksData ?? []
  }

  // ── Shared open-flag count for the Flags tab badge ────────────────────────
  const { count: openFlagCount } = await supabase
    .from('flagged_errors')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'open')

  // ── Tab definition ────────────────────────────────────────────────────────
  const tabs = [
    { id: 'passages', label: 'Passages', href: '/curator' },
    { id: 'flags', label: 'Flagged Errors', href: '/curator?tab=flags', badge: openFlagCount ?? 0 },
    ...(isAdmin ? [{ id: 'notebooks', label: 'Notebooks', href: '/curator?tab=notebooks', badge: 0 }] : []),
  ]

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Curator Portal</h1>
        <p className="text-stone-500 text-sm mt-1">
          Review passages, approve content, and resolve flagged errors.
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-1 border-b border-stone-200">
        {tabs.map(tab => (
          <Link
            key={tab.id}
            href={tab.href}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? 'border-saffron-600 text-saffron-700'
                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
            }`}
          >
            {tab.label}
            {tab.badge != null && tab.badge > 0 && (
              <span className="bg-amber-100 text-amber-800 text-xs font-medium px-1.5 py-0.5 rounded-full">
                {tab.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* ── Passages tab ── */}
      {activeTab === 'passages' && (
        <div className="space-y-10">
          {texts.map(text => {
            const textPassages = passagesByText[text.id] ?? []
            return (
              <section key={text.id}>
                <h2 className="text-lg font-semibold text-stone-800 mb-1">
                  <span className="font-devanagari">{text.title}</span>
                </h2>
                <p className="text-sm text-stone-400 mb-4">{text.title_transliterated}</p>
                <PassageList passages={textPassages as any} textId={text.id} />
              </section>
            )
          })}
          {texts.length === 0 && (
            <p className="text-stone-400 italic text-sm">
              No texts found. Add texts via the ingestion script.
            </p>
          )}
        </div>
      )}

      {/* ── Flagged Errors tab ── */}
      {activeTab === 'flags' && (
        <section>
          <FlaggedErrorsList flags={flags as any} />
        </section>
      )}

      {/* ── Notebooks tab (admin only) ── */}
      {activeTab === 'notebooks' && isAdmin && (
        <section>
          <NotebooksAdmin initialNotebooks={notebooks} />
        </section>
      )}
    </div>
  )
}
