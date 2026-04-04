import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import ArgumentMapView from '@/components/map/ArgumentMapView'
import type { ArgumentStream } from '@/lib/argument-map-generator'

export const metadata: Metadata = {
  title: 'Argument Map — Vādāvalī | Tattvasudhā',
}

interface Props {
  params: { textId: string }
}

export default async function ArgumentMapPage({ params }: Props) {
  const { textId } = params
  const supabase = createClient()

  const [
    { data: textData },
    { data: passagesData },
    { data: approvedNodesData },
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

  return (
    <div className="max-w-screen-2xl mx-auto px-8 pt-10 pb-16">
      <ArgumentMapView
        textId={textId}
        textTitle={textData?.title_transliterated ?? 'Vādāvalī'}
        sections={sections}
        approvedNodes={approvedNodes}
      />
    </div>
  )
}
