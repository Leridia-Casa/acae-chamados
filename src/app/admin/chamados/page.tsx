import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/app-shell'
import { AdminTicketsClient } from './admin-tickets-client'

export default async function AdminChamadosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'admin' && profile?.role !== 'tecnico') redirect('/dashboard')
  let query = supabase
    .from('tickets')
    .select('*, user:profiles!tickets_user_id_fkey(full_name, email)')
    .order('created_at', { ascending: false })
  // Technicians only see their area
  if (profile?.role === 'tecnico' && profile?.area) {
    query = query.eq('area', profile.area) as typeof query
  }
  const { data: tickets } = await query
  return (
    <AppShell>
      <AdminTicketsClient tickets={tickets || []} isAdmin={profile?.role === 'admin'} />
    </AppShell>
  )
}