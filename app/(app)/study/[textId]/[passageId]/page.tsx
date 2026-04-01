import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import MulaPanel from '@/components/study/MulaPanel'
import CommentaryTabs from '@/components/study/CommentaryTabs'
import StudyRightPanel from '@/components/study/StudyRightPanel'
import ResizableSplitPane from '@/components/study/ResizableSplitPane'
import Link from 'next/link'
import { embedText, TaskType } from '@/lib/embeddings-server'

interface RelatedPassage {
  id: string
  textId: string
  sectionName: string | null
  mulaPreview: string
}

interface Props {
  params: { textId: string; passageId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: passage } = await supabase
    .from('passages')
    .select('mula_text, section_name')
    .eq('id', params.passageId)
    .eq('text_id', params.textId)
    .single()

  if (!passage) return {}

  const title = passage.section_name ?? 'Passage'
  const description = passage.mula_text?.slice(0, 160) ?? ''

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Tattvasudhā`,
      description,
      siteName: 'Tattvasudhā — तत्त्वसुधा',
      images: [
        {
          url: '/og-image',
          width: 1200,
          height: 630,
          alt: 'Tattvasudhā — तत्त्वसुधा',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Tattvasudhā`,
      description,
      images: ['/og-image'],
    },
  }
}

export default async function StudyPage({ params }: Props) {
  const { textId, passageId } = params
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('user_profiles').select('role').eq('id', user.id).single()
    : { data: null }

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

  // Fetch commentaries sorted by text_commentators.order_index
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

  // Fetch user progress (only if logged in)
  const { data: progress } = user
    ? await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('passage_id', passageId)
        .single()
    : { data: null }

  // Prev / next passage by sequence_order
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

  // Fetch related passages via semantic search (graceful — skip if embeddings not populated)
  let relatedPassages: RelatedPassage[] = []
  try {
    const embedding = await embedText(passage.mula_text, TaskType.RETRIEVAL_QUERY)
    const { data: ragResults } = await supabase.rpc('semantic_search', {
      query_embedding: embedding,
      match_count: 4,
      search_passages: true,
      search_chunks: false,
      search_nyaya: false,
      min_ocr_quality: 0.6,
    })
    const candidates = ((ragResults ?? []) as {
      source_type: string
      source_id: string
      content: string
      section_label: string
      similarity: number
    }[]).filter(r => r.source_type === 'passage' && r.source_id !== passageId && r.similarity > 0.65)
      .slice(0, 3)

    if (candidates.length > 0) {
      const { data: passageRows } = await supabase
        .from('passages')
        .select('id, text_id')
        .in('id', candidates.map(c => c.source_id))
      const textIdMap = new Map((passageRows ?? []).map((p: any) => [p.id, p.text_id]))
      relatedPassages = candidates.map(r => ({
        id: r.source_id,
        textId: textIdMap.get(r.source_id) ?? textId,
        sectionName: r.section_label,
        mulaPreview: r.content?.slice(0, 80) ?? '',
      }))
    }
  } catch {
    // embeddings not yet populated — proceed without related passages
  }

  const prevPassageId = prevRows?.[0]?.id ?? null
  const nextPassageId = nextRows?.[0]?.id ?? null

  // Fetch all passages for section/passage navigation
  const allPassagesQuery = supabase
    .from('passages')
    .select('id, section_number, section_name, sequence_order')
    .eq('text_id', textId)
    .order('sequence_order')
  if (!isCurator) allPassagesQuery.eq('is_approved', true)
  const { data: allPassages } = await allPassagesQuery

  const commentators = (textCommentators ?? []).map(tc => tc.commentator).filter(Boolean) as any[]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Guest banner */}
      {!user && (
        <div className="shrink-0 flex items-center justify-between gap-4 px-5 py-2.5 bg-amber-50 border-b border-amber-200 text-sm">
          <span className="text-amber-900">
            Join Tattvasudhā to ask questions, track your progress, and take parīkṣā.
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/register"
              className="bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              Register free
            </Link>
            <Link
              href="/login"
              className="text-saffron-700 hover:text-saffron-800 text-xs font-medium px-3 py-1.5 rounded-lg border border-saffron-300 hover:bg-saffron-50 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      )}

      <ResizableSplitPane
        left={
          <>
            <MulaPanel passage={passage} isCurator={isCurator} />
            <CommentaryTabs
              key={passageId}
              commentaries={commentaries}
              isCurator={isCurator}
            />
          </>
        }
        right={
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
            allPassages={allPassages ?? []}
            isLoggedIn={!!user}
            relatedPassages={relatedPassages}
          />
        }
      />
    </div>
  )
}
