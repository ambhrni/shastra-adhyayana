'use client'

import { useState, useRef, useEffect } from 'react'
import type { Passage, Commentary, TutorMessage } from '@/types/database'
import ChatMessage from './ChatMessage'
import Spinner from '@/components/ui/Spinner'

interface TutorSidebarProps {
  passage: Passage
  commentaries: Commentary[]
}

export default function TutorSidebar({ passage, commentaries }: TutorSidebarProps) {
  const [messages, setMessages] = useState<TutorMessage[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [sessionId, setSessionId] = useState<string | undefined>()
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    const text = input.trim()
    if (!text || streaming) return

    const userMsg: TutorMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }

    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setStreaming(true)

    // Placeholder for streaming response
    const assistantMsg: TutorMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    }
    setMessages([...newMessages, assistantMsg])

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          passageId: passage.id,
          messages: newMessages,
          sessionId,
        }),
      })

      if (!res.ok || !res.body) throw new Error('Stream failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { ...assistantMsg, content: fullText }
          return updated
        })
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          ...assistantMsg,
          content: 'Sorry, something went wrong. Please try again.',
        }
        return updated
      })
    } finally {
      setStreaming(false)
      textareaRef.current?.focus()
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function startNewSession() {
    setMessages([])
    setSessionId(undefined)
    setInput('')
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-stone-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-stone-200 bg-white">
        <div>
          <span className="text-sm font-semibold text-stone-800">Tutor</span>
          <span className="ml-2 text-xs text-stone-400">Vedāntācārya</span>
        </div>
        {messages.length > 0 && (
          <button
            onClick={startNewSession}
            className="text-xs text-stone-400 hover:text-stone-600"
          >
            New session
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-stone-400 py-8">
            <p className="text-sm">Ask any question about this passage.</p>
            <p className="text-xs mt-1 text-stone-300">
              You may write in English or Sanskrit.
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}
        {streaming && messages[messages.length - 1]?.content === '' && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center">
              <Spinner size="sm" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-stone-200 bg-white p-3">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            disabled={streaming}
            placeholder="Ask a question… (Enter to send, Shift+Enter for new line)"
            className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-saffron-500 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || streaming}
            className="shrink-0 bg-saffron-600 hover:bg-saffron-700 disabled:opacity-40 text-white p-2 rounded-lg transition-colors"
          >
            {streaming ? (
              <Spinner size="sm" />
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
