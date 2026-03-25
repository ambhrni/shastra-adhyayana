import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProgressOverview from '@/components/dashboard/ProgressOverview'
import StreakCard from '@/components/dashboard/StreakCard'
import ScoreChart from '@/components/dashboard/ScoreChart'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [
    { data: texts },
    { data: progressRows },
    { data: streak },
    { data: parikshaSessions },
  ] = await Promise.all([
    supabase.from('texts').select('*').eq('is_published', true).order('created_at'),
    supabase.from('user_progress').select('passage_id, text_id, status').eq('user_id', user.id),
    supabase.from('study_streaks').select('*').eq('user_id', user.id).single(),
    supabase.from('pariksha_sessions')
      .select('*').eq('user_id', user.id).order('session_date').limit(30),
  ])

  const textItems = await Promise.all(
    (texts ?? []).map(async (text) => {
      const { count: total } = await supabase
        .from('passages')
        .select('*', { count: 'exact', head: true })
        .eq('text_id', text.id)
        .eq('is_approved', true)

      const textProgress = (progressRows ?? []).filter(p => p.text_id === text.id)
      const studied = textProgress.filter(p => p.status !== 'not_started').length
      const mastered = textProgress.filter(p => p.status === 'mastered').length

      // First unfinished passage
      const studiedIds = textProgress.map(p => p.passage_id)
      let firstId: string | null = null

      if (studiedIds.length === 0) {
        const { data } = await supabase
          .from('passages').select('id')
          .eq('text_id', text.id).eq('is_approved', true)
          .order('sequence_order').limit(1)
        firstId = data?.[0]?.id ?? null
      } else {
        const { data } = await supabase
          .from('passages').select('id')
          .eq('text_id', text.id).eq('is_approved', true)
          .not('id', 'in', `(${studiedIds.map(id => `"${id}"`).join(',')})`)
          .order('sequence_order').limit(1)
        firstId = data?.[0]?.id ?? null
      }

      return { text, total: total ?? 0, studied, mastered, firstUnfinishedPassageId: firstId }
    })
  )

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-semibold text-stone-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-base font-semibold text-stone-700 mb-3">Progress</h2>
            <ProgressOverview items={textItems} />
          </section>

          <section>
            <h2 className="text-base font-semibold text-stone-700 mb-3">Examination History</h2>
            <ScoreChart sessions={(parikshaSessions ?? []) as any} />
          </section>
        </div>

        <div className="space-y-4">
          <StreakCard streak={streak ?? null} />

          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-stone-600 mb-3">Continue studying</h3>
            <div className="space-y-2">
              {textItems
                .filter(i => i.firstUnfinishedPassageId)
                .map(({ text, firstUnfinishedPassageId }) => (
                  <a
                    key={text.id}
                    href={`/study/${text.id}/${firstUnfinishedPassageId}`}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-stone-50 border border-stone-100 transition-colors group"
                  >
                    <span className="text-sm text-stone-700 font-devanagari truncate">{text.title}</span>
                    <svg className="w-4 h-4 text-stone-400 group-hover:text-saffron-500 shrink-0 ml-2"
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </a>
                ))}
              {textItems.every(i => !i.firstUnfinishedPassageId) && (
                <p className="text-xs text-stone-400 italic">All passages studied!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
