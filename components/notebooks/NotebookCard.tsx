import Link from 'next/link'
import type { Notebook } from '@/types/database'

function TopicBadge({ topic }: { topic: string }) {
  return (
    <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
      {topic}
    </span>
  )
}

export default function NotebookCard({ notebook }: { notebook: Notebook }) {
  return (
    <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
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
