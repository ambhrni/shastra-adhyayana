import Link from 'next/link'
import type { Text } from '@/types/database'

interface TextCardProps {
  text: Text
  progressPercent: number | null
  firstUnfinishedPassageId: string | null
}

export default function TextCard({ text, progressPercent, firstUnfinishedPassageId }: TextCardProps) {
  const href = firstUnfinishedPassageId
    ? `/study/${text.id}/${firstUnfinishedPassageId}`
    : `/study/${text.id}`

  const buttonLabel = progressPercent === null
    ? 'Begin studying'
    : progressPercent === 0 ? 'Begin studying'
    : progressPercent === 100 ? 'Review'
    : 'Continue'

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl">
        {text.thumbnail_url ? (
          <img
            src={text.thumbnail_url}
            alt={text.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2D0A00] to-[#8B2500]">
            <span className="font-devanagari text-white text-2xl font-bold opacity-90 text-center px-6 leading-snug">
              {text.title}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h2 className="text-base font-semibold text-stone-900 leading-snug">
            {text.title_transliterated}
          </h2>
          {text.author && (
            <p className="text-sm text-stone-400 mt-0.5">by {text.author}</p>
          )}
        </div>

        {text.description && (
          <p className="text-sm text-stone-500 leading-relaxed flex-1">
            {text.description}
          </p>
        )}

        {progressPercent !== null && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-stone-500">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-saffron-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        <Link
          href={`/texts/${text.id}/intro`}
          className="w-full inline-flex items-center justify-center border border-saffron-600 text-saffron-700 hover:bg-saffron-50 text-sm font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Overview →
        </Link>
        <Link
          href={href}
          className="mt-auto w-full inline-flex items-center justify-center bg-saffron-600 hover:bg-saffron-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {buttonLabel}
        </Link>
      </div>
    </div>
  )
}
