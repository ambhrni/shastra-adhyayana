import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import TextCard from '@/components/library/TextCard'

export default async function LibraryPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('display_name')
    .eq('id', user.id)
    .single()

  const { data: texts } = await supabase
    .from('texts')
    .select('*')
    .eq('is_published', true)
    .order('created_at')

  const textData = await Promise.all(
    (texts ?? []).map(async (text) => {
      // Total approved passages for this text
      const { count: totalCount } = await supabase
        .from('passages')
        .select('*', { count: 'exact', head: true })
        .eq('text_id', text.id)
        .eq('is_approved', true)

      // Passages this user has studied (any non-not_started status)
      const { data: progressRows } = await supabase
        .from('user_progress')
        .select('passage_id')
        .eq('user_id', user.id)
        .eq('text_id', text.id)
        .neq('status', 'not_started')

      const studiedIds = (progressRows ?? []).map(r => r.passage_id)

      // First unfinished passage (not yet in progress)
      let firstId: string | null = null
      if (studiedIds.length === 0) {
        const { data: firstRows } = await supabase
          .from('passages')
          .select('id')
          .eq('text_id', text.id)
          .eq('is_approved', true)
          .order('sequence_order')
          .limit(1)
        firstId = firstRows?.[0]?.id ?? null
      } else {
        const { data: firstRows } = await supabase
          .from('passages')
          .select('id')
          .eq('text_id', text.id)
          .eq('is_approved', true)
          .not('id', 'in', `(${studiedIds.map(id => `"${id}"`).join(',')})`)
          .order('sequence_order')
          .limit(1)
        firstId = firstRows?.[0]?.id ?? null
      }

      const total = totalCount ?? 0
      const studied = studiedIds.length
      const percent = total > 0 ? Math.round((studied / total) * 100) : 0

      return { text, progressPercent: percent, firstUnfinishedPassageId: firstId }
    })
  )

  const firstName = profile?.display_name?.split(' ')[0] ?? 'Scholar'

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">
          Namaste, {firstName}
        </h1>
        <p className="text-stone-500 mt-1">Select a text to begin your study.</p>
      </div>

      {textData.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p className="text-lg">No texts published yet.</p>
          <p className="text-sm mt-1">An admin will publish texts soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {textData.map(({ text, progressPercent, firstUnfinishedPassageId }) => (
            <TextCard
              key={text.id}
              text={text}
              progressPercent={progressPercent}
              firstUnfinishedPassageId={firstUnfinishedPassageId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
