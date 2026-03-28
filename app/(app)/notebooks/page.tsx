import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Notebook } from '@/types/database'

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

function TopicBadge({ topic }: { topic: string }) {
  return (
    <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
      {topic}
    </span>
  )
}

function NotebookCard({ notebook }: { notebook: Notebook }) {
  return (
    <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl">
        {notebook.thumbnail_url ? (
          <img
            src={notebook.thumbnail_url}
            alt={notebook.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-saffron-600 to-amber-700">
            <span className="font-devanagari text-white text-lg font-semibold opacity-80 text-center px-4 leading-snug">
              {notebook.topic_area}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-stone-900 leading-snug">
            {notebook.title}
          </h3>
          <TopicBadge topic={notebook.topic_area} />
        </div>

        {notebook.description && (
          <p className="text-sm text-stone-500 leading-relaxed flex-1">
            {notebook.description}
          </p>
        )}

        <Link
          href={notebook.notebooklm_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto w-full inline-flex items-center justify-center gap-1.5 bg-saffron-600 hover:bg-saffron-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Open in NotebookLM
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </Link>
      </div>
    </div>
  )
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
