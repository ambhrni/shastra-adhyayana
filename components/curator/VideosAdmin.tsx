'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { VideoChannel, Video } from '@/types/database'

interface ChannelWithVideos extends VideoChannel {
  videos: Video[]
}

interface AddVideoForm {
  youtubeUrl: string
  title: string
  description: string
}

const EMPTY_FORM: AddVideoForm = { youtubeUrl: '', title: '', description: '' }

function extractVideoId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]!
  }
  return null
}

export default function VideosAdmin({ initialChannels }: { initialChannels: ChannelWithVideos[] }) {
  const supabase = createClient()

  const [channels, setChannels] = useState<ChannelWithVideos[]>(initialChannels)
  const [openFormChannelId, setOpenFormChannelId] = useState<string | null>(null)
  const [form, setForm] = useState<AddVideoForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ videoId: string; title: string } | null>(null)
  const [draggedVideoId, setDraggedVideoId] = useState<string | null>(null)
  const [dragOverVideoId, setDragOverVideoId] = useState<string | null>(null)
  // 'all' means syncing all channels; a channel UUID means syncing that one
  const [syncingId, setSyncingId] = useState<string | null>(null)
  const [syncMessages, setSyncMessages] = useState<Record<string, string>>({})

  // ── Channel published toggle ──────────────────────────────────────────────

  async function toggleChannelPublished(channelId: string, current: boolean) {
    const { error: err } = await supabase
      .from('video_channels')
      .update({ is_published: !current })
      .eq('id', channelId)
    if (err) { setError(err.message); return }
    setChannels(prev => prev.map(ch =>
      ch.id === channelId ? { ...ch, is_published: !current } : ch
    ))
  }

  // ── Video published toggle ────────────────────────────────────────────────

  async function toggleVideoPublished(channelId: string, videoId: string, current: boolean) {
    const { error: err } = await supabase
      .from('videos')
      .update({ is_published: !current })
      .eq('id', videoId)
    if (err) { setError(err.message); return }
    setChannels(prev => prev.map(ch =>
      ch.id === channelId
        ? { ...ch, videos: ch.videos.map(v => v.id === videoId ? { ...v, is_published: !current } : v) }
        : ch
    ))
  }

  // ── Add video ─────────────────────────────────────────────────────────────

  function openForm(channelId: string) {
    setOpenFormChannelId(channelId)
    setForm(EMPTY_FORM)
    setError(null)
    setSuccess(null)
  }

  async function handleAddVideo(e: React.FormEvent, channelId: string) {
    e.preventDefault()
    setError(null)

    const videoId = extractVideoId(form.youtubeUrl.trim())
    if (!videoId) {
      setError('Could not extract video ID from that URL. Accepted formats: youtube.com/watch?v=…, youtu.be/…, youtube.com/shorts/…')
      return
    }

    const channel = channels.find(ch => ch.id === channelId)!
    const nextOrder = channel.videos.length > 0
      ? Math.max(...channel.videos.map(v => v.display_order)) + 1
      : 0

    setSaving(true)
    const { data, error: insertErr } = await supabase
      .from('videos')
      .insert({
        channel_id: channelId,
        title: form.title.trim(),
        youtube_url: form.youtubeUrl.trim(),
        video_id: videoId,
        thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        description: form.description.trim() || null,
        display_order: nextOrder,
        is_published: false,
      })
      .select()
      .single()
    setSaving(false)

    if (insertErr) { setError(insertErr.message); return }

    setChannels(prev => prev.map(ch =>
      ch.id === channelId ? { ...ch, videos: [...ch.videos, data as Video] } : ch
    ))
    setOpenFormChannelId(null)
    setForm(EMPTY_FORM)
    setSuccess('Video added.')
    setTimeout(() => setSuccess(null), 3000)
  }

  // ── Delete video ──────────────────────────────────────────────────────────

  async function confirmDelete() {
    if (!deleteConfirm) return
    const { error: err } = await supabase.from('videos').delete().eq('id', deleteConfirm.videoId)
    if (err) { setError(err.message); setDeleteConfirm(null); return }
    setChannels(prev => prev.map(ch => ({
      ...ch,
      videos: ch.videos.filter(v => v.id !== deleteConfirm.videoId),
    })))
    setDeleteConfirm(null)
    setSuccess('Video deleted.')
    setTimeout(() => setSuccess(null), 3000)
  }

  // ── Drag reorder ─────────────────────────────────────────────────────────

  function handleDragStart(videoId: string) {
    setDraggedVideoId(videoId)
  }

  function handleDragOver(e: React.DragEvent, videoId: string) {
    e.preventDefault()
    setDragOverVideoId(videoId)
  }

  async function handleDrop(channelId: string) {
    if (!draggedVideoId || !dragOverVideoId || draggedVideoId === dragOverVideoId) {
      setDraggedVideoId(null)
      setDragOverVideoId(null)
      return
    }

    const channel = channels.find(ch => ch.id === channelId)!
    const videos = [...channel.videos]
    const fromIdx = videos.findIndex(v => v.id === draggedVideoId)
    const toIdx = videos.findIndex(v => v.id === dragOverVideoId)
    if (fromIdx === -1 || toIdx === -1) return

    const reordered = [...videos]
    const [moved] = reordered.splice(fromIdx, 1)
    reordered.splice(toIdx, 0, moved!)

    const updated = reordered.map((v, i) => ({ ...v, display_order: i }))
    setChannels(prev => prev.map(ch => ch.id === channelId ? { ...ch, videos: updated } : ch))
    setDraggedVideoId(null)
    setDragOverVideoId(null)

    // Persist new display_orders
    await Promise.all(
      updated.map(v =>
        supabase.from('videos').update({ display_order: v.display_order }).eq('id', v.id)
      )
    )
  }

  // ── YouTube sync ──────────────────────────────────────────────────────────

  async function handleSync(channelId?: string) {
    const key = channelId ?? 'all'
    setSyncingId(key)
    setSyncMessages(prev => ({ ...prev, [key]: '' }))
    setError(null)

    try {
      const res = await fetch('/api/admin/sync-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(channelId ? { channelId } : {}),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setSyncMessages(prev => ({ ...prev, [key]: `Error: ${data.error ?? 'Sync failed'}` }))
        return
      }

      // Build summary message
      const results = data.results as { channelId: string; channelName: string; added: number; updated: number; error?: string }[]
      const parts = results.map(r =>
        r.error
          ? `${r.channelName}: ${r.error}`
          : `${r.channelName}: ${r.added} added, ${r.updated} updated`
      )
      setSyncMessages(prev => ({ ...prev, [key]: `✓ ${parts.join(' · ')}` }))

      // Refresh video lists for synced channels
      const idsToRefresh = channelId ? [channelId] : channels.map(ch => ch.id)
      for (const cid of idsToRefresh) {
        const { data: updatedVideos } = await supabase
          .from('videos')
          .select('*')
          .eq('channel_id', cid)
          .order('display_order')
        if (updatedVideos) {
          setChannels(prev => prev.map(ch =>
            ch.id === cid ? { ...ch, videos: updatedVideos as Video[] } : ch
          ))
        }
      }
    } catch (err) {
      setSyncMessages(prev => ({ ...prev, [key]: `Error: ${err instanceof Error ? err.message : 'Unknown error'}` }))
    } finally {
      setSyncingId(null)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 ' +
    'placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-saffron-400 transition'

  return (
    <div className="space-y-6">
      {/* Sync all */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => handleSync()}
          disabled={syncingId !== null}
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {syncingId === 'all' ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          )}
          {syncingId === 'all' ? 'Syncing…' : 'Sync all channels'}
        </button>
        {syncMessages['all'] && (
          <p className={`text-sm ${syncMessages['all'].startsWith('✓') ? 'text-green-700' : 'text-red-600'}`}>
            {syncMessages['all']}
          </p>
        )}
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-2.5 rounded-lg">
          {success}
        </div>
      )}
      {error && !openFormChannelId && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-sm px-4 py-2.5 rounded-lg">
          {error}
        </div>
      )}

      {channels.map(channel => (
        <div key={channel.id} className="border border-stone-200 rounded-xl overflow-hidden">
          {/* Channel header */}
          <div className="flex items-center justify-between px-5 py-4 bg-stone-50 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-900 text-sm">{channel.name}</span>
                {channel.subtitle && (
                  <span className="text-xs text-stone-500">— {channel.subtitle}</span>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {channel.videos.length} video{channel.videos.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {/* Per-channel sync */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSync(channel.id)}
                  disabled={syncingId !== null}
                  className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 disabled:opacity-40 border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-md transition-colors"
                >
                  {syncingId === channel.id ? (
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  )}
                  {syncingId === channel.id ? 'Syncing…' : 'Sync from YouTube'}
                </button>
                {syncMessages[channel.id] && (
                  <span className={`text-xs ${syncMessages[channel.id]!.startsWith('✓') ? 'text-green-700' : 'text-red-600'}`}>
                    {syncMessages[channel.id]}
                  </span>
                )}
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <span className="text-xs text-stone-500">Published</span>
                <button
                  type="button"
                  onClick={() => toggleChannelPublished(channel.id, channel.is_published)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    channel.is_published ? 'bg-saffron-600' : 'bg-stone-300'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition duration-200 ease-in-out ${
                    channel.is_published ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </label>
              <a
                href={channel.youtube_channel_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-red-600 hover:text-red-700 underline underline-offset-2"
              >
                YouTube ↗
              </a>
            </div>
          </div>

          {/* Video list */}
          <div className="divide-y divide-stone-100">
            {channel.videos.length === 0 && openFormChannelId !== channel.id && (
              <p className="px-5 py-4 text-sm text-stone-400 italic">No videos yet.</p>
            )}
            {channel.videos.map(video => (
              <div
                key={video.id}
                draggable
                onDragStart={() => handleDragStart(video.id)}
                onDragOver={e => handleDragOver(e, video.id)}
                onDrop={() => handleDrop(channel.id)}
                onDragEnd={() => { setDraggedVideoId(null); setDragOverVideoId(null) }}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  dragOverVideoId === video.id ? 'bg-amber-50' : 'bg-white hover:bg-stone-50'
                } ${draggedVideoId === video.id ? 'opacity-40' : ''}`}
              >
                {/* Drag handle */}
                <div className="cursor-grab active:cursor-grabbing text-stone-300 hover:text-stone-500 shrink-0">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M7 4a1 1 0 100-2 1 1 0 000 2zM7 9a1 1 0 100-2 1 1 0 000 2zM7 14a1 1 0 100-2 1 1 0 000 2zM13 4a1 1 0 100-2 1 1 0 000 2zM13 9a1 1 0 100-2 1 1 0 000 2zM13 14a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                </div>

                {/* Thumbnail */}
                <img
                  src={video.thumbnail_url}
                  alt=""
                  className="w-20 h-[45px] object-cover rounded border border-stone-200 shrink-0"
                />

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 line-clamp-1">{video.title}</p>
                  <a
                    href={video.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-stone-400 hover:text-red-600 transition-colors line-clamp-1"
                    onClick={e => e.stopPropagation()}
                  >
                    {video.youtube_url}
                  </a>
                </div>

                {/* Published toggle */}
                <button
                  type="button"
                  onClick={() => toggleVideoPublished(channel.id, video.id, video.is_published)}
                  title={video.is_published ? 'Published — click to unpublish' : 'Unpublished — click to publish'}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    video.is_published ? 'bg-saffron-600' : 'bg-stone-300'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition duration-200 ease-in-out ${
                    video.is_published ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => setDeleteConfirm({ videoId: video.id, title: video.title })}
                  className="shrink-0 text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded border border-red-200 hover:border-red-300 transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Add video form */}
          {openFormChannelId === channel.id ? (
            <form
              onSubmit={e => handleAddVideo(e, channel.id)}
              className="px-5 py-4 bg-stone-50 border-t border-stone-200 space-y-3"
            >
              <p className="text-xs font-semibold text-stone-600 uppercase tracking-wide">Add video</p>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">YouTube URL *</label>
                <input
                  type="url"
                  required
                  value={form.youtubeUrl}
                  onChange={e => setForm(f => ({ ...f, youtubeUrl: e.target.value }))}
                  placeholder="https://youtube.com/watch?v=… or youtu.be/…"
                  className={inputClass}
                />
              </div>
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
                <label className="block text-xs font-medium text-stone-600 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className={inputClass + ' resize-none'}
                />
              </div>

              {error && openFormChannelId === channel.id && (
                <div className="bg-red-50 border border-red-200 text-red-800 text-xs px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-saffron-600 hover:bg-saffron-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  {saving ? 'Saving…' : 'Add video'}
                </button>
                <button
                  type="button"
                  onClick={() => { setOpenFormChannelId(null); setError(null) }}
                  className="text-sm text-stone-500 hover:text-stone-700 px-3 py-2 rounded-lg border border-stone-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="px-5 py-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => openForm(channel.id)}
                className="text-sm text-saffron-700 hover:text-saffron-800 font-medium transition-colors"
              >
                + Add video
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-semibold text-stone-900">Delete video?</h3>
            <p className="text-sm text-stone-600">
              Delete <span className="font-medium">"{deleteConfirm.title}"</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
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
