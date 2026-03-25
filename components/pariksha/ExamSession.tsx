'use client'

import { useState, useRef, useEffect } from 'react'
import Spinner from '@/components/ui/Spinner'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ExamSessionProps {
  textId: string
  passageId: string | null
  onReset: () => void
}

// Parse score lines from examiner response
function parseScores(text: string): { philosophy?: number; sanskrit?: number | null } {
  const philo = text.match(/SCORE_PHILOSOPHY:\s*([\d.]+)/)
  const skt = text.match(/SCORE_SANSKRIT:\s*([\d.]+|null)/)
  return {
    philosophy: philo ? parseFloat(philo[1]) : undefined,
    sanskrit: skt ? (skt[1] === 'null' ? null : parseFloat(skt[1])) : undefined,
  }
}

function ScorePill({ label, value }: { label: string; value: number }) {
  const color = value >= 8 ? 'bg-emerald-100 text-emerald-800' : value >= 5 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {label}: {value}/10
    </span>
  )
}

// Strip score/feedback lines for clean display
function cleanForDisplay(text: string): string {
  return text
    .replace(/SCORE_PHILOSOPHY:\s*[\d.]+\n?/g, '')
    .replace(/SCORE_SANSKRIT:\s*([\d.]+|null)\n?/g, '')
    .replace(/FEEDBACK:\s*/g, '\n📝 ')
    .replace(/EXAMINATION_COMPLETE\n?/g, '')
    .replace(/FINAL_SCORE_PHILOSOPHY:.*\n?/g, '')
    .replace(/FINAL_SCORE_SANSKRIT:.*\n?/g, '')
    .replace(/OVERALL_FEEDBACK:\s*/g, '\n**Overall Feedback:**\n')
    .replace(/STRENGTHS:\s*/g, '\n**Strengths:**\n')
    .replace(/AREAS_FOR_IMPROVEMENT:\s*/g, '\n**Areas for Improvement:**\n')
    .trim()
}

export default function ExamSession({ textId, passageId, onReset }: ExamSessionProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [done, setDone] = useState(false)
  const [sessionId, setSessionId] = useState<string | undefined>()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Start exam on mount
  useEffect(() => { startExam() }, [])

  async function startExam() {
    setStreaming(true)
    const placeholder: Message = { role: 'assistant', content: '' }
    setMessages([placeholder])

    try {
      const res = await fetch('/api/pariksha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textId, passageId, messages: [] }),
      })

      if (!res.ok || !res.body) throw new Error('Stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done: d, value } = await reader.read()
        if (d) break
        full += decoder.decode(value, { stream: true })
        setMessages([{ role: 'assistant', content: full }])
      }
    } finally {
      setStreaming(false)
    }
  }

  async function sendAnswer() {
    const text = input.trim()
    if (!text || streaming || done) return

    const userMsg: Message = { role: 'user', content: text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setStreaming(true)

    const placeholder: Message = { role: 'assistant', content: '' }
    setMessages([...updatedMessages, placeholder])

    try {
      const res = await fetch('/api/pariksha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textId,
          passageId,
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          sessionId,
        }),
      })

      if (!res.ok || !res.body) throw new Error('Stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done: d, value } = await reader.read()
        if (d) break
        full += decoder.decode(value, { stream: true })
        setMessages([...updatedMessages, { role: 'assistant', content: full }])
      }

      if (full.includes('EXAMINATION_COMPLETE')) setDone(true)
    } finally {
      setStreaming(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendAnswer()
    }
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-white">
        <div>
          <span className="font-semibold text-stone-900 text-sm">Vidvat Parīkṣā</span>
          {done && <span className="ml-2 text-xs text-emerald-600 font-medium">Complete</span>}
        </div>
        <button
          onClick={onReset}
          className="text-xs text-stone-400 hover:text-stone-600"
        >
          New exam
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 bg-stone-50">
        {messages.map((msg, i) => {
          const scores = msg.role === 'assistant' ? parseScores(msg.content) : null
          const displayText = msg.role === 'assistant' ? cleanForDisplay(msg.content) : msg.content

          return (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                msg.role === 'user' ? 'bg-saffron-500 text-white' : 'bg-stone-700 text-amber-300'
              }`}>
                {msg.role === 'user' ? 'Y' : 'P'}
              </div>
              <div className={`flex-1 max-w-[90%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                {scores && (scores.philosophy !== undefined) && (
                  <div className="flex gap-1.5 mb-1.5">
                    <ScorePill label="Phil." value={scores.philosophy!} />
                    {scores.sanskrit != null && <ScorePill label="Skt." value={scores.sanskrit} />}
                  </div>
                )}
                <div className={`inline-block px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-saffron-50 border border-saffron-100 text-stone-800'
                    : 'bg-white border border-stone-200 text-stone-800'
                }`}>
                  {displayText || (streaming && i === messages.length - 1 ? (
                    <span className="inline-flex items-center gap-1 text-stone-400">
                      <Spinner size="sm" /> thinking…
                    </span>
                  ) : '')}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {!done ? (
        <div className="border-t border-stone-200 bg-white p-3">
          <div className="flex gap-2 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              disabled={streaming}
              placeholder="Your answer… (Enter to submit, Shift+Enter for new line)"
              className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-saffron-500 disabled:opacity-50"
            />
            <button
              onClick={sendAnswer}
              disabled={!input.trim() || streaming}
              className="shrink-0 bg-saffron-600 hover:bg-saffron-700 disabled:opacity-40 text-white p-2.5 rounded-lg"
            >
              {streaming ? <Spinner size="sm" /> : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-stone-200 bg-white p-4 text-center">
          <p className="text-sm text-stone-600 mb-3">Examination complete. Review your results above.</p>
          <button
            onClick={onReset}
            className="bg-saffron-600 hover:bg-saffron-700 text-white text-sm font-medium px-6 py-2 rounded-lg"
          >
            Start new examination
          </button>
        </div>
      )}
    </div>
  )
}
