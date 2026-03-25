import Link from 'next/link'
import type { Text } from '@/types/database'

interface TextProgress {
  text: Text
  total: number
  studied: number
  mastered: number
  firstUnfinishedPassageId: string | null
}

export default function ProgressOverview({ items }: { items: TextProgress[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-stone-400 italic">No texts available yet.</p>
  }

  return (
    <div className="space-y-4">
      {items.map(({ text, total, studied, mastered, firstUnfinishedPassageId }) => {
        const studiedPct = total > 0 ? Math.round((studied / total) * 100) : 0
        const masteredPct = total > 0 ? Math.round((mastered / total) * 100) : 0

        return (
          <div key={text.id} className="bg-white border border-stone-200 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-devanagari font-semibold text-stone-900">{text.title}</h3>
                <p className="text-xs text-stone-400">{text.title_transliterated}</p>
              </div>
              {firstUnfinishedPassageId && (
                <Link
                  href={`/study/${text.id}/${firstUnfinishedPassageId}`}
                  className="text-xs font-medium text-saffron-600 hover:text-saffron-800 shrink-0"
                >
                  Continue →
                </Link>
              )}
            </div>

            <div className="space-y-2">
              {/* Studied bar */}
              <div>
                <div className="flex justify-between text-xs text-stone-500 mb-1">
                  <span>Studied</span>
                  <span>{studied}/{total} ({studiedPct}%)</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400 rounded-full transition-all"
                    style={{ width: `${studiedPct}%` }}
                  />
                </div>
              </div>

              {/* Mastered bar */}
              <div>
                <div className="flex justify-between text-xs text-stone-500 mb-1">
                  <span>Mastered</span>
                  <span>{mastered}/{total} ({masteredPct}%)</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${masteredPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
