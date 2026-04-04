import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { generateArgumentMap, ARGUMENT_STREAMS } from '@/lib/argument-map-generator'
import type { ArgumentStream } from '@/lib/argument-map-generator'

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

  let body: { passageId?: string; stream?: string; model?: string } = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { passageId, stream, model = 'claude-sonnet-4-6' } = body

  if (!passageId) {
    return NextResponse.json({ error: 'passageId is required' }, { status: 400 })
  }
  if (!stream || !ARGUMENT_STREAMS.includes(stream as ArgumentStream)) {
    return NextResponse.json(
      { error: `stream must be one of: ${ARGUMENT_STREAMS.join(', ')}` },
      { status: 400 }
    )
  }

  const anthropic = new Anthropic({ apiKey })

  try {
    const result = await generateArgumentMap(
      supabase,
      anthropic,
      passageId,
      stream as ArgumentStream,
      model,
    )
    return NextResponse.json({
      success: true,
      nodes: result.nodes,
      versionNumber: result.versionNumber,
      nodeCount: result.nodeCount,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message ?? 'Generation failed' },
      { status: 500 }
    )
  }
}
