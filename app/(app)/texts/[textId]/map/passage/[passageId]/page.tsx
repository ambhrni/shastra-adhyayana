import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PassageDAG from '@/components/map/PassageDAG'

interface Props {
  params: { textId: string; passageId: string }
  searchParams: { section?: string }
}

export default async function PassageMapPage({ params, searchParams }: Props) {
  const { textId, passageId } = params
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('user_profiles').select('role').eq('id', user.id).single()
    : { data: null }
  const isCurator = profile?.role === 'curator' || profile?.role === 'admin'
  const isLoggedIn = !!user

  const [{ data: passage }, { data: nodes }] = await Promise.all([
    supabase
      .from('passages')
      .select('id, section_number, section_name, sequence_order, mula_text')
      .eq('id', passageId)
      .eq('text_id', textId)
      .single(),
    supabase
      .from('argument_nodes')
      .select('id, stream, node_type, content_english, content_sanskrit, logical_flaw, refutation_type, parent_node_id, display_order')
      .eq('passage_id', passageId)
      .order('display_order'),
  ])

  if (!passage) notFound()

  // If section param provided, it overrides passage.section_number for back nav
  const sectionForBackNav = searchParams.section
    ? parseInt(searchParams.section, 10)
    : passage.section_number

  const passageWithSection = {
    ...passage,
    section_number: sectionForBackNav ?? passage.section_number,
  }

  return (
    <PassageDAG
      nodes={nodes ?? []}
      passage={passageWithSection}
      textId={textId}
      isCurator={isCurator}
      isLoggedIn={isLoggedIn}
    />
  )
}
