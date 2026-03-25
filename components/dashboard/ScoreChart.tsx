'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import type { ParikshaSession } from '@/types/database'

interface ScoreChartProps {
  sessions: ParikshaSession[]
}

export default function ScoreChart({ sessions }: ScoreChartProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-stone-600 mb-3">Parīkṣā Scores</h3>
        <p className="text-sm text-stone-400 italic">No examinations taken yet.</p>
      </div>
    )
  }

  const data = sessions
    .filter(s => s.score_philosophy != null)
    .slice(-20) // last 20 sessions
    .map((s, i) => ({
      name: `#${i + 1}`,
      date: new Date(s.session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      Philosophy: s.score_philosophy,
      Sanskrit: s.score_sanskrit,
    }))

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-stone-600 mb-4">Parīkṣā Scores</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#78716c' }} />
          <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#78716c' }} />
          <Tooltip
            contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e7e5e4' }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="Philosophy"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Sanskrit"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
