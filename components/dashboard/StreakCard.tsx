import type { StudyStreak } from '@/types/database'

export default function StreakCard({ streak }: { streak: StudyStreak | null }) {
  const current = streak?.current_streak ?? 0
  const longest = streak?.longest_streak ?? 0

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-stone-600 mb-4">Study Streak</h3>
      <div className="flex items-end gap-6">
        <div>
          <div className="text-4xl font-bold text-saffron-600 leading-none">{current}</div>
          <div className="text-xs text-stone-500 mt-1">day{current !== 1 ? 's' : ''} current</div>
        </div>
        <div className="pb-1">
          <div className="text-xl font-semibold text-stone-400">{longest}</div>
          <div className="text-xs text-stone-400">longest</div>
        </div>
      </div>

      {current === 0 && (
        <p className="mt-3 text-xs text-stone-400">Study today to start your streak.</p>
      )}
      {current > 0 && current === longest && (
        <p className="mt-3 text-xs text-emerald-600 font-medium">🔥 Personal best!</p>
      )}
    </div>
  )
}
