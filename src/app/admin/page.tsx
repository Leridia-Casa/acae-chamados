import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import { AppShell } from '@/components/app-shell'

import { AdminDashboardContent } from './admin-dashboard-content'

export default async function AdminPage() {

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  // All stats

  const { count: total } = await supabase.from('tickets').select('*', { count: 'exact', head: true })

  const { count: aberto } = await supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'Aberto')

  const { count: emAndamento } = await supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'Em Andamento')

  const { count: resolvido } = await supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'Resolvido')

  const { count: urgente } = await supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('priority', 'Urgente').neq('status', 'Fechado').neq('status', 'Resolvido')

  const { count: tiTickets } = await supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('area', 'TI')

  const { count: manutTickets } = await supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('area', 'Manutenção')

  const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

  const { data: recentTickets } = await supabase

    .from('tickets')

    .select('*, user:profiles!tickets_user_id_fkey(full_name)')

    .order('created_at', { ascending: false })

    .limit(8)

  return (

    <AppShell>

      <AdminDashboardContent

        stats={{ total: total || 0, aberto: aberto || 0, em_andamento: emAndamento || 0, resolvido: resolvido || 0, urgente: urgente || 0 }}

        areaStats={{ ti: tiTickets || 0, manutencao: manutTickets || 0 }}

        totalUsers={totalUsers || 0}

        recentTickets={recentTickets || []}

      />

    </AppShell>

  )

}
