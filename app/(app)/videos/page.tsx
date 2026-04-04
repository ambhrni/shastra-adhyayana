import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import type { VideoChannel, Video } from '@/types/database'

export const metadata: Metadata = {
  title: 'Video Resources — Tattvasudhā',
}

interface ChannelWithVideos extends VideoChannel {
  videos: Video[]
}

function isNew(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 30 * 24 * 60 * 60 * 1000
}

export default async function VideosPage() {
  const supabase = createClient()

  const { data: channelsData } = await supabase
    .from('video_channels')
    .select('*')
    .eq('is_published', true)
    .order('display_order')

  const channels: ChannelWithVideos[] = await Promise.all(
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
    <div className="max-w-screen-2xl mx-auto px-6 pt-10 pb-16">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-stone-900">Video Resources</h1>
        <p className="text-stone-500 mt-1 text-sm">
          Recitations, stotras and dāsa sāhitya for study and practice
        </p>
      </div>

      {channels.length === 0 ? (
        <div className="text-center py-20 text-stone-400">
          <p>No video resources published yet.</p>
        </div>
      ) : (
        <div>
          {channels.map((channel, idx) => (
            <div key={channel.id}>
              <section id={`channel-${channel.id}`}>
                {/* Channel header */}
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-stone-900">{channel.name}</h2>
                    {channel.subtitle && (
                      <p className="text-stone-500 text-sm">{channel.subtitle}</p>
                    )}
                    {channel.description && (
                      <p className="text-stone-400 text-sm mt-1">{channel.description}</p>
                    )}
                  </div>
                  <a
                    href={channel.youtube_channel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-sm text-saffron-600 hover:underline ml-6"
                  >
                    Visit YouTube channel ↗
                  </a>
                </div>

                {channel.videos.length === 0 ? (
                  <div className="py-8 text-center text-sm text-stone-400 border border-dashed border-stone-200 rounded-xl">
                    Videos coming soon
                  </div>
                ) : (
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 max-h-[500px] overflow-y-auto pr-1"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: '#d6d3d1 #f5f5f4' }}
                  >
                    {channel.videos.map(video => (
                      <a
                        key={video.id}
                        href={video.youtube_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group"
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-stone-100">
                          <img
                            src={video.thumbnail_url}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:opacity-85 transition-opacity"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          {isNew(video.created_at) && (
                            <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-700 mt-1.5 line-clamp-2 leading-snug group-hover:text-saffron-600 transition-colors">
                          {video.title}
                        </p>
                      </a>
                    ))}
                  </div>
                )}
              </section>

              {idx < channels.length - 1 && (
                <div className="mt-12 mb-12 border-t border-stone-200" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
