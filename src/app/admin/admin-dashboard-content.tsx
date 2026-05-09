'use client'

import Link from 'next/link'
import { DashboardStats, Ticket } from '@/lib/types'
import { StatusBadge, PriorityBadge, AreaBadge } from '@/components/badges'
import {
  Ticket as TicketIcon, Users, Monitor, Wrench,
  AlertTriangle, Loader, CheckCircle, ArrowRight, TrendingUp
} from 'lucide-react'

interface Props {
  stats: DashboardStats
  areaStats: { ti: number; manutencao: number }
  totalUsers: number
  recentTickets: (Partial<Ticket> & { user?: { full_name: string } })[]
}

export function AdminDashboardContent({ stats, areaStats, totalUsers, recentTickets }: Props) {
  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f0eeff', marginBottom: 4 }}>
          Painel Administrativo
        </h1>
        <p style={{ color: 'rgba(240,238,255,0.45)', fontSize: '0.875rem' }}>
          Visão geral de todos os chamados e usuários
        </p>
      </div>

      {/* Stats Row 1 */}
      <div className="animate-fade-in-up animate-delay-100" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 20
      }}>
        {[
          { label: 'Total Chamados', value: stats.total, icon: <TicketIcon size={18} />, color: 'var(--Aca�-400)', bg: 'rgba(139,71,255,0.1)' },
          { label: 'Em Aberto', value: stats.aberto, icon: <AlertTriangle size={18} />, color: '#93c5fd', bg: 'rgba(59,130,246,0.1)' },
          { label: 'Em Andamento', value: stats.em_andamento, icon: <Loader size={18} />, color: '#fcd34d', bg: 'rgba(245,158,11,0.1)' },
          { label: 'Resolvidos', value: stats.resolvido, icon: <CheckCircle size={18} />, color: '#6ee7b7', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Urgentes', value: stats.urgente, icon: <AlertTriangle size={18} />, color: '#fca5a5', bg: 'rgba(239,68,68,0.1)' },
          { label: 'Usuários', value: totalUsers, icon: <Users size={18} />, color: 'var(--Aca�-300)', bg: 'rgba(139,71,255,0.08)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ width: 36, height: 36, borderRadius: 9, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 10 }}>
              {s.icon}
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f0eeff', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.4)', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Area Breakdown + Quick Links */}
      <div className="animate-fade-in-up animate-delay-200" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        {/* Area breakdown */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f0eeff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={16} color="var(--Aca�-400)" />
            Chamados por Área
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'TI', value: areaStats.ti, total: stats.total, color: '#8b47ff', icon: <Monitor size={16} /> },
              { label: 'Manutenção', value: areaStats.manutencao, total: stats.total, color: '#38bdf8', icon: <Wrench size={16} /> },
            ].map(area => {
              const pct = stats.total > 0 ? Math.round((area.value / stats.total) * 100) : 0
              return (
                <div key={area.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'rgba(240,238,255,0.7)', fontWeight: 600 }}>
                      <span style={{ color: area.color }}>{area.icon}</span> {area.label}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(240,238,255,0.4)' }}>{area.value} ({pct}%)</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: area.color, borderRadius: 3, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quick links */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f0eeff', marginBottom: 16 }}>Ações Rápidas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { href: '/admin/chamados', label: 'Gerenciar Chamados', icon: <TicketIcon size={16} />, desc: 'Ver e atualizar todos' },
              { href: '/admin/usuarios', label: 'Gerenciar Usuários', icon: <Users size={16} />, desc: 'Criar e editar usuários' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="glass-card-hover" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.875rem 1rem', textDecoration: 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(139,71,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--Aca�-300)' }}>
                    {link.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f0eeff' }}>{link.label}</div>
                    <div style={{ fontSize: '0.73rem', color: 'rgba(240,238,255,0.35)' }}>{link.desc}</div>
                  </div>
                </div>
                <ArrowRight size={15} color="rgba(240,238,255,0.25)" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent tickets */}
      <div className="animate-fade-in-up animate-delay-300">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0eeff' }}>Chamados Recentes</h2>
          <Link href="/admin/chamados" style={{ fontSize: '0.8rem', color: 'var(--Aca�-400)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            Ver todos <ArrowRight size={13} />
          </Link>
        </div>
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="Acae-table">
            <thead>
              <tr>
                <th>Protocolo</th>
                <th>Título</th>
                <th>Solicitante</th>
                <th>Área</th>
                <th>Prioridade</th>
                <th>Status</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map(ticket => (
                <tr key={ticket.id} onClick={() => window.location.href = `/chamados/${ticket.id}`}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--Aca�-300)' }}>{ticket.protocol}</span></td>
                  <td style={{ fontWeight: 500, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.title}</td>
                  <td style={{ fontSize: '0.82rem', color: 'rgba(240,238,255,0.55)' }}>{ticket.user?.full_name ?? '-'}</td>
                  <td><AreaBadge area={ticket.area!} /></td>
                  <td><PriorityBadge priority={ticket.priority!} /></td>
                  <td><StatusBadge status={ticket.status!} /></td>
                  <td style={{ fontSize: '0.78rem', color: 'rgba(240,238,255,0.35)' }}>
                    {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('pt-BR') : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
