'use client'
import { AppShell } from '@/components/app-shell'
import { BookOpen, Users, GraduationCap, Target } from 'lucide-react'

const integrantes = [
  'Cauã Gasparoto Nascimento',
  'Giovane Pasqualinott',
  'Leridia Casanova Abrantes',
  'Miguel Carvalho de Oliveira Pinto',
  'Misael Elias de Souz',
  'Otávio Henrique Gomes Rodrigues',
]

const professores = [
  'Prof. Dr. Elvio Gilberto da Silva',
  'Prof. Me. Luis Felipe Grael Tinós',
  'Professora Esp. Camila Pellizon Floret (professora colaboradora)',
]

export default function CreditosPage() {
  return (
    <AppShell>
      <div style={{ padding: 'min(2rem, 1rem)', maxWidth: 860, margin: '0 auto' }}>

        {/* Header */}
        <div className="animate-fade-in-up" style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f0eeff', marginBottom: 4 }}>
            Créditos e Sobre
          </h1>
          <p style={{ color: 'rgba(240,238,255,0.45)', fontSize: '0.875rem' }}>
            Informações acadêmicas e equipe do projeto Acaê Chamados
          </p>
        </div>

        {/* Disciplina + Finalidade */}
        <div className="glass-card animate-fade-in-up animate-delay-100" style={{ padding: '1.75rem', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139,71,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139,71,255,0.3)', flexShrink: 0 }}>
              <BookOpen size={20} color="var(--Acaê-300)" />
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(240,238,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Informações Acadêmicas</div>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0eeff' }}>Desenvolvimento de Software</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(240,238,255,0.35)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Disciplina</div>
              <div style={{ color: '#f0eeff', fontWeight: 600, fontSize: '0.9rem' }}>Desenvolvimento de Software</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(240,238,255,0.35)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tipo</div>
              <div style={{ color: '#f0eeff', fontWeight: 600, fontSize: '0.9rem' }}>Projeto de Extensão</div>
            </div>
          </div>
        </div>

        {/* Finalidade */}
        <div className="glass-card animate-fade-in-up animate-delay-100" style={{ padding: '1.75rem', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139,71,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139,71,255,0.3)', flexShrink: 0 }}>
              <Target size={20} color="var(--Acaê-300)" />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0eeff' }}>Finalidade do Projeto</h2>
          </div>
          <p style={{ color: 'rgba(240,238,255,0.6)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
            O <strong style={{ color: '#f0eeff' }}>Acaê Chamados</strong> é um sistema de gestão de chamados desenvolvido para otimizar o fluxo de atendimento interno de uma organização. Permite que colaboradores abram solicitações de suporte técnico, manutenção predial, limpeza, coordenação e administrativo, com acompanhamento em tempo real do status, prioridade e responsável pelo atendimento. O sistema oferece painéis diferenciados para usuários, técnicos e administradores, garantindo rastreabilidade e organização dos processos internos.
          </p>
        </div>

        {/* Professores */}
        <div className="glass-card animate-fade-in-up animate-delay-200" style={{ padding: '1.75rem', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139,71,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139,71,255,0.3)', flexShrink: 0 }}>
              <GraduationCap size={20} color="var(--Acaê-300)" />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0eeff' }}>Professores Responsáveis</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {professores.map((prof, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--Acaê-300)', flexShrink: 0 }} />
                <span style={{ color: '#f0eeff', fontSize: '0.9rem', fontWeight: 500 }}>{prof}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Integrantes */}
        <div className="glass-card animate-fade-in-up animate-delay-300" style={{ padding: '1.75rem', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(139,71,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139,71,255,0.3)', flexShrink: 0 }}>
              <Users size={20} color="var(--Acaê-300)" />
            </div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0eeff' }}>Equipe do Projeto</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
            {integrantes.map((nome, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #8b47ff, #6d12ee)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, color: '#fff',
                }}>
                  {nome[0]}
                </div>
                <span style={{ color: '#f0eeff', fontSize: '0.875rem', fontWeight: 500 }}>{nome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logos */}
        <div className="glass-card animate-fade-in-up animate-delay-300" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center', justifyContent: 'center' }}>
            {/* Desenvolvimento - UNISAGRADO */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(240,238,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Desenvolvimento:
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/logo-unisagrado.png"
                alt="Logo UNISAGRADO"
                style={{ height: 80, objectFit: 'contain', filter: 'brightness(1.2)' }}
              />
            </div>

            <div style={{ width: 1, height: 60, background: 'rgba(255,255,255,0.08)' }} />

            {/* Apoio - Coordenadoria de Extensão */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(240,238,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                Apoio:
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/logo-extensao.jpg"
                alt="Logo Coordenadoria de Extensão"
                style={{ height: 80, objectFit: 'contain', filter: 'brightness(1.2)' }}
              />
            </div>

          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, color: 'rgba(240,238,255,0.2)', fontSize: '0.75rem' }}>
          Acaê Chamados — Sistema de Gestão de Chamados · Desenvolvimento de Software · UNISAGRADO 2026
        </div>

      </div>
    </AppShell>
  )
}
