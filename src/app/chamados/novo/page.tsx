'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AppShell } from '@/components/app-shell'
import { AreaBadge, PriorityBadge } from '@/components/badges'
import {
  Send, AlertCircle, CheckCircle, FileText, MapPin,
  Monitor, Wrench, ChevronDown
} from 'lucide-react'
type Area = 'TI' | 'Manutenção'
type Priority = 'Baixa' | 'Média' | 'Alta' | 'Urgente'

const priorityColors: Record<Priority, string> = {
  'Baixa': '#6ee7b7',
  'Média': '#93c5fd',
  'Alta': '#fcd34d',
  'Urgente': '#fca5a5',
}

export default function NovoChamadoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [protocol, setProtocol] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    area: '' as Area | '',
    priority: 'Média' as Priority,
    location: '',
    description: '',
  })
  const generateProtocol = () => {
    const year = new Date().getFullYear()
    const rand = Math.floor(Math.random() * 90000) + 10000
    return `Acaê-${year}-${rand}`
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.area) { setError('Selecione uma área'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const proto = generateProtocol()
    const { error: insertError } = await supabase.from('tickets').insert({
      protocol: proto,
      title: form.title,
      area: form.area,
      priority: form.priority,
      location: form.location,
      description: form.description,
      status: 'Aberto',
      user_id: user.id,
    })
    if (insertError) {
      setError('Erro ao abrir chamado: ' + insertError.message)
      setLoading(false)
      return
    }
    setProtocol(proto)
    setSuccess(true)
    setLoading(false)
  }
  if (success) {
    return (
      <AppShell>
        <div style={{ padding: '1rem', maxWidth: 600, margin: '0 auto', paddingTop: 'min(4rem, 10vh)' }}>
          <div className="glass-card animate-fade-in-up" style={{ padding: 'min(3rem, 1.5rem)', textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <CheckCircle size={28} color="#6ee7b7" />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f0eeff', marginBottom: 8 }}>
              Chamado Aberto!
            </h2>
            <p style={{ color: 'rgba(240,238,255,0.55)', marginBottom: 20, fontSize: '0.85rem' }}>
              Seu chamado foi registrado com sucesso. A equipe entrará em contato em breve.
            </p>
            <div style={{
              background: 'rgba(139,71,255,0.1)', border: '1px solid rgba(139,71,255,0.25)',
              borderRadius: 12, padding: '1rem', marginBottom: 24,
            }}>
              <p style={{ fontSize: '0.7rem', color: 'rgba(240,238,255,0.45)', marginBottom: 4 }}>NÚMERO DO PROTOCOLO</p>
              <p style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: 'var(--Acaê-300)', letterSpacing: '0.05em' }}>
                {protocol}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn-secondary" style={{ flex: 1, minWidth: 200 }} onClick={() => {
                setSuccess(false)
                setForm({ title: '', area: '', priority: 'Média', location: '', description: '' })
              }}>
                Abrir outro chamado
              </button>
              <button className="btn-primary" style={{ flex: 1, minWidth: 200 }} onClick={() => router.push('/chamados')}>
                Ver meus chamados
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    )
  }
  return (
    <AppShell>
      <div style={{ padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
        <div className="animate-fade-in-up" style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0eeff', marginBottom: 4 }}>
            Abrir Chamado
          </h1>
          <p style={{ color: 'rgba(240,238,255,0.45)', fontSize: '0.875rem' }}>
            Preencha as informações abaixo para registrar sua solicitação
          </p>
        </div>
        {error && (
          <div className="alert-error animate-fade-in" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Área */}
          <div className="glass-card animate-fade-in-up animate-delay-100" style={{ padding: '1.25rem' }}>
            <label className="form-label" style={{ marginBottom: 12 }}>Área de Atendimento *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
              {([
                { value: 'TI', label: 'Tecnologia da Informação', desc: 'Computadores, sistemas, rede', icon: <Monitor size={22} />, color: 'var(--Acaê-400)' },
                { value: 'Manutenção', label: 'Manutenção', desc: 'Elétrica, reparos, infraestrutura', icon: <Wrench size={22} />, color: '#38bdf8' },
              ] as const).map(area => (
                <button
                  key={area.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, area: area.value }))}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    padding: '1.5rem 1rem', borderRadius: 12, cursor: 'pointer',
                    background: form.area === area.value
                      ? 'rgba(139,71,255,0.15)' : 'rgba(15,10,30,0.5)',
                    border: form.area === area.value
                      ? '2px solid rgba(139,71,255,0.5)' : '1px solid rgba(139,71,255,0.1)',
                    transition: 'all 0.2s ease', color: 'inherit', textAlign: 'center',
                  }}
                >
                  <div style={{ color: area.color }}>{area.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f0eeff', marginBottom: 2 }}>{area.label}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.4)' }}>{area.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Title + Priority */}
          <div className="glass-card animate-fade-in-up animate-delay-200" style={{ 
            padding: '1.25rem', 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 16 
          }}>
            <div>
              <label className="form-label">Assunto / Título *</label>
              <input
                type="text"
                id="ticket-title"
                className="Acaê-input"
                placeholder="Ex: Computador não liga"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
                maxLength={120}
              />
            </div>
            <div>
              <label className="form-label">Prioridade *</label>
              <div style={{ position: 'relative' }}>
                <select
                  id="ticket-priority"
                  className="Acaê-select"
                  value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}
                  style={{ paddingRight: '2rem' }}
                >
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Alta">Alta</option>
                  <option value="Urgente">Urgente</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,238,255,0.4)', pointerEvents: 'none' }} />
              </div>
              {form.priority && (
                <div style={{ marginTop: 6 }}>
                  <PriorityBadge priority={form.priority} />
                </div>
              )}
            </div>
          </div>
          {/* Location */}
          <div className="glass-card animate-fade-in-up animate-delay-300" style={{ padding: '1.5rem' }}>
            <label className="form-label">Localização / Setor</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(240,238,255,0.3)' }} />
              <input
                type="text"
                id="ticket-location"
                className="Acaê-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Ex: Bloco A, Sala 201"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              />
            </div>
          </div>
          {/* Description */}
          <div className="glass-card animate-fade-in-up animate-delay-400" style={{ padding: '1.5rem' }}>
            <label className="form-label">Descrição Detalhada *</label>
            <textarea
              id="ticket-description"
              className="Acaê-textarea"
              placeholder="Descreva o problema com o máximo de detalhes possível. Quanto mais informações, mais rápida será a resolução."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              required
              minLength={20}
              style={{ minHeight: 140 }}
            />
            <div style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.3)', marginTop: 6, textAlign: 'right' }}>
              {form.description.length} caracteres
            </div>
          </div>
          {/* Submit */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', flexWrap: 'wrap-reverse' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.back()}
              style={{ flex: 1, minWidth: 120 }}
            >
              Cancelar
            </button>
            <button
              id="submit-ticket-btn"
              type="submit"
              className="btn-primary"
              disabled={loading || !form.area}
              style={{ flex: 2, minWidth: 180 }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 15, height: 15, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                  }} />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Abrir Chamado
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </AppShell>
  )
}