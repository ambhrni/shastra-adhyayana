import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { passage_id, text_id, status } = await req.json()

  // Check existing progress
  const { data: existing } = await supabase
    .from('user_progress')
    .select('id, study_count, status')
    .eq('user_id', user.id)
    .eq('passage_id', passage_id)
    .single()

  const statusRank: Record<string, number> = {
    not_started: 0, studied: 1, reviewed: 2, mastered: 3,
  }

  // Only upgrade status, never downgrade
  const currentRank = statusRank[existing?.status ?? 'not_started'] ?? 0
  const newRank = statusRank[status] ?? 0
  const finalStatus = newRank >= currentRank ? status : existing?.status

  if (existing) {
    await supabase.from('user_progress').update({
      status: finalStatus,
      study_count: (existing.study_count ?? 0) + 1,
      last_studied_at: new Date().toISOString(),
    }).eq('id', existing.id)
  } else {
    await supabase.from('user_progress').insert({
      user_id: user.id,
      text_id,
      passage_id,
      status: finalStatus,
      study_count: 1,
      last_studied_at: new Date().toISOString(),
    })
  }

  // Update study streak
  const today = new Date().toISOString().split('T')[0]

  const { data: streak } = await supabase
    .from('study_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!streak) {
    await supabase.from('study_streaks').insert({
      user_id: user.id,
      current_streak: 1,
      longest_streak: 1,
      last_study_date: today,
    })
  } else if (streak.last_study_date !== today) {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    const isConsecutive = streak.last_study_date === yesterdayStr

    const newStreak = isConsecutive ? streak.current_streak + 1 : 1
    const newLongest = Math.max(newStreak, streak.longest_streak)

    await supabase.from('study_streaks').update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_study_date: today,
    }).eq('user_id', user.id)
  }

  return NextResponse.json({ ok: true })
}
