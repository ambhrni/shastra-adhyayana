'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const ISSUE_TYPES = [
  'Incorrect Sanskrit',
  'Wrong logical flow',
  'Incorrect attribution',
  'Missing node',
  'Other',
]

interface Props {
  passageId: string
  textId: string
  onClose: () => void
}

export default function FlagArgumentMapModal({ passageId, textId, onClose }: Props) {
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0])
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('argument_map_flags').insert({
      passage_id: passageId,
      text_id: textId,
      user_id: user?.id ?? null,
      issue_type: issueType,
      description,
      status: 'open',
    })
    setSubmitted(true)
    setSubmitting(false)
    setTimeout(onClose, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-stone-900">Report Argument Map Issue</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6 text-emerald-600">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">Report submitted — thank you!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Issue type
              </label>
              <select
                value={issueType}
                onChange={e => setIssueType(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
              >
                {ISSUE_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Describe the discrepancy
              </label>
              <textarea
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                placeholder="Which node, what is incorrect, what the correct form should be"
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 resize-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-saffron-600 hover:bg-saffron-700 disabled:opacity-50 text-white text-sm font-medium py-2 rounded-lg"
              >
                {submitting ? 'Submitting…' : 'Submit report'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-stone-600 hover:text-stone-800 border border-stone-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
