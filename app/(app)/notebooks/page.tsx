import { createClient } from '@/lib/supabase/server'
import type { Notebook } from '@/types/database'
import NotebookCard from '@/components/notebooks/NotebookCard'

export const metadata = {
  title: 'Notebooks',
  description:
    'Curated NotebookLM notebooks for deep study of Vedic texts, stotras, purāṇas, and śāstra.',
  openGraph: {
    title: 'Notebooks | Tattvasudhā',
    description:
      'Curated NotebookLM notebooks for deep study of Vedic texts, stotras, purāṇas, and śāstra.',
    siteName: 'Tattvasudhā — तत्त्वसुधा',
  },
}

function groupByTopic(notebooks: Notebook[]): { topic: string; notebooks: Notebook[] }[] {
  const map = new Map<string, Notebook[]>()
  for (const nb of notebooks) {
    if (!map.has(nb.topic_area)) map.set(nb.topic_area, [])
    map.get(nb.topic_area)!.push(nb)
  }
  return Array.from(map.entries()).map(([topic, nbs]) => ({ topic, notebooks: nbs }))
}


function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <svg className="w-14 h-14 text-stone-300 mb-5" fill="none" viewBox="0 0 48 48" stroke="currentColor" strokeWidth={1.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 8c0 0-7 5-7 12a7 7 0 0014 0C31 13 24 8 24 8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M24 20v5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 36h14M15 42h18" />
        <ellipse cx="24" cy="42" rx="9" ry="2.5" />
      </svg>
      <h3 className="text-lg font-semibold text-stone-500 mb-1">
        ज्ञानकोशः प्रस्तूयते
      </h3>
      <p className="text-stone-400 text-sm">Notebooks coming soon</p>
    </div>
  )
}

export default async function NotebooksPage() {
  const supabase = createClient()
  const { data: notebooks } = await supabase
    .from('notebooks')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })

  const grouped = groupByTopic(notebooks ?? [])

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-3xl font-semibold text-stone-900">Notebooks</h1>
        <p className="font-devanagari text-xl text-saffron-700 mt-1">
          ज्ञानकोशः — A curated collection for śāstra study
        </p>
        <p className="text-stone-500 mt-3 max-w-2xl leading-relaxed">
          Curated NotebookLM notebooks for deep study of Vedic texts, stotras, purāṇas,
          and śāstra. Each notebook is a focused study companion — explore, listen, and
          ask questions.
        </p>
      </div>

      {grouped.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-12">
          {grouped.map(({ topic, notebooks: nbs }) => (
            <section key={topic}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-lg font-semibold text-stone-700 shrink-0">{topic}</h2>
                <div className="flex-1 h-px bg-stone-200" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {nbs.map(nb => (
                  <NotebookCard key={nb.id} notebook={nb} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
