/**
 * youtube-sync.ts
 * Core sync logic shared between the CLI script and the API route.
 * No Next.js imports — works in plain Node and edge/server contexts.
 */

export interface SyncResult {
  channelName: string
  channelId: string
  added: number
  updated: number
  error?: string
}

function extractHandle(url: string): string | null {
  const m = url.match(/@([^/?&#]+)/)
  return m?.[1] ?? null
}

async function resolveYouTubeChannelId(
  handle: string,
  apiKey: string,
): Promise<string | null> {
  const url =
    `https://www.googleapis.com/youtube/v3/channels` +
    `?part=id&forHandle=${encodeURIComponent(handle)}&key=${apiKey}`
  const res = await fetch(url)
  const data = await res.json() as { items?: { id: string }[] }
  return data.items?.[0]?.id ?? null
}

interface YTVideo {
  video_id: string
  title: string
  description: string
  thumbnail_url: string
  youtube_url: string
}

async function fetchAllChannelVideos(
  ytChannelId: string,
  apiKey: string,
): Promise<YTVideo[]> {
  const videos: YTVideo[] = []
  let pageToken: string | undefined

  do {
    const params = new URLSearchParams({
      part: 'snippet',
      channelId: ytChannelId,
      type: 'video',
      maxResults: '50',
      order: 'date',
      key: apiKey,
    })
    if (pageToken) params.set('pageToken', pageToken)

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${params}`,
    )
    const data = await res.json() as {
      items?: {
        id: { videoId?: string }
        snippet: {
          title: string
          description: string
          thumbnails: {
            maxres?: { url: string }
            high?: { url: string }
            default?: { url: string }
          }
        }
      }[]
      nextPageToken?: string
    }

    for (const item of data.items ?? []) {
      const videoId = item.id?.videoId
      if (!videoId) continue
      const s = item.snippet
      videos.push({
        video_id: videoId,
        title: s.title ?? '',
        description: (s.description ?? '').slice(0, 500),
        thumbnail_url:
          s.thumbnails?.maxres?.url ??
          s.thumbnails?.high?.url ??
          s.thumbnails?.default?.url ??
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        youtube_url: `https://www.youtube.com/watch?v=${videoId}`,
      })
    }

    pageToken = data.nextPageToken
  } while (pageToken)

  return videos
}

export async function syncChannel(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  channel: { id: string; name: string; youtube_channel_url: string },
  apiKey: string,
): Promise<SyncResult> {
  const handle = extractHandle(channel.youtube_channel_url)
  if (!handle) {
    return {
      channelName: channel.name,
      channelId: channel.id,
      added: 0,
      updated: 0,
      error: 'Could not extract @handle from youtube_channel_url',
    }
  }

  const ytChannelId = await resolveYouTubeChannelId(handle, apiKey)
  if (!ytChannelId) {
    return {
      channelName: channel.name,
      channelId: channel.id,
      added: 0,
      updated: 0,
      error: `Could not resolve YouTube channel ID for @${handle}`,
    }
  }

  const videos = await fetchAllChannelVideos(ytChannelId, apiKey)
  if (videos.length === 0) {
    return { channelName: channel.name, channelId: channel.id, added: 0, updated: 0 }
  }

  // Split into new vs existing to preserve is_published / display_order
  const { data: existing } = await supabase
    .from('videos')
    .select('video_id')
    .eq('channel_id', channel.id)
    .in('video_id', videos.map(v => v.video_id))

  const existingIds = new Set(((existing ?? []) as { video_id: string }[]).map(e => e.video_id))
  const newVideos   = videos.filter(v => !existingIds.has(v.video_id))
  const toUpdate    = videos.filter(v =>  existingIds.has(v.video_id))

  if (newVideos.length > 0) {
    await supabase.from('videos').insert(
      newVideos.map(v => ({
        channel_id: channel.id,
        ...v,
        is_published: false,
        display_order: 0,
      })),
    )
  }

  for (const v of toUpdate) {
    await supabase
      .from('videos')
      .update({
        title: v.title,
        description: v.description,
        thumbnail_url: v.thumbnail_url,
      })
      .eq('channel_id', channel.id)
      .eq('video_id', v.video_id)
  }

  return {
    channelName: channel.name,
    channelId: channel.id,
    added: newVideos.length,
    updated: toUpdate.length,
  }
}
