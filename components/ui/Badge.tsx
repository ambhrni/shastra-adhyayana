interface BadgeProps {
  children: React.ReactNode
  variant?: 'amber' | 'green' | 'blue' | 'red' | 'stone'
}

const variants: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-800 border-amber-200',
  green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  blue:  'bg-blue-100 text-blue-800 border-blue-200',
  red:   'bg-red-100 text-red-800 border-red-200',
  stone: 'bg-stone-100 text-stone-700 border-stone-200',
}

export default function Badge({ children, variant = 'stone' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  )
}
