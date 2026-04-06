import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ArgumentMapView from '@/components/map/ArgumentMapView'
import type { ArgumentStream } from '@/lib/argument-map-generator'

export const metadata: Metadata = {
  title: 'Argument Map — Vādāvalī | Tattvasudhā',
}

interface Props {
  params: { textId: string }
  searchParams: { section?: string }
}

export default async function ArgumentMapPage({ params, searchParams }: Props) {
  const { textId } = params
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('user_profiles').select('role').eq('id', user.id).single()
    : { data: null }
  const isCurator = profile?.role === 'curator' || profile?.role === 'admin'

  const [
    { data: textData },
    { data: passagesData },
    { data: approvedNodesData },
    { data: sectionArgTypesData },
    { data: sectionLinksData },
  ] = await Promise.all([
    supabase
      .from('texts')
      .select('id, title, title_transliterated')
      .eq('id', textId)
      .single(),
    supabase
      .from('passages')
      .select('id, section_number, section_name, sequence_order')
      .eq('text_id', textId)
      .eq('is_approved', true)
      .order('sequence_order'),
    supabase
      .from('argument_nodes')
      .select('passage_id, stream')
      .eq('is_approved', true),
    supabase
      .from('section_argument_types')
      .select('section_number, argument_type')
      .eq('text_id', textId),
    supabase
      .from('section_links')
      .select('from_section, to_section, connection_type, rationale, rationale_sanskrit, is_spine')
      .eq('text_id', textId),
  ])

  // Group passages by section_number (exclude null section_number)
  const sectionMap = new Map<number, { id: string; sequence_order: number; section_name: string | null }[]>()
  for (const p of passagesData ?? []) {
    if (p.section_number == null) continue
    if (!sectionMap.has(p.section_number)) sectionMap.set(p.section_number, [])
    sectionMap.get(p.section_number)!.push(p)
  }

  const sections = Array.from(sectionMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([sectionNumber, passages]) => ({
      sectionNumber,
      sectionName: passages[0]?.section_name ?? null,
      passages: passages
        .sort((a, b) => a.sequence_order - b.sequence_order)
        .map(p => ({ id: p.id, sequence_order: p.sequence_order })),
    }))

  const approvedNodes = (approvedNodesData ?? []).map((n: any) => ({
    passage_id: n.passage_id as string,
    stream: n.stream as ArgumentStream,
  }))

  const sectionArgumentTypes = Object.fromEntries(
    (sectionArgTypesData ?? []).map((r: any) => [r.section_number as number, r.argument_type])
  ) as Record<number, any>

  const sectionLinks = (sectionLinksData ?? []).map((l: any) => ({
    from_section:       l.from_section as number,
    to_section:         l.to_section as number,
    connection_type:    l.connection_type as string,
    rationale:          l.rationale as string | null,
    rationale_sanskrit: l.rationale_sanskrit as string | null,
    is_spine:           l.is_spine as boolean,
  }))

  const firstPassageId = (passagesData ?? []).sort((a, b) => a.sequence_order - b.sequence_order)[0]?.id
  const backHref = firstPassageId
    ? `/study/${textId}/${firstPassageId}`
    : '/'

  return (
    <div className="max-w-screen-2xl mx-auto px-8 pt-6 pb-0 h-full flex flex-col">
      {/* Page header */}
      <div className="mb-6 flex items-start gap-4">
        <Link
          href={backHref}
          className="mt-1 text-sm text-stone-400 hover:text-saffron-600 transition-colors shrink-0"
        >
          ← Vādāvalī
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-stone-800 leading-tight">Argument Map — Vādāvalī</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            The logical architecture of Jayatīrtha's refutation of Advaita Vedānta
          </p>
        </div>
      </div>

      <ArgumentMapView
        textId={textId}
        textTitle={textData?.title_transliterated ?? 'Vādāvalī'}
        sections={sections}
        approvedNodes={approvedNodes}
        sectionArgumentTypes={sectionArgumentTypes}
        sectionLinks={sectionLinks}
        isCurator={isCurator}
        initialSectionNumber={searchParams.section ? parseInt(searchParams.section, 10) : undefined}
      />
    </div>
  )
}
