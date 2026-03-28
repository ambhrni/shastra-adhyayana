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
    <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      <div>
        <h2 className="text-xl font-devanagari font-semibold text-stone-900 leading-tight">
          {text.title}
        </h2>
        <p className="text-sm text-stone-500 mt-0.5">{text.title_transliterated}</p>
        {text.author && (
          <p className="text-sm text-stone-400 mt-1">by {text.author}</p>
        )}
      </div>

      {text.description && (
        <p className="text-sm text-stone-600 leading-relaxed">{text.description}</p>
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
        href={href}
        className="mt-auto inline-flex items-center justify-center bg-saffron-600 hover:bg-saffron-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors"
      >
        {buttonLabel}
      </Link>
    </div>
  )
}
