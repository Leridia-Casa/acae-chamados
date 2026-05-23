'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Ticket, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import logo from './assets/logo.png';

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const isTestMode = !supabaseUrl || supabaseUrl === 'your_supabase_url_here'
    if (isTestMode) {
      // Mock login for testing purposes
      console.log('Login em modo de teste')
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 800)
      return
    }
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (authError) {
      setError('E-mail ou senha incorretos. Tente novamente.')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }
  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1.5rem',
      background: 'radial-gradient(ellipse at 50% 40%, rgba(139,71,255,0.12) 0%, transparent 60%)',
    }}>
      <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 15 }}>
          <div style={{
            width: 200, height: 200, borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <img src="/logo.png"
              alt="logo.png"
              width={250} height={250}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16 }} />
          </div>
        </div>
        {/* Card */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0eeff', marginBottom: 4 }}>
            Entrar na sua conta
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'rgba(240,238,255,0.45)', marginBottom: 24 }}>
            Insira seu e-mail e senha para continuar
          </p>
          {error && (
            <div className="alert-error" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="form-label">E-mail</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'rgba(240,238,255,0.3)'
                }} />
                <input
                  id="email"
                  type="email"
                  className="Acaê-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="seu@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label className="form-label">Senha</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                  color: 'rgba(240,238,255,0.3)'
                }} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="Acaê-input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(240,238,255,0.35)', padding: 0, display: 'flex',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              id="login-btn"
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: 4, width: '100%', padding: '0.75rem' }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 16, height: 16, borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                  }} />
                  Entrando...
                </>
              ) : 'Entrar'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.82rem', color: 'rgba(240,238,255,0.3)' }}>
          Acesso restrito. Fale com o administrador para obter credenciais.
        </p>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  )
}