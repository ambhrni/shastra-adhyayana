import { createClient } from '@/lib/supabase/server'
import TextCard from '@/components/library/TextCard'
import NotebookCard from '@/components/notebooks/NotebookCard'
import Link from 'next/link'

function isNew(createdAt: string): boolean {
  return Date.now() - new Date(createdAt).getTime() < 30 * 24 * 60 * 60 * 1000
}

function ColumnHeader({
  title,
  subtitle,
  channelId,
}: {
  title: string
  subtitle?: string
  channelId?: string
}) {
  return (
    <div className="sticky top-0 bg-stone-50 pt-2 pb-2 z-10">
      {channelId ? (
        <Link
          href={`/videos#channel-${channelId}`}
          className="text-xs font-semibold tracking-widest uppercase text-stone-500 hover:text-saffron-600 transition-colors"
        >
          {title}
        </Link>
      ) : (
        <h2 className="text-xs font-semibold tracking-widest uppercase text-stone-500">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-xs text-stone-500 italic mt-1">{subtitle}</p>
      )}
      <div className="w-8 h-0.5 bg-saffron-500 rounded-full mt-1 mb-4" />
    </div>
  )
}

type VideoItem = {
  id: string
  title: string
  thumbnail_url: string | null
  youtube_url: string
  created_at: string
}

type Channel = {
  id: string
  name: string
  subtitle: string | null
  youtube_channel_url: string | null
  videos: VideoItem[]
}

