/**
 * sync-youtube-channels.ts
 * Fetches all public videos from each YouTube channel stored in
 * video_channels and upserts them into the videos table.
 * New videos are inserted with is_published=false for admin review.
 * Existing videos have title/description/thumbnail refreshed only
 * (is_published and display_order are preserved).
 *
 * USAGE
 *   npx ts-node --project tsconfig.scripts.json scripts/sync-youtube-channels.ts
 *   npx ts-node --project tsconfig.scripts.json scripts/sync-youtube-channels.ts --channel-id <uuid>
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, YOUTUBE_API_KEY
 */

import * as fs   from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'
import { syncChannel } from '@/lib/youtube-sync'

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.warn('Warning: .env.local not found — using existing process.env')
    return
  }
  for (const raw of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue
    const eqIdx = line.indexOf('=')
    if (eqIdx === -1) continue
    const key = line.slice(0, eqIdx).trim()
    if (!process.env[key]) process.env[key] = line.slice(eqIdx + 1).trim()
  }
}
loadEnvLocal()

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY
const YOUTUBE_KEY   = process.env.YOUTUBE_API_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local')
  process.exit(1)
}
if (!YOUTUBE_KEY) {
  console.error('Error: YOUTUBE_API_KEY must be set in .env.local')
  process.exit(1)
}

function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag)
  return idx !== -1 ? process.argv[idx + 1] : undefined
}

const supabase = createClient(SUPABASE_URL!, SERVICE_KEY!)

async function main() {
  const filterChannelId = getArg('--channel-id')

  let query = supabase.from('video_channels').select('id, name, youtube_channel_url').order('display_order')
  if (filterChannelId) query = (query as any).eq('id', filterChannelId)

  const { data: channels, error } = await query
  if (error || !channels) {
    console.error('Failed to fetch channels:', error?.message)
    process.exit(1)
  }

  console.log(`\nSyncing ${channels.length} channel(s) from YouTube...\n`)

  let totalAdded = 0
  let totalUpdated = 0

  for (const channel of channels) {
    process.stdout.write(`  ${channel.name}... `)
    const result = await syncChannel(supabase, channel, YOUTUBE_KEY!)
    if (result.error) {
      console.log(`✗ ${result.error}`)
    } else {
      console.log(`✓  ${result.added} added, ${result.updated} updated`)
      totalAdded   += result.added
      totalUpdated += result.updated
    }
  }

  console.log(`\nDone. Total: ${totalAdded} new videos added, ${totalUpdated} updated.\n`)
}

main().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
