'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Ticket, Profile, TicketComment } from '@/lib/types'
import { StatusBadge, PriorityBadge, AreaBadge } from '@/components/badges'
import {

  ArrowLeft, Calendar, MapPin, User, Clock,
  MessageCircle, Send, Lock, Unlock
} from 'lucide-react'
interface Props {
  ticket: Ticket & { user?: Profile; assigned_user?: Profile; comments?: (TicketComment & { user?: Profile })[] }
  currentProfile: Profile | null
}

const STATUS_OPTIONS = ['Aberto', 'Aguardando Retorno', 'Resolvido'] as const

export function TicketDetail({ ticket, currentProfile }: Props) {
  const router = useRouter()
  const [comment, setComment] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [sendingComment, setSendingComment] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(ticket.status)
  const [comments, setComments] = useState(ticket.comments || [])
  const isAdmin = currentProfile?.role === 'admin'
  const isTecnico = currentProfile?.role === 'tecnico' || isAdmin
  const isOwner = currentProfile?.id === ticket.user_id
  const handleStatusChange = async (newStatus: string) => {
    if (!isTecnico) return
    setUpdatingStatus(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('tickets')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', ticket.id)
    if (!error) setCurrentStatus(newStatus as typeof currentStatus)
    setUpdatingStatus(false)
  }
  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSendingComment(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: newComment, error } = await supabase
      .from('ticket_comments')
      .insert({
        ticket_id: ticket.id,
        user_id: user.id,
        content: comment,
        is_internal: isInternal && isTecnico,
      })
      .select('*, user:profiles(*)')
      .single()
    if (!error && newComment) {
      setComments(c => [...c, newComment as any])
      setComment('')
    }
    setSendingComment(false)
  }
  return (
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      {/* Back */}
      <button
        className="btn-ghost animate-fade-in-up"
        onClick={() => router.back()}
        style={{ marginBottom: 20, padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
      >
        <ArrowLeft size={16} /> Voltar
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, alignItems: 'start' }}>
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Header card */}
          <div className="glass-card animate-fade-in-up" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              <AreaBadge area={ticket.area} />
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={currentStatus} />
            </div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f0eeff', marginBottom: 12, lineHeight: 1.3 }}>
              {ticket.title}
            </h1>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'rgba(240,238,255,0.4)' }}>
                <span style={{ fontFamily: 'monospace', background: 'rgba(139,71,255,0.1)', border: '1px solid rgba(139,71,255,0.2)', borderRadius: 6, padding: '2px 8px', color: 'var(--Acaê-300)', fontWeight: 600 }}>
                  {ticket.protocol}
                </span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'rgba(240,238,255,0.4)' }}>
                <Calendar size={13} />
                {new Date(ticket.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
              {ticket.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'rgba(240,238,255,0.4)' }}>
                  <MapPin size={13} /> {ticket.location}
                </span>
              )}
            </div>
            <hr className="divider" />
            <div>
              <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(240,238,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Descrição</p>
              <p style={{ color: 'rgba(240,238,255,0.75)', fontSize: '0.9rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {ticket.description}
              </p>
            </div>
          </div>
          {/* Comments */}
          <div className="glass-card animate-fade-in-up animate-delay-100" style={{ padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0eeff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <MessageCircle size={18} color="var(--Acaê-400)" />
              Comentários ({comments.filter(c => !c.is_internal || isTecnico).length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              {comments.filter(c => !c.is_internal || isTecnico).map(c => (
                <div key={c.id} style={{
                  padding: '1rem',
                  borderRadius: 10,
                  background: c.is_internal
                    ? 'rgba(245,158,11,0.07)' : 'rgba(139,71,255,0.05)',
                  border: `1px solid ${c.is_internal ? 'rgba(245,158,11,0.15)' : 'rgba(139,71,255,0.1)'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #8b47ff, #6d12ee)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', fontWeight: 700, color: '#fff',
                    }}>
                      {c.user?.full_name?.[0]?.toUpperCase() ?? 'U'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f0eeff' }}>{c.user?.full_name ?? 'Usuário'}</span>
                      {c.is_internal && (
                        <span style={{ marginLeft: 6, fontSize: '0.68rem', fontWeight: 600, color: '#fcd34d', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 4, padding: '1px 5px' }}>
                          Interno
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(240,238,255,0.3)' }}>
                      {new Date(c.created_at).toLocaleDateString('pt-BR')} {new Date(c.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(240,238,255,0.7)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {c.content}
                  </p>
                </div>
              ))}
              {comments.filter(c => !c.is_internal || isTecnico).length === 0 && (
                <p style={{ color: 'rgba(240,238,255,0.3)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem' }}>
                  Nenhum comentário ainda
                </p>
              )}
            </div>
            {/* Comment form */}
            {(currentStatus !== 'Resolvido') && (
              <form onSubmit={handleComment}>
                <textarea
                  className="Acaê-textarea"
                  placeholder="Escreva um comentário..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  style={{ minHeight: 90, marginBottom: 10 }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                  {isTecnico && (
                    <button
                      type="button"
                      onClick={() => setIsInternal(v => !v)}
                      className="btn-ghost"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', color: isInternal ? '#fcd34d' : 'rgba(240,238,255,0.4)' }}
                    >
                      {isInternal ? <Lock size={14} /> : <Unlock size={14} />}
                      {isInternal ? 'Comentário Interno' : 'Comentário Público'}
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={sendingComment || !comment.trim()}
                    style={{ marginLeft: 'auto', fontSize: '0.85rem' }}
                  >
                    <Send size={14} />
                    {sendingComment ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Status control */}
          {isTecnico && (
            <div className="glass-card animate-fade-in-up" style={{ padding: '1.25rem' }}>
              <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(240,238,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
                Atualizar Status
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {STATUS_OPTIONS.map(status => (
                  <button
                    key={status}
                    className="btn-ghost"
                    onClick={() => handleStatusChange(status)}
                    disabled={updatingStatus || currentStatus === status}
                    style={{
                      justifyContent: 'flex-start', fontSize: '0.82rem',
                      background: currentStatus === status ? 'rgba(139,71,255,0.15)' : 'transparent',
                      color: currentStatus === status ? 'var(--Acaê-300)' : 'rgba(240,238,255,0.5)',
                      border: currentStatus === status ? '1px solid rgba(139,71,255,0.3)' : '1px solid transparent',
                      padding: '0.5rem 0.75rem',
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Info */}
          <div className="glass-card animate-fade-in-up animate-delay-100" style={{ padding: '1.25rem' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(240,238,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              Informações
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Solicitante', value: ticket.user?.full_name ?? 'Desconhecido', icon: <User size={13} /> },
                { label: 'Atribuído a', value: ticket.assigned_user?.full_name ?? 'Não atribuído', icon: <User size={13} /> },
                { label: 'Área', value: ticket.area, icon: null },
                { label: 'Prioridade', value: ticket.priority, icon: null },
                { label: 'Aberto em', value: new Date(ticket.created_at).toLocaleDateString('pt-BR'), icon: <Calendar size={13} /> },
                { label: 'Atualizado', value: new Date(ticket.updated_at).toLocaleDateString('pt-BR'), icon: <Clock size={13} /> },
              ].map(({ label, value, icon }) => (
                <div key={label}>
                  <p style={{ fontSize: '0.72rem', color: 'rgba(240,238,255,0.3)', marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(240,238,255,0.75)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    {icon && <span style={{ color: 'rgba(240,238,255,0.3)' }}>{icon}</span>}
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}