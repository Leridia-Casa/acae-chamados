import { AppShell } from '@/components/app-shell'
import { Info, Heart } from 'lucide-react'

export default function CreditosPage() {
  return (
    <AppShell>
      <div style={{ padding: 'min(2rem, 1rem)', maxWidth: 800, margin: '0 auto' }}>
        <div className="animate-fade-in-up" style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0eeff', marginBottom: 4 }}>
            Créditos e Sobre
          </h1>
          <p style={{ color: 'rgba(240,238,255,0.45)', fontSize: '0.875rem' }}>
            Informações sobre o sistema Acaê
          </p>
        </div>

        <div className="glass-card animate-fade-in-up animate-delay-100" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(139,71,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139,71,255,0.3)' }}>
              <Info size={24} color="var(--Acaê-300)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Acaê Chamados</h2>
              <div style={{ color: 'rgba(240,238,255,0.5)', fontSize: '0.9rem' }}>Versão 1.0.0</div>
            </div>
          </div>

          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)' }} />

          <div>
            <h3 style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: 8, fontWeight: 600 }}>Sobre o Sistema</h3>
            <p style={{ color: 'rgba(240,238,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Este sistema foi projetado para otimizar e organizar o fluxo de atendimentos e manutenção corporativa.
              Ele permite a abertura rápida de chamados, atribuição de prioridades, anexação de imagens e o acompanhamento em tempo real do status de cada solicitação.
            </p>
          </div>

          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(240,238,255,0.4)', fontSize: '0.85rem' }}>
            <span>Desenvolvido com</span>
            <Heart size={14} color="#f87171" fill="#f87171" />
            <span>pela equipe Acaê / Leridia</span>
          </div>

        </div>
      </div>
    </AppShell>
  )
}
