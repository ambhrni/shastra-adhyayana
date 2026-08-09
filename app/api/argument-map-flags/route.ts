import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// PATCH-only -- inserts for argument_map_flags happen directly client-side from
// FlagArgumentMapModal.tsx (RLS already permits self-inserts: user_id = auth.uid()).
// This route exists so curators can update status/response server-side with an
// explicit role check, matching the same belt-and-suspenders pattern as /api/flags --
// RLS already restricts UPDATE to curator/admin too, but checking here as well
// gives a clean 403 instead of a silent RLS-blocked no-op.

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

  // status is optional -- a curator can save/update a response (e.g. a
  // clarifying question) without necessarily closing the flag
  const update: Record<string, any> = {}
  if (status !== undefined) update.status = status
  if (curator_response !== undefined) update.curator_response = curator_response

  const { error } = await supabase
    .from('argument_map_flags')
    .update(update)
    .eq('id', flag_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
