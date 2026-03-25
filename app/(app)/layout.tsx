import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('display_name, role')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar
        displayName={profile?.display_name ?? user.email ?? 'User'}
        role={profile?.role ?? 'learner'}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
