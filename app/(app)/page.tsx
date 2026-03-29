import { createClient } from '@/lib/supabase/server'
import TextCard from '@/components/library/TextCard'
import NotebookCard from '@/components/notebooks/NotebookCard'

export default async function LibraryPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { data: profile },
    { data: texts },
    { data: notebooks },
  ] = await Promise.all([
    user
      ? supabase.from('user_profiles').select('display_name').eq('id', user.id).single()
      : Promise.resolve({ data: null }),
    supabase
      .from('texts')
      .select('id, title, title_transliterated, author, description, thumbnail_url, is_published, created_at')
      .eq('is_published', true)
      .order('created_at'),
    supabase
      .from('notebooks')
      .select('*')
      .eq('is_published', true)
      .order('display_order'),
  ])

  // Per-text: passage counts + progress + first/resume passage id
  const textData = await Promise.all(
    (texts ?? []).map(async (text) => {
      const { count: totalCount } = await supabase
        .from('passages')
        .select('*', { count: 'exact', head: true })
        .eq('text_id', text.id)
        .eq('is_approved', true)

      const { data: firstRows } = await supabase
        .from('passages')
        .select('id')
        .eq('text_id', text.id)
        .eq('is_approved', true)
        .order('sequence_order')
        .limit(1)
      const firstPassageId = firstRows?.[0]?.id ?? null

      if (!user) {
        return { text, progressPercent: null, firstUnfinishedPassageId: firstPassageId }
      }

      const { data: progressRows } = await supabase
        .from('user_progress')
        .select('passage_id')
        .eq('user_id', user.id)
        .eq('text_id', text.id)
        .neq('status', 'not_started')

      const studiedIds = (progressRows ?? []).map(r => r.passage_id)
      const total = totalCount ?? 0
      const percent = total > 0 ? Math.round((studiedIds.length / total) * 100) : 0

      let resumeId = firstPassageId
      if (studiedIds.length > 0) {
        const { data: nextRows } = await supabase
          .from('passages')
          .select('id')
          .eq('text_id', text.id)
          .eq('is_approved', true)
          .not('id', 'in', `(${studiedIds.map(id => `"${id}"`).join(',')})`)
          .order('sequence_order')
          .limit(1)
        resumeId = nextRows?.[0]?.id ?? null
      }

      return { text, progressPercent: percent, firstUnfinishedPassageId: resumeId }
    })
  )

  const firstName = (profile as any)?.display_name?.split(' ')[0] ?? null

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Greeting */}
      <div className="mb-10">
        {firstName ? (
          <>
            <h1 className="text-2xl font-semibold text-stone-900">
              Namaste, {firstName}!
            </h1>
            <p className="font-devanagari text-lg text-saffron-700 mt-1">
              तत्त्वसुधायां स्वागतम्
            </p>
          </>
        ) : (
          <>
            <h1 className="font-devanagari text-2xl font-semibold text-stone-900">
              तत्त्वसुधायां स्वागतम्
            </h1>
            <p className="text-stone-500 mt-1">Welcome to Tattvasudhā</p>
          </>
        )}
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-10">

        {/* Left — Texts (60%) */}
        <div className="lg:w-3/5">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-5">
            Self-Study Courses
          </h2>
          {textData.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <p>No texts published yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {textData.map(({ text, progressPercent, firstUnfinishedPassageId }) => (
                <TextCard
                  key={text.id}
                  text={text as any}
                  progressPercent={progressPercent}
                  firstUnfinishedPassageId={firstUnfinishedPassageId}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right — NotebookLMs (40%) */}
        <div className="lg:w-2/5">
          <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-5">
            NotebookLMs
          </h2>
          {(notebooks ?? []).length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <p className="font-devanagari">ज्ञानकोशः प्रस्तूयते</p>
              <p className="text-sm mt-1">Notebooks coming soon</p>
            </div>
          ) : (
            <div className="space-y-5">
              {(notebooks ?? []).map(nb => (
                <NotebookCard key={nb.id} notebook={nb} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
