'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Ticket } from '@/lib/types'
import { StatusBadge, PriorityBadge, AreaBadge } from '@/components/badges'
import { Search, ExternalLink, Filter } from 'lucide-react'

interface Props {
  tickets: (Partial<Ticket> & { user?: { full_name: string; email: string } })[]
  isAdmin: boolean
}

export function AdminTicketsClient({ tickets, isAdmin }: Props) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterArea, setFilterArea] = useState('')
  const [filterPriority, setFilterPriority] = useState('')

  const filtered = tickets.filter(t => {
    const q = search.toLowerCase()
    const matchSearch = !search ||
      t.title?.toLowerCase().includes(q) ||
      t.protocol?.toLowerCase().includes(q) ||
      t.user?.full_name.toLowerCase().includes(q)
    return matchSearch &&
      (!filterStatus || t.status === filterStatus) &&
      (!filterArea || t.area === filterArea) &&
      (!filterPriority || t.priority === filterPriority)
  })

  const urgentCount = tickets.filter(t => t.priority === 'Urgente' && t.status !== 'Fechado' && t.status !== 'Resolvido').length

  return (
    <div style={{ padding: '2rem' }}>
      <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0eeff', marginBottom: 4 }}>
            {isAdmin ? 'Todos os Chamados' : 'Chamados da Minha Área'}
          </h1>
          <p style={{ color: 'rgba(240,238,255,0.45)', fontSize: '0.875rem' }}>
            {filtered.length} de {tickets.length} chamados
            {urgentCount > 0 && <span style={{ marginLeft: 8, color: '#fca5a5', fontWeight: 600 }}>• {urgentCount} urgente{urgentCount > 1 ? 's' : ''}</span>}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="animate-fade-in-up animate-delay-100 glass-card" style={{ padding: '1rem', marginBottom: 20, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,238,255,0.3)' }} />
          <input
            type="text"
            className="Acae-input"
            style={{ paddingLeft: '2.2rem', padding: '0.5rem 0.875rem 0.5rem 2.2rem' }}
            placeholder="Buscar por protocolo, título, solicitante..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {isAdmin && (
          <select className="Acae-select" style={{ padding: '0.5rem 1.5rem 0.5rem 0.875rem', minWidth: 130 }} value={filterArea} onChange={e => setFilterArea(e.target.value)}>
            <option value="">Todas as áreas</option>
            <option value="TI">TI</option>
            <option value="Manutenção">Manutenção</option>
          </select>
        )}
        <select className="Acae-select" style={{ padding: '0.5rem 1.5rem 0.5rem 0.875rem', minWidth: 130 }} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option value="">Prioridade</option>
          <option value="Baixa">Baixa</option>
          <option value="Média">Média</option>
          <option value="Alta">Alta</option>
          <option value="Urgente">Urgente</option>
        </select>
        <select className="Acae-select" style={{ padding: '0.5rem 1.5rem 0.5rem 0.875rem', minWidth: 150 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="Aberto">Aberto</option>
          <option value="Em Andamento">Em Andamento</option>
          <option value="Aguardando">Aguardando</option>
          <option value="Resolvido">Resolvido</option>
          <option value="Fechado">Fechado</option>
        </select>
        {(search || filterStatus || filterArea || filterPriority) && (
          <button className="btn-ghost" onClick={() => { setSearch(''); setFilterStatus(''); setFilterArea(''); setFilterPriority('') }} style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem', whiteSpace: 'nowrap' }}>
            Limpar filtros
          </button>
        )}
      </div>

      {/* Table */}
      <div className="animate-fade-in-up animate-delay-200 glass-card" style={{ overflow: 'auto' }}>
        <table className="Acae-table" style={{ minWidth: 800 }}>
          <thead>
            <tr>
              <th>Protocolo</th>
              <th>Título</th>
              <th>Solicitante</th>
              <th>Área</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Data</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'rgba(240,238,255,0.3)' }}>
                  Nenhum chamado encontrado
                </td>
              </tr>
            ) : (
              filtered.map(ticket => (
                <tr key={ticket.id} style={{
                  background: ticket.priority === 'Urgente' && ticket.status !== 'Resolvido' && ticket.status !== 'Fechado'
                    ? 'rgba(239,68,68,0.03)' : undefined
                }}>
                  <td><span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--Aca�-300)' }}>{ticket.protocol}</span></td>
                  <td style={{ fontWeight: 500, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.title}</td>
                  <td style={{ fontSize: '0.82rem', color: 'rgba(240,238,255,0.55)' }}>{ticket.user?.full_name ?? '—'}</td>
                  <td><AreaBadge area={ticket.area!} /></td>
                  <td><PriorityBadge priority={ticket.priority!} /></td>
                  <td><StatusBadge status={ticket.status!} /></td>
                  <td style={{ fontSize: '0.78rem', color: 'rgba(240,238,255,0.35)' }}>
                    {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td>
                    <Link href={`/chamados/${ticket.id}`} className="btn-ghost" style={{ padding: '0.3rem 0.6rem', fontSize: '0.78rem', display: 'inline-flex' }}>
                      <ExternalLink size={13} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
