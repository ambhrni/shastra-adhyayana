'use client'

import { useState } from 'react'

const SUBJECTS = ['Suggestion', 'Error correction', 'Question', 'Other']

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [message, setMessage] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const encodedSubject = encodeURIComponent(`[Tattvasudhā] ${subject} — ${name}`)
    const encodedBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )
    window.location.href =
      `mailto:tattvasudhaa@gmail.com?subject=${encodedSubject}&body=${encodedBody}`
  }

  const inputClass =
    'w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 ' +
    'placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 transition'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-600 mb-1">Subject</label>
        <select
          value={subject}
          onChange={e => setSubject(e.target.value)}
          className={inputClass}
        >
          {SUBJECTS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-stone-600 mb-1">Message</label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Your message…"
          className={inputClass + ' resize-none'}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-stone-400">
          Your feedback helps improve Tattvasudhā for all learners.
        </p>
        <button
          type="submit"
          className="shrink-0 bg-saffron-600 hover:bg-saffron-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Send message
        </button>
      </div>
    </form>
  )
}
