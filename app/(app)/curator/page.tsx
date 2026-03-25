import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PassageList from '@/components/curator/PassageList'
import FlaggedErrorsList from '@/components/curator/FlaggedErrorsList'

export default async function CuratorPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()

  if (!profile || !['curator', 'admin'].includes(profile.role)) {
    redirect('/')
  }

  // Fetch all texts (published or not, for admin)
  const { data: texts } = await supabase
    .from('texts').select('id, title, title_transliterated').order('created_at')

  // Fetch all passages with their text
  const { data: passages } = await supabase
    .from('passages')
    .select('*, text_id')
    .order('sequence_order')

  // Fetch all open flags with passage and commentator info
  const { data: flags } = await supabase
    .from('flagged_errors')
    .select('*, passage:passages(mula_text), commentator:commentators(name)')
    .order('created_at', { ascending: false })

  // Group passages by text
  const passagesByText: Record<string, typeof passages> = {}
  for (const p of passages ?? []) {
    if (!passagesByText[p.text_id]) passagesByText[p.text_id] = []
    passagesByText[p.text_id]!.push(p)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">Curator Portal</h1>
        <p className="text-stone-500 text-sm mt-1">Review passages, approve content, and resolve flagged errors.</p>
      </div>

      {/* Flagged errors */}
      <section>
        <h2 className="text-lg font-semibold text-stone-800 mb-4">
          Flagged Errors
          {flags && flags.filter(f => f.status === 'open').length > 0 && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
              {flags.filter(f => f.status === 'open').length} open
            </span>
          )}
        </h2>
        <FlaggedErrorsList flags={(flags ?? []) as any} />
      </section>

      {/* Passages per text */}
      {(texts ?? []).map(text => {
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

      {(texts ?? []).length === 0 && (
        <p className="text-stone-400 italic text-sm">No texts found. Add texts via the ingestion script.</p>
      )}
    </div>
  )
}
