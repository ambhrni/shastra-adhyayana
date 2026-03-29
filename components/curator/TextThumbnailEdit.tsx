'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  textId: string
  currentThumbnailUrl: string | null
}

export default function TextThumbnailEdit({ textId, currentThumbnailUrl }: Props) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentThumbnailUrl)
  const [isDragging, setIsDragging] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function applyFile(file: File) {
    if (!file.type.startsWith('image/')) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setSaved(false)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) applyFile(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) applyFile(file)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => setIsDragging(false), [])

  function handlePaste(e: React.ClipboardEvent) {
    const file = e.clipboardData.files?.[0]
    if (file?.type.startsWith('image/')) applyFile(file)
  }

  async function handleSave() {
    if (!selectedFile) return
    setSaving(true)
    setError(null)

    try {
      const ext = selectedFile.name.split('.').pop() ?? 'jpg'
      const path = `${textId}-${Date.now()}.${ext}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('text-thumbnails')
        .upload(path, selectedFile, { contentType: selectedFile.type })

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

      const { data: { publicUrl } } = supabase.storage
        .from('text-thumbnails')
        .getPublicUrl(uploadData.path)

      const { error: updateError } = await supabase
        .from('texts')
        .update({ thumbnail_url: publicUrl })
        .eq('id', textId)

      if (updateError) throw new Error(updateError.message)

      setSelectedFile(null)
      setSaved(true)
      setOpen(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="inline-block">
      <button
        onClick={() => { setOpen(o => !o); setError(null) }}
        className="text-xs text-stone-400 hover:text-saffron-600 border border-stone-200 hover:border-saffron-300 px-2 py-1 rounded-md transition-colors"
      >
        {saved ? '✓ Thumbnail saved' : previewUrl ? 'Edit thumbnail' : 'Add thumbnail'}
      </button>

      {open && (
        <div
          className="mt-3 p-4 bg-white border border-stone-200 rounded-xl space-y-3"
          onPaste={handlePaste}
        >
          {previewUrl ? (
            <div
              className="relative group w-full aspect-video rounded-lg overflow-hidden border border-stone-200 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-sm font-medium">Replace image</span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`w-full h-28 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-saffron-500 bg-saffron-50'
                  : 'border-stone-300 bg-stone-50 hover:border-saffron-400 hover:bg-saffron-50/50'
              }`}
            >
              <p className="text-sm text-stone-500 text-center px-4">
                Drop, paste{' '}
                <kbd className="text-xs bg-stone-100 border border-stone-300 px-1 py-0.5 rounded">Ctrl+V</kbd>
                , or <span className="text-saffron-600 font-medium">click to browse</span>
              </p>
              <p className="text-xs text-stone-400 mt-1">JPG, PNG, or WebP</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={!selectedFile || saving}
              className="bg-saffron-600 hover:bg-saffron-700 disabled:opacity-40 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              {saving ? 'Saving…' : 'Save thumbnail'}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="text-xs text-stone-500 hover:text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
