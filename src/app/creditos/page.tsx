import { AppShell } from '@/components/app-shell'
import { Info, Users, GraduationCap, BookOpen } from 'lucide-react'

export default function CreditosPage() {
  return (
    <AppShell>
      <div style={{ padding: 'min(2rem, 1rem)', maxWidth: 800, margin: '0 auto', paddingBottom: '4rem' }}>
        <div className="animate-fade-in-up" style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f0eeff', marginBottom: 4 }}>
            Créditos e Sobre
          </h1>
          <p style={{ color: 'rgba(240,238,255,0.45)', fontSize: '0.875rem' }}>
            Informações institucionais e equipe de desenvolvimento
          </p>
        </div>

        <div className="glass-card animate-fade-in-up animate-delay-100" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(139,71,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139,71,255,0.3)' }}>
              <Info size={24} color="var(--Acaê-300)" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>Acaê Chamados</h2>
              <div style={{ color: 'rgba(240,238,255,0.5)', fontSize: '0.9rem' }}>Sistema de Gestão e Atendimento</div>
            </div>
          </div>

          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)' }} />

          {/* Finalidade do Projeto */}
          <div>
            <h3 style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', marginBottom: 8, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={18} color="var(--Acaê-300)" />
              Finalidade do Projeto
            </h3>
            <p style={{ color: 'rgba(240,238,255,0.5)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              O sistema Acaê Chamados foi desenvolvido para otimizar e organizar o fluxo de atendimentos e manutenção corporativa.
              Ele permite a abertura centralizada de chamados, classificação por áreas e prioridades, e o acompanhamento em tempo real do status de cada solicitação, garantindo maior eficiência e transparência na resolução de problemas.
            </p>
          </div>

          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)' }} />

          {/* Informações Acadêmicas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <GraduationCap size={18} color="var(--Acaê-300)" />
              Informações Acadêmicas
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
              <div>
                <strong style={{ display: 'block', color: 'rgba(240,238,255,0.7)', fontSize: '0.85rem', marginBottom: 4 }}>Disciplina</strong>
                <span style={{ color: 'rgba(240,238,255,0.5)', fontSize: '0.9rem' }}>Desenvolvimento de Software</span>
              </div>
              
              <div>
                <strong style={{ display: 'block', color: 'rgba(240,238,255,0.7)', fontSize: '0.85rem', marginBottom: 4 }}>Professores Responsáveis</strong>
                <ul style={{ color: 'rgba(240,238,255,0.5)', fontSize: '0.9rem', paddingLeft: 0, listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <li>Prof. Dr. Elvio Gilberto da Silva</li>
                  <li>Prof. Me. Luis Felipe Grael Tinós</li>
                  <li>Professora Esp. Camila Floret Pelizon (professora colaboradora)</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)' }} />

          {/* Integrantes */}
          <div>
            <h3 style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', marginBottom: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={18} color="var(--Acaê-300)" />
              Equipe de Desenvolvimento (Integrantes)
            </h3>
            <ul style={{ 
              color: 'rgba(240,238,255,0.5)', 
              fontSize: '0.9rem', 
              paddingLeft: '1.2rem', 
              lineHeight: 1.8,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.5rem 1rem'
            }}>
              <li>Cauã Gasparoto Nascimento</li>
              <li>Giovane Pasqualinott</li>
              <li>Leridia Casanova Abrantes</li>
              <li>Miguel Carvalho de Oliveira Pinto</li>
              <li>Misael Elias de Souz</li>
              <li>Otávio Henrique Gomes Rodrigues</li>
            </ul>
          </div>

          <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.05)' }} />

          {/* Institucional (Logos) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, marginTop: 16, alignItems: 'center', justifyContent: 'center', background: '#fff', padding: '2rem', borderRadius: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <span style={{ color: '#333', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Desenvolvimento:</span>
              {/* Fallback image for UNISAGRADO */}
              <img 
                src="https://unisagrado.edu.br/wp-content/themes/unisagrado/assets/img/logo-unisagrado.svg" 
                alt="Logotipo UNISAGRADO" 
                style={{ height: 60, objectFit: 'contain' }}
                onError={(e) => {
                  // Fallback to text if the image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.insertAdjacentHTML('beforeend', '<div style="color: #c8102e; font-weight: 800; font-size: 1.5rem;">UNISAGRADO</div>');
                }}
              />
            </div>

            <div style={{ width: 1, height: 60, background: 'rgba(0,0,0,0.1)', display: 'block' }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <span style={{ color: '#333', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Apoio:</span>
              <img 
                src="https://unisagrado.edu.br/uploads/2008/logotipos/monoliticas_unisagrado/coordenadoria-deextensao.jpg" 
                alt="Logotipo Coordenadoria de Extensão" 
                style={{ height: 60, objectFit: 'contain' }}
              />
            </div>
          </div>

        </div>
      </div>
    </AppShell>
  )
}
