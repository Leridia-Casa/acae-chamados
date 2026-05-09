import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

import { AppShell } from '@/components/app-shell'

import { DashboardContent } from './dashboard-content'

export default async function DashboardPage() {

  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase

    .from('profiles')

    .select('*')

    .eq('id', user.id)

    .single()

  // Get stats

  const { data: myTickets } = await supabase

    .from('tickets')

    .select('id, status, priority, area, title, protocol, created_at')

    .eq('user_id', user.id)

    .order('created_at', { ascending: false })

    .limit(5)

  const { count: totalCount } = await supabase

    .from('tickets')

    .select('*', { count: 'exact', head: true })

    .eq('user_id', user.id)

  const { count: openCount } = await supabase

    .from('tickets')

    .select('*', { count: 'exact', head: true })

    .eq('user_id', user.id)

    .eq('status', 'Aberto')

  const { count: progressCount } = await supabase

    .from('tickets')

    .select('*', { count: 'exact', head: true })

    .eq('user_id', user.id)

    .eq('status', 'Em Andamento')

  const { count: resolvedCount } = await supabase

    .from('tickets')

    .select('*', { count: 'exact', head: true })

    .eq('user_id', user.id)

    .eq('status', 'Resolvido')

  return (

    <AppShell>

      <DashboardContent

        profile={profile}

        recentTickets={myTickets || []}

        stats={{

          total: totalCount || 0,

          aberto: openCount || 0,

          em_andamento: progressCount || 0,

          resolvido: resolvedCount || 0,

          urgente: 0,

        }}

      />

    </AppShell>

  )

}
