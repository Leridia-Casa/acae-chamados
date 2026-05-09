import Link from 'next/link'
import { Ticket, ArrowRight, Shield, Wrench, Monitor, Clock, CheckCircle, Users } from 'lucide-react'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh' }}>
      {/* Header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        borderBottom: '1px solid rgba(139,71,255,0.12)',
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #8b47ff, #6d12ee)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(139,71,255,0.4)'
            }}>
              <Ticket size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f0eeff' }}>Acaê</span>
            <span style={{
              marginLeft: 6, fontSize: '0.7rem', fontWeight: 600,
              background: 'rgba(139,71,255,0.15)', color: 'var(--Acaê-300)',
              border: '1px solid rgba(139,71,255,0.3)', borderRadius: 6, padding: '2px 8px',
            }}>Chamados</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/login" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
              Acessar o Sistema
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ paddingTop: 140, paddingBottom: 100, textAlign: 'center', padding: '140px 1.5rem 100px' }}>
        <div className="animate-fade-in-up" style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(139,71,255,0.1)', border: '1px solid rgba(139,71,255,0.25)',
            borderRadius: 999, padding: '6px 16px', marginBottom: 32,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8b47ff', boxShadow: '0 0 8px #8b47ff' }}></span>
            <span style={{ fontSize: '0.8rem', color: 'var(--Acaê-300)', fontWeight: 600 }}>Sistema em operação</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15,
            marginBottom: 24, color: '#f0eeff',
            textShadow: '0 0 60px rgba(139,71,255,0.3)',
          }}>
            Abertura de Chamados{' '}
            <span style={{
              background: 'linear-gradient(135deg, #a673ff, #c4a8ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>Simplificada</span>
          </h1>

          <p style={{ fontSize: '1.1rem', color: 'rgba(240,238,255,0.6)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
            Abra chamados para as equipes de <strong style={{ color: 'var(--Acaê-300)' }}>TI</strong> e{' '}
            <strong style={{ color: '#7dd3fc' }}>Manutenção</strong> de forma rápida e acompanhe o status em tempo real.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" className="btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
              Abrir um Chamado
              <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="btn-secondary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
              Acessar Painel
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up animate-delay-200" style={{
          maxWidth: 800, margin: '80px auto 0',
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16
        }}>
          {[
            { icon: <Clock size={20} />, value: '< 2h', label: 'Tempo médio de resposta' },
            { icon: <CheckCircle size={20} />, value: '98%', label: 'Taxa de resolução' },
            { icon: <Users size={20} />, value: '2', label: 'Equipes disponíveis' },
            { icon: <Shield size={20} />, value: '24/7', label: 'Suporte contínuo' },
          ].map((stat, i) => (
            <div key={i} className="stat-card" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
              <div style={{ color: 'var(--Acaê-400)', marginBottom: 8, display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f0eeff', marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(240,238,255,0.45)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Areas Section */}
      <section style={{ padding: '60px 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#f0eeff', marginBottom: 12 }}>
            Equipes de Suporte
          </h2>
          <p style={{ color: 'rgba(240,238,255,0.5)', fontSize: '0.95rem' }}>
            Selecione a área correta ao abrir seu chamado
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {/* TI Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(139,71,255,0.3), rgba(109,18,238,0.3))',
              border: '1px solid rgba(139,71,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
            }}>
              <Monitor size={24} color="var(--Acaê-300)" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f0eeff', marginBottom: 12 }}>
              Tecnologia da Informação
            </h3>
            <p style={{ color: 'rgba(240,238,255,0.55)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>
              Suporte a sistemas, equipamentos de informática, rede, internet, impressoras e softwares.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Computadores e periféricos', 'Sistemas e aplicativos', 'Rede e conectividade', 'E-mail e acesso'].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'rgba(240,238,255,0.6)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--Acaê-500)', flexShrink: 0 }}></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Manutenção Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(14,165,233,0.3), rgba(3,105,161,0.3))',
              border: '1px solid rgba(14,165,233,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20,
            }}>
              <Wrench size={24} color="#7dd3fc" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f0eeff', marginBottom: 12 }}>
              Manutenção
            </h3>
            <p style={{ color: 'rgba(240,238,255,0.55)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>
              Reparos estruturais, instalações, conservação predial e infraestrutura física.
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Elétrica e hidráulica', 'Climatização (AC)', 'Reparos estruturais', 'Mobiliário e instalações'].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'rgba(240,238,255,0.6)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', flexShrink: 0 }}></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(139,71,255,0.1)',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        color: 'rgba(240,238,255,0.3)',
        fontSize: '0.85rem',
        marginTop: 60,
      }}>
        <p>© 2026 Acae — Sistema de Chamados. Todos os direitos reservados.</p>
      </footer>
    </main>
  )
}
