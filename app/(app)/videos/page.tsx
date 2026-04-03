import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import type { VideoChannel, Video } from '@/types/database'

export const metadata: Metadata = {
  title: 'Video Resources — Tattvasudhā',
}

interface ChannelWithVideos extends VideoChannel {
  videos: Video[]
}

export default async function VideosPage() {
  const supabase = createClient()

  const { data: channelsData } = await supabase
    .from('video_channels')
    .select('*')
    .eq('is_published', true)
    .order('display_order')

  const channelPreviews: ChannelWithVideos[] = await Promise.all(
    (channelsData ?? []).map(async ch => {
      const { data: videos } = await supabase
        .from('videos')
        .select('*')
        .eq('channel_id', ch.id)
        .eq('is_published', true)
        .order('display_order')
      return { ...ch, videos: videos ?? [] }
    })
  )

  return (
    <div className="max-w-5xl mx-auto px-6 pt-10 pb-16">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-stone-900">Video Resources</h1>
        <p className="text-stone-500 mt-1 text-sm">
          Vedic recitations, devotional music, and scholarly lectures curated for study.
        </p>
      </div>

      {channelPreviews.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p>No video resources published yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {channelPreviews.map(channel => (
            <div key={channel.id}>
              {/* Channel header */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-stone-900">{channel.name}</h2>
                {channel.subtitle && (
                  <p className="text-stone-500 text-sm">{channel.subtitle}</p>
                )}
                {channel.description && (
                  <p className="text-stone-500 text-sm mt-1">{channel.description}</p>
                )}
                <a
                  href={channel.youtube_channel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-saffron-600 hover:underline mt-1 inline-block"
                >
                  Visit YouTube channel ↗
                </a>
              </div>

              {/* Videos grid — 2 columns within each channel */}
              {channel.videos.length === 0 ? (
                <div className="py-8 text-center text-sm text-stone-400 border border-dashed border-stone-200 rounded-xl">
                  Videos coming soon
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {channel.videos.map(video => (
                    <a
                      key={video.id}
                      href={video.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="aspect-video overflow-hidden rounded-lg bg-stone-100 relative">
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/60 rounded-full p-2">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-stone-700 mt-1 line-clamp-2 leading-snug">
                        {video.title}
                      </p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
