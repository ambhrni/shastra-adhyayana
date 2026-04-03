import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { embedText, TaskType } from '@/lib/embeddings-server'

export async function POST(req: Request) {
  const { query } = await req.json() as { query: string }

  if (!query?.trim()) {
    return NextResponse.json({ passages: [], chunks: [], nyaya: [] })
  }

  try {
    const embedding = await embedText(query.trim(), TaskType.RETRIEVAL_QUERY)
    const supabase = createClient()

    const { data: results, error } = await supabase.rpc('semantic_search', {
      query_embedding: embedding,
      match_count: 10,
      search_passages: true,
      search_chunks: true,
      search_nyaya: true,
      min_ocr_quality: 0.6,
    })

    if (error) throw error

    const rows = (results ?? []) as {
      source_type: string
      source_id: string
      content: string
      section_label: string
      similarity: number
    }[]

    const passageRows = rows.filter(r => r.source_type === 'passage')
    const chunkRows = rows.filter(r => r.source_type === 'reference')
    const nyayaRows = rows.filter(r => r.source_type === 'nyaya')

    // Build a source_id → text_id map for passages.
    // The semantic_search RPC may return source_id = passages.id directly,
    // or source_id = passage_embeddings.id. We try both paths.
    let passageResults: {
      id: string
      textId: string
      sectionName: string | null
      mulaPreview: string
      similarity: number
    }[] = []

    if (passageRows.length > 0) {
      const sourceIds = passageRows.map(p => p.source_id)
      const textIdMap = new Map<string, string>()

      // Path 1: source_id is the passage UUID itself
      const { data: directPassages } = await supabase
        .from('passages')
        .select('id, text_id')
        .in('id', sourceIds)
      for (const p of directPassages ?? []) {
        textIdMap.set(p.id, (p as any).text_id)
      }

      // Path 2: source_id is a passage_embeddings row ID — look up passage_id first
      const unresolved = sourceIds.filter(id => !textIdMap.has(id))
      if (unresolved.length > 0) {
        const { data: embedRows } = await supabase
          .from('passage_embeddings')
          .select('id, passage_id')
          .in('id', unresolved)
        if (embedRows && embedRows.length > 0) {
          const passageIds = (embedRows as any[]).map(e => e.passage_id)
          const { data: indirectPassages } = await supabase
            .from('passages')
            .select('id, text_id')
            .in('id', passageIds)
          const pidToTextId = new Map(
            (indirectPassages ?? []).map((p: any) => [p.id, p.text_id])
          )
          for (const e of embedRows as any[]) {
            textIdMap.set(e.id, pidToTextId.get(e.passage_id) ?? '')
          }
        }
      }

      passageResults = passageRows.map(p => ({
        id: p.source_id,
        textId: textIdMap.get(p.source_id) ?? '',
        sectionName: p.section_label,
        mulaPreview: p.content?.slice(0, 120) ?? '',
        similarity: p.similarity,
      }))
    }

    return NextResponse.json({
      passages: passageResults,
      chunks: chunkRows.map(c => ({
        id: c.source_id,
        sectionLabel: c.section_label,
        content: c.content,
        similarity: c.similarity,
      })),
      nyaya: nyayaRows.map(n => ({
        id: n.source_id,
        termSanskrit: n.section_label,
        definition: n.content,
        similarity: n.similarity,
      })),
    })
  } catch {
    return NextResponse.json({ passages: [], chunks: [], nyaya: [] })
  }
}
