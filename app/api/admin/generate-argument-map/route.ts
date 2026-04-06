import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { generateArgumentMap } from '@/lib/argument-map-generator'

export async function POST(req: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !['curator', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  let body: { passageId?: string; model?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { passageId, model = 'claude-sonnet-4-6' } = body

  if (!passageId) {
    return NextResponse.json({ error: 'passageId is required' }, { status: 400 })
  }

  const anthropic = new Anthropic({ apiKey })

  try {
    const result = await generateArgumentMap(supabase, anthropic, passageId, model)
    return NextResponse.json({
      success: true,
      nodes: result.nodes,
      streamCounts: result.streamCounts,
      totalCount: result.totalCount,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? 'Generation failed' },
      { status: 500 },
    )
  }
}
