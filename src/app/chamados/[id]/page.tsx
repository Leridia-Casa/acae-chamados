import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/app-shell'
import { TicketDetail } from './ticket-detail'

interface Props {
  params: Promise<{ id: string }>
}

export default async function TicketDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: ticket } = await supabase
    .from('tickets')
    .select(`
      *,
      user:profiles!tickets_user_id_fkey(*),
      assigned_user:profiles!tickets_assigned_to_fkey(*),
      comments:ticket_comments(*, user:profiles(*))
    `)
    .eq('id', id)
    .single()

  if (!ticket) notFound()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Check access: user can see own tickets, admin/tecnico can see all
  const isAdmin = profile?.role === 'admin'
  const isTecnico = profile?.role === 'tecnico'
  if (!isAdmin && !isTecnico && ticket.user_id !== user.id) redirect('/chamados')

  return (
    <AppShell>
      <TicketDetail ticket={ticket} currentProfile={profile} />
    </AppShell>
  )
}
