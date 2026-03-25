import type { LogicalArgumentType } from '@/types/database'

const codeColors: Record<string, string> = {
  'purva-paksha':  'bg-red-100 text-red-800 border-red-200',
  'siddhanta':     'bg-emerald-100 text-emerald-800 border-emerald-200',
  'khanda':        'bg-orange-100 text-orange-800 border-orange-200',
  'vyapti':        'bg-blue-100 text-blue-800 border-blue-200',
  'vyapti-siddhi': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'hetu':          'bg-violet-100 text-violet-800 border-violet-200',
  'sadhya':        'bg-purple-100 text-purple-800 border-purple-200',
  'dristanta':     'bg-teal-100 text-teal-800 border-teal-200',
  'upanaya':       'bg-cyan-100 text-cyan-800 border-cyan-200',
  'nigamana':      'bg-lime-100 text-lime-800 border-lime-200',
  'paksha':        'bg-amber-100 text-amber-800 border-amber-200',
}

export default function LogicalRoleBadge({ type }: { type: LogicalArgumentType | null }) {
  if (!type) return null

  const colorClass = codeColors[type.code] ?? 'bg-stone-100 text-stone-700 border-stone-200'

  return (
    <div className="flex items-start gap-2">
      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${colorClass}`}>
        {type.label_sanskrit && (
          <span className="font-devanagari">{type.label_sanskrit}</span>
        )}
        <span>·</span>
        <span>{type.label_english}</span>
      </div>
    </div>
  )
}
