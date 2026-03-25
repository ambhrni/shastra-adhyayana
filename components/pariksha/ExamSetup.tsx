'use client'

import { useState } from 'react'
import type { Text, Passage } from '@/types/database'

interface ExamSetupProps {
  text: Text
  passages: Pick<Passage, 'id' | 'section_number' | 'subsection_number' | 'mula_text' | 'sequence_order'>[]
  onStart: (passageId: string | null) => void
}

export default function ExamSetup({ text, passages, onStart }: ExamSetupProps) {
  const [scope, setScope] = useState<'full' | 'passage'>('full')
  const [passageId, setPassageId] = useState<string>('')

  function handleStart() {
    onStart(scope === 'passage' ? passageId || null : null)
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl border border-stone-200 p-8">
      <h2 className="text-lg font-semibold text-stone-900 mb-1">Parīkṣā</h2>
      <p className="text-sm text-stone-500 mb-6">
        A traditional vidvat examination on{' '}
        <span className="font-devanagari">{text.title}</span>
        {' '}({text.title_transliterated})
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">Examination scope</label>
          <div className="flex flex-col gap-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="radio"
                name="scope"
                value="full"
                checked={scope === 'full'}
                onChange={() => setScope('full')}
                className="mt-0.5 accent-saffron-600"
              />
              <div>
                <p className="text-sm font-medium text-stone-800 group-hover:text-stone-900">Full text</p>
                <p className="text-xs text-stone-500">Questions drawn from the entire text</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="radio"
                name="scope"
                value="passage"
                checked={scope === 'passage'}
                onChange={() => setScope('passage')}
                className="mt-0.5 accent-saffron-600"
              />
              <div>
                <p className="text-sm font-medium text-stone-800 group-hover:text-stone-900">Specific passage</p>
                <p className="text-xs text-stone-500">Deep examination of one passage</p>
              </div>
            </label>
          </div>
        </div>

        {scope === 'passage' && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Select passage</label>
            <select
              value={passageId}
              onChange={e => setPassageId(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
            >
              <option value="">Choose a passage…</option>
              {passages.map(p => (
                <option key={p.id} value={p.id}>
                  {p.section_number != null ? `§${p.section_number}` : ''}
                  {p.subsection_number != null ? `.${p.subsection_number}` : ''}{' '}
                  — {p.mula_text.slice(0, 60)}…
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm text-amber-800">
          <p className="font-medium mb-0.5">How the parīkṣā works</p>
          <ul className="text-xs text-amber-700 space-y-0.5 list-disc list-inside">
            <li>The paṇḍit will ask 5–7 questions, one at a time</li>
            <li>You may answer in English or Sanskrit</li>
            <li>Each answer receives a score (0–10) and brief feedback</li>
            <li>You receive a full assessment at the end</li>
          </ul>
        </div>

        <button
          onClick={handleStart}
          disabled={scope === 'passage' && !passageId}
          className="w-full bg-saffron-600 hover:bg-saffron-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          Begin examination
        </button>
      </div>
    </div>
  )
}
