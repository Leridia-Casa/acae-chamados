'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile, UserRole, TicketArea } from '@/lib/types'
import { RoleBadge } from '@/components/badges'
import { Plus, Search, User, X, AlertCircle, CheckCircle, Eye, EyeOff, Trash2 } from 'lucide-react'

interface Props {
  users: Profile[]
  currentUserId: string
}

type NewUser = {
  full_name: string
  email: string
  password: string
  role: UserRole
  area: TicketArea | ''
}

const EMPTY_USER: NewUser = { full_name: '', email: '', password: '', role: 'usuario', area: '' }

export function AdminUsersClient({ users: initialUsers, currentUserId }: Props) {
  const [users, setUsers] = useState<Profile[]>(initialUsers)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newUser, setNewUser] = useState<NewUser>(EMPTY_USER)
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const res = await fetch('/api/admin/criar-usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error || 'Erro ao criar usuário')
      setLoading(false)
      return
    }

    setSuccess(`Usuário ${newUser.full_name} criado com sucesso!`)
    setUsers(prev => [json.profile, ...prev])
    setNewUser(EMPTY_USER)
    setTimeout(() => { setShowModal(false); setSuccess('') }, 1500)
    setLoading(false)
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja remover ${userName}?`)) return
    const res = await fetch(`/api/admin/remover-usuario?id=${userId}`, { method: 'DELETE' })
    if (res.ok) {
      setUsers(prev => prev.filter(u => u.id !== userId))
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0eeff', marginBottom: 4 }}>
            Usuários
          </h1>
          <p style={{ color: 'rgba(240,238,255,0.45)', fontSize: '0.875rem' }}>
            {users.length} usuário{users.length !== 1 ? 's' : ''} cadastrado{users.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn-primary" onClick={() => { setShowModal(true); setError(''); setSuccess('') }}>
          <Plus size={16} /> Novo Usuário
        </button>
      </div>

      {/* Search */}
      <div className="animate-fade-in-up animate-delay-100 glass-card" style={{ padding: '1rem', marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 400 }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,238,255,0.3)' }} />
          <input
            type="text"
            className="Acaê-input"
            style={{ paddingLeft: '2.2rem', padding: '0.5rem 0.875rem 0.5rem 2.2rem' }}
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Users table */}
      <div className="animate-fade-in-up animate-delay-200 glass-card" style={{ overflow: 'hidden' }}>
        <table className="Acaê-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Ãrea</th>
              <th>Cadastrado</th>
              <th style={{ textAlign: 'right' }}>AçÃµes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ cursor: 'default' }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #8b47ff, #6d12ee)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.78rem', fontWeight: 700, color: '#fff',
                    }}>
                      {u.full_name[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.full_name}</span>
                    {u.id === currentUserId && (
                      <span style={{ fontSize: '0.68rem', background: 'rgba(139,71,255,0.15)', color: 'var(--Acaê-300)', border: '1px solid rgba(139,71,255,0.3)', borderRadius: 4, padding: '1px 6px' }}>Você</span>
                    )}
                  </div>
                </td>
                <td style={{ fontSize: '0.85rem', color: 'rgba(240,238,255,0.55)' }}>{u.email}</td>
                <td><RoleBadge role={u.role} /></td>
                <td style={{ fontSize: '0.82rem', color: 'rgba(240,238,255,0.5)' }}>{u.area || '—'}</td>
                <td style={{ fontSize: '0.78rem', color: 'rgba(240,238,255,0.35)' }}>
                  {new Date(u.created_at).toLocaleDateString('pt-BR')}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {u.id !== currentUserId && (
                    <button
                      className="btn-ghost"
                      onClick={() => handleDeleteUser(u.id, u.full_name)}
                      style={{ padding: '0.3rem 0.6rem', color: 'rgba(239,68,68,0.6)' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'rgba(240,238,255,0.3)' }}>
                  Nenhum usuário encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }} onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="glass-card animate-fade-in-up" style={{ width: '100%', maxWidth: 480, padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0eeff' }}>Criar Novo Usuário</h2>
              <button className="btn-ghost" onClick={() => setShowModal(false)} style={{ padding: '0.3rem' }}>
                <X size={18} />
              </button>
            </div>

            {error && <div className="alert-error" style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}><AlertCircle size={15} />{error}</div>}
            {success && <div className="alert-success" style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}><CheckCircle size={15} />{success}</div>}

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="form-label">Nome Completo *</label>
                <input type="text" id="new-user-name" className="Acaê-input" placeholder="Nome do usuário" value={newUser.full_name} onChange={e => setNewUser(u => ({ ...u, full_name: e.target.value }))} required />
              </div>
              <div>
                <label className="form-label">E-mail *</label>
                <input type="email" id="new-user-email" className="Acaê-input" placeholder="email@Acaê" value={newUser.email} onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))} required />
              </div>
              <div>
                <label className="form-label">Senha *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    id="new-user-password"
                    className="Acaê-input"
                    style={{ paddingRight: '2.5rem' }}
                    placeholder="Mínimo 8 caracteres"
                    value={newUser.password}
                    onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))}
                    required
                    minLength={8}
                  />
                  <button type="button" onClick={() => setShowPwd(p => !p)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,238,255,0.35)', display: 'flex' }}>
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="form-label">Perfil *</label>
                  <select id="new-user-role" className="Acaê-select" value={newUser.role} onChange={e => setNewUser(u => ({ ...u, role: e.target.value as UserRole }))}>
                    <option value="usuario">Usuário</option>
                    <option value="tecnico">Técnico</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {(newUser.role === 'tecnico') && (
                  <div>
                    <label className="form-label">Ãrea</label>
                    <select id="new-user-area" className="Acaê-select" value={newUser.area} onChange={e => setNewUser(u => ({ ...u, area: e.target.value as TicketArea }))}>
                      <option value="">Selecione...</option>
                      <option value="TI">TI</option>
                      <option value="Manutenção">Manutenção</option>
                    </select>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button id="create-user-btn" type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Criando...' : <><User size={15} /> Criar Usuário</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
