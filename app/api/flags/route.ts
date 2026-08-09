import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { passage_id, commentator_id, description_of_error } = await req.json()

  const { error } = await supabase.from('flagged_errors').insert({
    passage_id,
    commentator_id: commentator_id || null,
    flagged_by: user.id,
    description_of_error,
    status: 'open',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()
  if (!profile || !['curator', 'admin'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { flag_id, status, curator_response } = await req.json()

  // status is optional now -- a curator can save/update a response (e.g. a
  // clarifying question) without necessarily closing the flag
  const update: Record<string, any> = {}
  if (status !== undefined) {
    update.status = status
    update.resolved_at = status !== 'open' ? new Date().toISOString() : null
    update.resolved_by = status !== 'open' ? user.id : null
  }
  if (curator_response !== undefined) update.curator_response = curator_response

  await supabase.from('flagged_errors').update(update).eq('id', flag_id)

  return NextResponse.json({ ok: true })
}
