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
    <div style={{ padding: 'min(2rem, 1rem)', maxWidth: 1100, margin: '0 auto' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f0eeff', marginBottom: 4 }}>
          {greeting}, {firstName}
        </h1>
        <p style={{ color: 'rgba(240,238,255,0.4)', fontSize: '0.85rem' }}>
          Aqui está um resumo dos seus chamados
        </p>
      </div>
      {/* Stats Grid */}
      <div className="animate-fade-in-up animate-delay-100" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 24
      }}>
        {[
          {
            label: 'Total de Chamados', value: stats.total,
            icon: <TicketIcon size={18} />, color: 'var(--Acaê-400)',
            bg: 'rgba(139,71,255,0.1)'
          },
          {
            label: 'Em Aberto', value: stats.aberto,
            icon: <AlertTriangle size={18} />, color: '#93c5fd',
            bg: 'rgba(59,130,246,0.1)'
          },
          {
            label: 'Ag. Retorno', value: stats.aguardando_retorno,
            icon: <Loader size={18} />, color: '#f472b6',
            bg: 'rgba(244,114,182,0.1)'
          },
          {
            label: 'Resolvidos', value: stats.resolvido,
            icon: <CheckCircle size={18} />, color: '#6ee7b7',
            bg: 'rgba(16,185,129,0.1)'
          },
        ].map((stat, i) => (
          <div key={i} className="stat-card" style={{ padding: '1rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9, background: stat.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: stat.color, marginBottom: 10,
            }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0eeff', lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(240,238,255,0.4)', marginTop: 4 }}>{stat.label}</div>
          </div>
        ))}
      </div>
      {/* Actions + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}>
        {/* Quick Actions */}
        <div className="animate-fade-in-up animate-delay-200">
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f0eeff', marginBottom: 12 }}>Ações rápidas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/chamados/novo" className="glass-card-hover" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.875rem 1rem', textDecoration: 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: 'linear-gradient(135deg, rgba(139,71,255,0.2), rgba(109,18,238,0.2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Plus size={16} color="var(--Acaê-300)" />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f0eeff' }}>Abrir Chamado</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(240,238,255,0.35)' }}>Criar nova solicitação</div>
                </div>
              </div>
              <ArrowRight size={15} color="rgba(240,238,255,0.25)" />
            </Link>
            <Link href="/chamados" className="glass-card-hover" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.875rem 1rem', textDecoration: 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: 'rgba(59,130,246,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <TicketIcon size={16} color="#93c5fd" />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f0eeff' }}>Meus Chamados</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(240,238,255,0.35)' }}>Ver todas solicitações</div>
                </div>
              </div>
              <ArrowRight size={15} color="rgba(240,238,255,0.25)" />
            </Link>
          </div>
        </div>
        {/* Recent Tickets */}
        <div className="animate-fade-in-up animate-delay-300">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f0eeff' }}>Chamados Recentes</h2>
            <Link href="/chamados" style={{ fontSize: '0.75rem', color: 'var(--Acaê-400)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver todos <ArrowRight size={13} />
            </Link>
          </div>
          <div className="glass-card table-container" style={{ overflow: 'hidden' }}>
            {recentTickets.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center' }}>
                <TicketIcon size={32} color="rgba(139,71,255,0.2)" style={{ marginBottom: 12 }} />
                <p style={{ color: 'rgba(240,238,255,0.3)', fontSize: '0.85rem' }}>Nenhum chamado ainda</p>
                <Link href="/chamados/novo" className="btn-primary" style={{ marginTop: 16, display: 'inline-flex', fontSize: '0.8rem' }}>
                  <Plus size={14} /> Abrir primeiro chamado
                </Link>
              </div>
            ) : (
              <div className="table-container">
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
                          <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--Acaê-300)' }}>
                            {ticket.protocol}
                          </span>
                        </td>
                        <td style={{ fontWeight: 500, minWidth: 160 }}>
                          {ticket.title}
                        </td>
                        <td><AreaBadge area={ticket.area!} /></td>
                        <td><StatusBadge status={ticket.status!} /></td>
                        <td style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.35)', whiteSpace: 'nowrap' }}>
                          {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('pt-BR') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}