function VideoColumn({ channel }: { channel: Channel | null }) {
  if (!channel) {
    return (
      <div className="text-center py-16 text-stone-400">
        <p className="text-sm">Videos coming soon</p>
      </div>
    )
  }

  return (
    <div>
      <div
        className="max-h-[700px] overflow-y-auto pr-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#d6d3d1 #f5f5f4' }}
      >
        {channel.videos.length === 0 ? (
          <p className="text-sm text-stone-400 py-4">No videos yet.</p>
        ) : (
          channel.videos.map((video) => (
            <a
              key={video.id}
              href={video.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2.5 items-start group mb-3 last:mb-0"
            >
              <div className="relative shrink-0 w-24 aspect-video rounded-lg overflow-hidden bg-stone-100">
                {video.thumbnail_url && (
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:opacity-85 transition-opacity"
                  />
                )}
                {/* Play overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                {/* NEW badge */}
                {isNew(video.created_at) && (
                  <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-semibold px-1 rounded">
                    NEW
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-stone-700 line-clamp-2 leading-snug group-hover:text-saffron-600 transition-colors">
                  {video.title}
                </p>
              </div>
            </a>
          ))
        )}
      </div>
      <div className="flex gap-3 mt-3 pt-2 border-t border-stone-100">
        <Link
          href={`/videos#channel-${channel.id}`}
          className="text-xs text-saffron-600 hover:underline"
        >
          View all →
        </Link>
        {channel.youtube_channel_url && (
          <a
            href={channel.youtube_channel_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-stone-400 hover:text-stone-600"
          >
            YouTube ↗
          </a>
        )}
      </div>
    </div>
  )
}

export default async function LibraryPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { data: profile },
    { data: texts },
    { data: notebooks },
    { data: channelsData },
  ] = await Promise.all([
    user
      ? supabase.from('user_profiles').select('display_name').eq('id', user.id).single()
      : Promise.resolve({ data: null }),
    supabase
      .from('texts')
      .select('id, title, title_transliterated, author, description, thumbnail_url, is_published, created_at')
      .eq('is_published', true)
      .order('created_at'),
    supabase
      .from('notebooks')
      .select('*')
      .eq('is_published', true)
      .order('display_order'),
    supabase
      .from('video_channels')
      .select('id, name, subtitle, youtube_channel_url')
      .eq('is_published', true)
      .order('display_order'),
  ])

  // Fetch top 10 published videos per channel
  const channelPreviews: Channel[] = await Promise.all(
    (channelsData ?? []).map(async (ch: any) => {
      const { data: videos } = await supabase
        .from('videos')
        .select('id, title, thumbnail_url, youtube_url, created_at')
        .eq('channel_id', ch.id)
        .eq('is_published', true)
        .order('display_order')
      return { ...ch, videos: videos ?? [] }
    })
  )

  const channel1: Channel | null = channelPreviews[0] ?? null
  const channel2: Channel | null = channelPreviews[1] ?? null

  // Per-text: passage counts + progress + first/resume passage id
  const textData = await Promise.all(
    (texts ?? []).map(async (text) => {
      const { count: totalCount } = await supabase
        .from('passages')
        .select('*', { count: 'exact', head: true })
        .eq('text_id', text.id)
        .eq('is_approved', true)

      const { data: firstRows } = await supabase
        .from('passages')
        .select('id')
        .eq('text_id', text.id)
        .eq('is_approved', true)
        .order('sequence_order')
        .limit(1)
      const firstPassageId = firstRows?.[0]?.id ?? null

      if (!user) {
        return { text, progressPercent: null, firstUnfinishedPassageId: firstPassageId }
      }

      const { data: progressRows } = await supabase
        .from('user_progress')
        .select('passage_id')
        .eq('user_id', user.id)
        .eq('text_id', text.id)
        .neq('status', 'not_started')

      const studiedIds = (progressRows ?? []).map(r => r.passage_id)
      const total = totalCount ?? 0
      const percent = total > 0 ? Math.round((studiedIds.length / total) * 100) : 0

      let resumeId = firstPassageId
      if (studiedIds.length > 0) {
        const { data: nextRows } = await supabase
          .from('passages')
          .select('id')
          .eq('text_id', text.id)
          .eq('is_approved', true)
          .not('id', 'in', `(${studiedIds.map(id => `"${id}"`).join(',')})`)
          .order('sequence_order')
          .limit(1)
        resumeId = nextRows?.[0]?.id ?? null
      }

      return { text, progressPercent: percent, firstUnfinishedPassageId: resumeId }
    })
  )

  const firstName = (profile as any)?.display_name?.split(' ')[0] ?? null

  return (
    <div className="max-w-screen-2xl mx-auto px-8 pt-10 pb-6">
      {/* Greeting */}
      <div className="mb-10">
        {firstName ? (
          <>
            <h1 className="text-2xl font-semibold text-stone-900">
              Namaste, {firstName}!
            </h1>
            <p className="font-devanagari text-lg text-saffron-700 mt-1">
              तत्त्वसुधायां स्वागतम्
            </p>
          </>
        ) : (
          <>
            <h1 className="font-devanagari text-2xl font-semibold text-stone-900">
              तत्त्वसुधायां स्वागतम्
            </h1>
            <p className="text-stone-500 mt-1">Welcome to Tattvasudhā</p>
          </>
        )}
      </div>

      {/* Four-column layout */}
      <div className="flex flex-col lg:flex-row gap-0 items-stretch">

        {/* Column 1 — Self-Study Courses */}
        <div className="lg:w-1/4 flex flex-col">
          <ColumnHeader
            title="Shāstram : Self-Study Courses"
            subtitle="Learn with mūla & commentary texts, full argument map, AI chat/tutor, info/concepts & search embedded reference texts"
          />
          {textData.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <p>No texts published yet.</p>
            </div>
          ) : (
            <div
              className="max-h-[700px] overflow-y-auto pr-1 flex flex-col gap-5"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#d6d3d1 #f5f5f4' }}
            >
              {textData.map(({ text, progressPercent, firstUnfinishedPassageId }) => (
                <div key={text.id} className="min-h-[280px] flex flex-col">
                  <TextCard
                    text={text as any}
                    progressPercent={progressPercent}
                    firstUnfinishedPassageId={firstUnfinishedPassageId}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Divider 1 */}
        <div className="hidden lg:block w-px bg-stone-200 self-stretch mx-1" />

        {/* Column 2 — NotebookLMs */}
        <div className="lg:w-1/4 flex flex-col">
          <ColumnHeader
            title="NotebookLMs"
            subtitle="Curated sources, learning & teaching aids with all NotebookLM features"
          />
          {(notebooks ?? []).length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <p className="font-devanagari">ज्ञानकोशः प्रस्तूयते</p>
              <p className="text-sm mt-1">Notebooks coming soon</p>
            </div>
          ) : (
            <div
              className="space-y-5 max-h-[700px] overflow-y-auto pr-1"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#d6d3d1 #f5f5f4' }}
            >
              {(notebooks ?? []).map(nb => (
                <NotebookCard key={nb.id} notebook={nb} />
              ))}
            </div>
          )}
        </div>

        {/* Divider 2 */}
        <div className="hidden lg:block w-px bg-stone-200 self-stretch mx-1" />

        {/* Column 3 — Vēda & Stotra Recitation */}
        <div className="lg:w-1/4 flex flex-col">
          <ColumnHeader
            title="Vēda & Stotra"
            subtitle={channel1?.subtitle ?? 'Narayanan Venkataraman'}
            channelId={channel1?.id}
          />
          <VideoColumn channel={channel1} />
        </div>

        {/* Divider 3 */}
        <div className="hidden lg:block w-px bg-stone-200 self-stretch mx-1" />

        {/* Column 4 — Dāsa Sāhitya */}
        <div className="lg:w-1/4 flex flex-col">
          <ColumnHeader
            title="Dāsa Sāhitya"
            subtitle={channel2?.subtitle ?? 'Srirangam Ananda Rao'}
            channelId={channel2?.id}
          />
          <VideoColumn channel={channel2} />
        </div>

      </div>
    </div>
  )
}
