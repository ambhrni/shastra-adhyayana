import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import type { VideoChannel, Video } from '@/types/database'
import VideoCarousel from '@/components/videos/VideoCarousel'

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
    <div className="max-w-5xl mx-auto px-6 pt-10 pb-16">
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
                  <VideoCarousel videos={channel.videos} compact={false} />
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
