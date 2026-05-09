'use client'

import { useState } from 'react'

import Link from 'next/link'

import { Ticket } from '@/lib/types'

import { StatusBadge, PriorityBadge, AreaBadge } from '@/components/badges'

import { Plus, Search, Filter, Ticket as TicketIcon } from 'lucide-react'

export function MyTicketsList({ tickets }: { tickets: Ticket[] }) {

  const [search, setSearch] = useState('')

  const [filterStatus, setFilterStatus] = useState('')

  const [filterArea, setFilterArea] = useState('')

  const filtered = tickets.filter(t => {

    const matchSearch = search === '' ||

      t.title.toLowerCase().includes(search.toLowerCase()) ||

      t.protocol.toLowerCase().includes(search.toLowerCase())

    const matchStatus = filterStatus === '' || t.status === filterStatus

    const matchArea = filterArea === '' || t.area === filterArea

    return matchSearch && matchStatus && matchArea

  })

  return (

    <div style={{ padding: '2rem' }}>

      {/* Header */}

      <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>

        <div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0eeff', marginBottom: 4 }}>Meus Chamados</h1>

          <p style={{ color: 'rgba(240,238,255,0.45)', fontSize: '0.875rem' }}>

            {tickets.length} chamado{tickets.length !== 1 ? 's' : ''} registrado{tickets.length !== 1 ? 's' : ''}

          </p>

        </div>

        <Link href="/chamados/novo" className="btn-primary">

          <Plus size={16} /> Novo Chamado

        </Link>

      </div>

      {/* Filters */}

      <div className="animate-fade-in-up animate-delay-100 glass-card" style={{ padding: '1rem', marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>

        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 200 }}>

          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,238,255,0.3)' }} />

          <input

            type="text"

            className="Acaê-input"

            style={{ paddingLeft: '2.2rem', padding: '0.5rem 0.875rem 0.5rem 2.2rem' }}

            placeholder="Buscar por título ou protocolo..."

            value={search}

            onChange={e => setSearch(e.target.value)}

          />

        </div>

        <div style={{ position: 'relative' }}>

          <select className="Acaê-select" style={{ padding: '0.5rem 2rem 0.5rem 0.875rem', minWidth: 140 }} value={filterArea} onChange={e => setFilterArea(e.target.value)}>

            <option value="">Todas as áreas</option>

            <option value="TI">TI</option>

            <option value="Manutenção">Manutenção</option>

          </select>

        </div>

        <div style={{ position: 'relative' }}>

          <select className="Acaê-select" style={{ padding: '0.5rem 2rem 0.5rem 0.875rem', minWidth: 160 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>

            <option value="">Todos os status</option>

            <option value="Aberto">Aberto</option>

            <option value="Em Andamento">Em Andamento</option>

            <option value="Aguardando">Aguardando</option>

            <option value="Resolvido">Resolvido</option>

            <option value="Fechado">Fechado</option>

          </select>

        </div>

      </div>

      {/* Table */}

      <div className="animate-fade-in-up animate-delay-200 glass-card" style={{ overflow: 'hidden' }}>

        {filtered.length === 0 ? (

          <div style={{ padding: '4rem', textAlign: 'center' }}>

            <TicketIcon size={40} color="rgba(139,71,255,0.25)" style={{ marginBottom: 12 }} />

            <p style={{ color: 'rgba(240,238,255,0.35)', fontSize: '0.9rem', marginBottom: 16 }}>

              {tickets.length === 0 ? 'Nenhum chamado encontrado' : 'Nenhum resultado para os filtros aplicados'}

            </p>

            {tickets.length === 0 && (

              <Link href="/chamados/novo" className="btn-primary" style={{ display: 'inline-flex', fontSize: '0.85rem' }}>

                <Plus size={14} /> Abrir primeiro chamado

              </Link>

            )}

          </div>

        ) : (

          <table className="Acaê-table">

            <thead>

              <tr>

                <th>Protocolo</th>

                <th>Título</th>

                <th>Ãrea</th>

                <th>Prioridade</th>

                <th>Status</th>

                <th>Data</th>

              </tr>

            </thead>

            <tbody>

              {filtered.map(ticket => (

                <tr key={ticket.id} onClick={() => window.location.href = `/chamados/${ticket.id}`}>

                  <td>

                    <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: 'var(--Acaê-300)' }}>

                      {ticket.protocol}

                    </span>

                  </td>

                  <td style={{ fontWeight: 500 }}>{ticket.title}</td>

                  <td><AreaBadge area={ticket.area} /></td>

                  <td><PriorityBadge priority={ticket.priority} /></td>

                  <td><StatusBadge status={ticket.status} /></td>

                  <td style={{ fontSize: '0.8rem', color: 'rgba(240,238,255,0.4)' }}>

                    {new Date(ticket.created_at).toLocaleDateString('pt-BR')}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>

  )

}
