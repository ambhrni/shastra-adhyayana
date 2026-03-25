import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MulaPanel from '@/components/study/MulaPanel'
import CommentaryTabs from '@/components/study/CommentaryTabs'
import StudyRightPanel from '@/components/study/StudyRightPanel'

interface Props {
  params: { textId: string; passageId: string }
}

export default async function StudyPage({ params }: Props) {
  const { textId, passageId } = params
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isCurator = profile?.role === 'curator' || profile?.role === 'admin'

  // Fetch passage with logical argument type
  const { data: passage } = await supabase
    .from('passages')
    .select('*, logical_argument_type:logical_argument_types(*)')
    .eq('id', passageId)
    .eq('text_id', textId)
    .single()

  if (!passage) notFound()
  if (!isCurator && !passage.is_approved) notFound()

  // Fetch commentators in display order (Rāghavendra first, Śrīnivāsa second)
  const { data: textCommentators } = await supabase
    .from('text_commentators')
    .select('commentator:commentators(*)')
    .eq('text_id', textId)
    .order('order_index')

  const commentatorOrder = (textCommentators ?? []).map(tc => (tc.commentator as any)?.id)

  // Fetch commentaries with commentator info, then sort by text_commentators.order_index
  // so tabs always appear in the intended display order regardless of insertion order.
  const commentariesQuery = supabase
    .from('commentaries')
    .select('*, commentator:commentators(*)')
    .eq('passage_id', passageId)

  if (!isCurator) commentariesQuery.eq('is_approved', true)

  const { data: rawCommentaries } = await commentariesQuery

  const commentaries = (rawCommentaries ?? []).sort((a, b) => {
    const ai = commentatorOrder.indexOf((a.commentator as any)?.id ?? a.commentator_id)
    const bi = commentatorOrder.indexOf((b.commentator as any)?.id ?? b.commentator_id)
    if (ai === -1 && bi === -1) return 0
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

  // Fetch nyāya concepts linked to this passage
  const { data: nyayaLinks } = await supabase
    .from('passage_nyaya_links')
    .select('nyaya_concept:nyaya_concepts(*)')
    .eq('passage_id', passageId)

  const nyayaConcepts = (nyayaLinks ?? [])
    .map(l => l.nyaya_concept)
    .filter(Boolean) as any[]

  // Fetch notes visible to this user
  const notesQuery = supabase
    .from('passage_notes')
    .select('*')
    .eq('passage_id', passageId)
  if (!isCurator) notesQuery.eq('is_visible_to_learners', true)
  const { data: notes } = await notesQuery

  // Fetch user progress
  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('passage_id', passageId)
    .single()

  // Prev / next passage by sequence_order
  // Curators navigate all passages; learners only approved
  const prevQuery = supabase
    .from('passages').select('id')
    .eq('text_id', textId)
    .lt('sequence_order', passage.sequence_order)
    .order('sequence_order', { ascending: false })
    .limit(1)

  const nextQuery = supabase
    .from('passages').select('id')
    .eq('text_id', textId)
    .gt('sequence_order', passage.sequence_order)
    .order('sequence_order')
    .limit(1)

  if (!isCurator) {
    prevQuery.eq('is_approved', true)
    nextQuery.eq('is_approved', true)
  }

  const [{ data: prevRows }, { data: nextRows }] = await Promise.all([prevQuery, nextQuery])

  const prevPassageId = prevRows?.[0]?.id ?? null
  const nextPassageId = nextRows?.[0]?.id ?? null

  const commentators = (textCommentators ?? []).map(tc => tc.commentator).filter(Boolean) as any[]

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel — 60% */}
      <div className="w-3/5 overflow-y-auto border-r border-stone-200 p-6">
        <MulaPanel passage={passage} isCurator={isCurator} />
        <CommentaryTabs
          key={passageId}
          commentaries={commentaries}
          isCurator={isCurator}
        />
      </div>

      {/* Right panel — 40% */}
      <div className="w-2/5 overflow-hidden flex flex-col">
        <StudyRightPanel
          passage={passage}
          commentaries={commentaries}
          nyayaConcepts={nyayaConcepts}
          notes={notes ?? []}
          progress={progress ?? null}
          prevPassageId={prevPassageId}
          nextPassageId={nextPassageId}
          textId={textId}
          commentators={commentators}
        />
      </div>
    </div>
  )
}
