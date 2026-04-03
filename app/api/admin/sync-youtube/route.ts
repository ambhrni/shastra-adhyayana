import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncChannel, type SyncResult } from '@/lib/youtube-sync'

export async function POST(req: Request) {
  const supabase = createClient()

  // Auth + role check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'YOUTUBE_API_KEY not configured' }, { status: 500 })
  }

  // Optional: sync only a specific channel
  let body: { channelId?: string } = {}
  try { body = await req.json() } catch { /* empty body is fine */ }

  let query = supabase
    .from('video_channels')
    .select('id, name, youtube_channel_url')
    .order('display_order')
  if (body.channelId) {
    query = (query as any).eq('id', body.channelId)
  }

  const { data: channels, error: fetchErr } = await query
  if (fetchErr || !channels) {
    return NextResponse.json({ error: fetchErr?.message ?? 'Failed to fetch channels' }, { status: 500 })
  }

  const results: SyncResult[] = []
  for (const channel of channels) {
    const result = await syncChannel(supabase, channel, apiKey)
    results.push(result)
  }

  return NextResponse.json({ success: true, results })
}
