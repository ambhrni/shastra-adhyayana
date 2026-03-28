'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Notebook } from '@/types/database'

interface FormState {
  title: string
  topic_area: string
  description: string
  notebooklm_url: string
  display_order: number
  is_published: boolean
}

const EMPTY_FORM: FormState = {
  title: '',
  topic_area: '',
  description: '',
  notebooklm_url: '',
  display_order: 0,
  is_published: false,
}

export default function NotebooksAdmin({ initialNotebooks }: { initialNotebooks: Notebook[] }) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [notebooks, setNotebooks] = useState<Notebook[]>(initialNotebooks)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  function openAdd() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
    setSuccess(null)
    setShowForm(true)
  }

  function openEdit(nb: Notebook) {
    setEditingId(nb.id)
    setForm({
      title: nb.title,
      topic_area: nb.topic_area,
      description: nb.description ?? '',
      notebooklm_url: nb.notebooklm_url,
      display_order: nb.display_order ?? 0,
      is_published: nb.is_published ?? false,
    })
    setSelectedFile(null)
    setPreviewUrl(nb.thumbnail_url ?? null)
    setError(null)
    setSuccess(null)
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setSelectedFile(null)
    setPreviewUrl(null)
    setError(null)
  }

  function applyFile(file: File) {
    if (!file.type.startsWith('image/')) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      let thumbnailUrl: string | null =
        editingId ? (notebooks.find(n => n.id === editingId)?.thumbnail_url ?? null) : null

      if (selectedFile) {
        const ext = selectedFile.name.split('.').pop() ?? 'jpg'
        const path = `${Date.now()}.${ext}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('notebook-thumbnails')
          .upload(path, selectedFile, { contentType: selectedFile.type })

        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`)

        const { data: { publicUrl } } = supabase.storage
          .from('notebook-thumbnails')
          .getPublicUrl(uploadData.path)
        thumbnailUrl = publicUrl
      }

      const payload = {
        title: form.title,
        topic_area: form.topic_area,
        description: form.description || null,
        notebooklm_url: form.notebooklm_url,
        display_order: form.display_order,
        is_published: form.is_published,
        thumbnail_url: thumbnailUrl,
        updated_at: new Date().toISOString(),
      }

      if (editingId) {
        const { data, error: updateError } = await supabase
          .from('notebooks')
          .update(payload)
          .eq('id', editingId)
          .select()
          .single()
        if (updateError) throw new Error(updateError.message)
        setNotebooks(prev => prev.map(n => n.id === editingId ? (data as Notebook) : n))
        setSuccess('Notebook updated successfully.')
      } else {
        const { data, error: insertError } = await supabase
          .from('notebooks')
          .insert(payload)
          .select()
          .single()
        if (insertError) throw new Error(insertError.message)
        setNotebooks(prev => [...prev, data as Notebook])
        setSuccess('Notebook added successfully.')
      }

      setShowForm(false)
      setEditingId(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    const { error: deleteError } = await supabase.from('notebooks').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
    } else {
      setNotebooks(prev => prev.filter(n => n.id !== id))
      setSuccess('Notebook deleted.')
    }
    setDeleteConfirmId(null)
  }

  const inputClass =
    'w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 ' +
    'placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 transition'

  const deleteTarget = notebooks.find(n => n.id === deleteConfirmId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">
          {notebooks.length} notebook{notebooks.length !== 1 ? 's' : ''} total
        </p>
        {!showForm && (
          <button
            onClick={openAdd}
            className="bg-saffron-600 hover:bg-saffron-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add notebook
          </button>
        )}
      </div>

      {/* Status messages */}
      {success && !showForm && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-2.5 rounded-lg">
          {success}
        </div>
      )}
      {error && !showForm && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-2.5 rounded-lg">
          {error}
        </div>
      )}

      {/* Add / Edit form */}
      {showForm && (
        <form
          onSubmit={handleSave}
          onPaste={handlePaste}
          className="bg-stone-50 border border-stone-200 rounded-xl p-6 space-y-4"
        >
          <h3 className="text-base font-semibold text-stone-800">
            {editingId ? 'Edit notebook' : 'Add notebook'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Topic area *</label>
              <input
                type="text"
                required
                value={form.topic_area}
                onChange={e => setForm(f => ({ ...f, topic_area: e.target.value }))}
                placeholder="e.g. Vādāvalī, Nyāya-śāstra"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className={inputClass + ' resize-none'}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">NotebookLM URL *</label>
            <input
              type="url"
              required
              value={form.notebooklm_url}
              onChange={e => setForm(f => ({ ...f, notebooklm_url: e.target.value }))}
              placeholder="https://notebooklm.google.com/notebook/..."
              className={inputClass}
            />
          </div>

          {/* Thumbnail — drop / paste / browse */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Thumbnail</label>
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
                className={`w-full aspect-video rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-saffron-500 bg-saffron-50'
                    : 'border-stone-300 bg-stone-50 hover:border-saffron-400 hover:bg-saffron-50/50'
                }`}
              >
                <svg className="w-8 h-8 text-stone-300 mb-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 21h18M3.75 3h16.5M12 3v1m0 16v1" />
                </svg>
                <p className="text-sm text-stone-500 text-center px-4">
                  Drop image here, paste{' '}
                  <kbd className="text-xs bg-stone-100 border border-stone-300 px-1 py-0.5 rounded">
                    Ctrl+V
                  </kbd>
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
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">Display order</label>
              <input
                type="number"
                value={form.display_order}
                onChange={e => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))}
                className={inputClass}
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="is_published"
                checked={form.is_published}
                onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))}
                className="rounded border-stone-300 text-saffron-600 focus:ring-saffron-400"
              />
              <label htmlFor="is_published" className="text-sm text-stone-700">Published</label>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="bg-saffron-600 hover:bg-saffron-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add notebook'}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="text-sm text-stone-500 hover:text-stone-700 px-4 py-2 rounded-lg border border-stone-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      {notebooks.length === 0 ? (
        <p className="text-sm text-stone-400 italic text-center py-8">
          No notebooks yet. Add the first one above.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left text-xs font-medium text-stone-500 uppercase tracking-wide">
                <th className="pb-2 pr-4">Thumbnail</th>
                <th className="pb-2 pr-4">Title</th>
                <th className="pb-2 pr-4 hidden sm:table-cell">Topic area</th>
                <th className="pb-2 pr-4 hidden md:table-cell text-center">Order</th>
                <th className="pb-2 pr-4 text-center">Published</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {notebooks.map(nb => (
                <tr key={nb.id} className="group">
                  <td className="py-3 pr-4">
                    {nb.thumbnail_url ? (
                      <img
                        src={nb.thumbnail_url}
                        alt=""
                        className="w-16 h-10 object-cover rounded border border-stone-200"
                      />
                    ) : (
                      <div className="w-16 h-10 rounded border border-stone-200 bg-gradient-to-br from-saffron-500 to-amber-600 flex items-center justify-center">
                        <span className="text-white text-xs font-medium opacity-70 text-center leading-none px-1">
                          {nb.topic_area.slice(0, 3)}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="font-medium text-stone-800 line-clamp-1">{nb.title}</span>
                  </td>
                  <td className="py-3 pr-4 hidden sm:table-cell">
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      {nb.topic_area}
                    </span>
                  </td>
                  <td className="py-3 pr-4 hidden md:table-cell text-center text-stone-500">
                    {nb.display_order}
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${nb.is_published ? 'bg-green-500' : 'bg-stone-300'}`} />
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(nb)}
                        className="text-xs text-stone-500 hover:text-stone-800 px-2 py-1 rounded border border-stone-200 hover:border-stone-300 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(nb.id)}
                        className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded border border-red-200 hover:border-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteConfirmId && deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-semibold text-stone-900">Delete notebook?</h3>
            <p className="text-sm text-stone-600">
              Delete <span className="font-medium">"{deleteTarget.title}"</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
