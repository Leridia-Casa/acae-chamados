'use client'
import Link from 'next/link'
import { Profile, Ticket, DashboardStats } from '@/lib/types'
import { StatusBadge, PriorityBadge, AreaBadge } from '@/components/badges'
import { Plus, Ticket as TicketIcon, Clock, CheckCircle, Loader, AlertTriangle, ArrowRight } from 'lucide-react'

interface Props {
  profile: Profile | null
  recentTickets: Partial<Ticket>[]
  stats: DashboardStats
}

export function DashboardContent({ profile, recentTickets, stats }: Props) {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Usuário'
  return (
    <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f0eeff', marginBottom: 4 }}>
          {greeting}, {firstName}
        </h1>
        <p style={{ color: 'rgba(240,238,255,0.45)', fontSize: '0.9rem' }}>
          Aqui está um resumo dos seus chamados
        </p>
      </div>
      {/* Stats Grid */}
      <div className="animate-fade-in-up animate-delay-100" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32
      }}>
        {[
          {
            label: 'Total de Chamados', value: stats.total,
            icon: <TicketIcon size={20} />, color: 'var(--Acaê-400)',
            bg: 'rgba(139,71,255,0.1)'
          },
          {
            label: 'Em Aberto', value: stats.aberto,
            icon: <AlertTriangle size={20} />, color: '#93c5fd',
            bg: 'rgba(59,130,246,0.1)'
          },
          {
            label: 'Em Andamento', value: stats.em_andamento,
            icon: <Loader size={20} />, color: '#fcd34d',
            bg: 'rgba(245,158,11,0.1)'
          },
          {
            label: 'Resolvidos', value: stats.resolvido,
            icon: <CheckCircle size={20} />, color: '#6ee7b7',
            bg: 'rgba(16,185,129,0.1)'
          },
        ].map((stat, i) => (
          <div key={i} className="stat-card">
            <div style={{
              width: 40, height: 40, borderRadius: 10, background: stat.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: stat.color, marginBottom: 12,
            }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f0eeff', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'rgba(240,238,255,0.45)', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>
      {/* Actions + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, alignItems: 'start' }}>
        {/* Quick Actions */}
        <div className="animate-fade-in-up animate-delay-200">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0eeff', marginBottom: 16 }}>Ações rápidas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/chamados/novo" className="glass-card-hover" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.25rem', textDecoration: 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'linear-gradient(135deg, rgba(139,71,255,0.3), rgba(109,18,238,0.3))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Plus size={18} color="var(--Acaê-300)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0eeff' }}>Abrir Chamado</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.4)' }}>Criar nova solicitação</div>
                </div>
              </div>
              <ArrowRight size={16} color="rgba(240,238,255,0.3)" />
            </Link>
            <Link href="/chamados" className="glass-card-hover" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '1rem 1.25rem', textDecoration: 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: 'rgba(59,130,246,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <TicketIcon size={18} color="#93c5fd" />
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0eeff' }}>Meus Chamados</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.4)' }}>Ver todas solicitações</div>
                </div>
              </div>
              <ArrowRight size={16} color="rgba(240,238,255,0.3)" />
            </Link>
          </div>
        </div>
        {/* Recent Tickets */}
        <div className="animate-fade-in-up animate-delay-300">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0eeff' }}>Chamados Recentes</h2>
            <Link href="/chamados" style={{ fontSize: '0.8rem', color: 'var(--Acaê-400)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver todos <ArrowRight size={13} />
            </Link>
          </div>
          <div className="glass-card" style={{ overflow: 'hidden' }}>
            {recentTickets.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <TicketIcon size={32} color="rgba(139,71,255,0.3)" style={{ marginBottom: 12 }} />
                <p style={{ color: 'rgba(240,238,255,0.4)', fontSize: '0.9rem' }}>Nenhum chamado ainda</p>
                <Link href="/chamados/novo" className="btn-primary" style={{ marginTop: 16, display: 'inline-flex', fontSize: '0.85rem' }}>
                  <Plus size={15} /> Abrir primeiro chamado
                </Link>
              </div>
            ) : (
              <table className="Acaê-table">
                <thead>
                  <tr>
                    <th>Protocolo</th>
                    <th>Título</th>
                    <th>Área</th>
                    <th>Status</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.map(ticket => (
                    <tr key={ticket.id} onClick={() => window.location.href = `/chamados/${ticket.id}`}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--Acaê-300)' }}>
                          {ticket.protocol}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {ticket.title}
                      </td>
                      <td><AreaBadge area={ticket.area!} /></td>
                      <td><StatusBadge status={ticket.status!} /></td>
                      <td style={{ fontSize: '0.8rem', color: 'rgba(240,238,255,0.4)' }}>
                        {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('pt-BR') : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}