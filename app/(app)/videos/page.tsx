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

      <div className="space-y-14">
        {channelPreviews.map(channel => (
          <section key={channel.id}>
            {/* Channel header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-stone-900">{channel.name}</h2>
                {channel.subtitle && (
                  <p className="text-sm text-stone-500 mt-0.5">{channel.subtitle}</p>
                )}
                {channel.description && (
                  <p className="text-sm text-stone-600 mt-2 max-w-xl leading-relaxed">
                    {channel.description}
                  </p>
                )}
              </div>
              <a
                href={channel.youtube_channel_url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                View channel
              </a>
            </div>

            {/* Video grid */}
            {channel.videos.length === 0 ? (
              <div className="py-10 text-center text-sm text-stone-400 border border-dashed border-stone-200 rounded-xl">
                Videos coming soon
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {channel.videos.map(video => (
                  <a
                    key={video.id}
                    href={video.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-full aspect-video overflow-hidden bg-stone-100">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <div className="bg-red-600 rounded-full p-3 shadow-lg">
                          <svg className="w-5 h-5 text-white translate-x-0.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-stone-800 leading-snug line-clamp-2">
                        {video.title}
                      </p>
                      {video.description && (
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>
        ))}

        {channelPreviews.length === 0 && (
          <div className="text-center py-20 text-stone-400">
            <p>No video resources published yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
