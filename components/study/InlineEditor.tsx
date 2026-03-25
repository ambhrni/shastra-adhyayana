'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Spinner from '@/components/ui/Spinner'

interface InlineEditorProps {
  table: 'passages' | 'commentaries'
  field: 'mula_text' | 'mula_transliterated' | 'commentary_text' | 'commentary_transliterated'
  recordId: string
  initialValue: string
  isDevanagari?: boolean
  displayClassName?: string
  renderDisplay?: (text: string) => React.ReactNode
}

export default function InlineEditor({
  table, field, recordId, initialValue, isDevanagari = false, displayClassName, renderDisplay
}: InlineEditorProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initialValue)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from(table).update({ [field]: value }).eq('id', recordId)
    setSaving(false)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!editing) {
    return (
      <div className="group relative">
        <span className={[isDevanagari ? 'font-devanagari' : '', displayClassName ?? ''].join(' ').trim()}>
          {renderDisplay ? renderDisplay(value) : value}
        </span>
        <button
          onClick={() => setEditing(true)}
          title="Edit (curator)"
          className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity text-stone-400 hover:text-saffron-600"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
          </svg>
        </button>
        {saved && <span className="ml-2 text-xs text-emerald-600">Saved</span>}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={e => setValue(e.target.value)}
        rows={6}
        className={`w-full px-3 py-2 border border-saffron-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 resize-y ${isDevanagari ? 'font-devanagari' : ''}`}
        autoFocus
      />
      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 bg-saffron-600 hover:bg-saffron-700 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
        >
          {saving ? <Spinner size="sm" /> : null}
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          onClick={() => { setEditing(false); setValue(initialValue) }}
          className="text-xs text-stone-500 hover:text-stone-700 px-3 py-1.5"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
