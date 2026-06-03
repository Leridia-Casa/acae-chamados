'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'
import {

  Ticket, LayoutDashboard, Plus, List, Settings,
  LogOut, Users, ChevronRight, Menu, X, Shield
} from 'lucide-react'
interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (!mobile) setSidebarOpen(false)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar on path change (mobile)
  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [pathname, isMobile])

  const loadProfile = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    if (data) setProfile(data as Profile)
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const isAdmin = profile?.role === 'admin'
  const isTecnico = profile?.role === 'tecnico' || isAdmin

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    if (href === '/chamados') return pathname === '/chamados' || (pathname.startsWith('/chamados/') && !pathname.includes('novo'))
    return pathname === href || pathname.startsWith(href + '/')
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { href: '/chamados/novo', label: 'Novo Chamado', icon: <Plus size={18} /> },
    { href: '/chamados', label: 'Meus Chamados', icon: <List size={18} /> },
  ]

  const adminItems = [
    { href: '/admin', label: 'Painel Admin', icon: <Shield size={18} /> },
    { href: '/admin/chamados', label: 'Todos os Chamados', icon: <Ticket size={18} /> },
    { href: '/admin/usuarios', label: 'Usuários', icon: <Users size={18} /> },
  ]

  const techItems = [
    { href: '/admin/chamados', label: 'Chamados da Equipe', icon: <Ticket size={18} /> },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      {/* Mobile Header */}
      {isMobile && (
        <header style={{
          height: 60,
          background: 'rgba(10,10,15,0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(139,71,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1rem',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 45,
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logo.png" alt="Acaê" style={{ width: 32, height: 32, objectFit: 'contain' }} />
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#f0eeff' }}>Acaê</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ 
              background: 'rgba(139,71,255,0.1)', 
              border: '1px solid rgba(139,71,255,0.2)', 
              borderRadius: 8, 
              padding: 6,
              color: 'var(--Acaê-300)',
              display: 'flex'
            }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>
      )}

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Overlay mobile */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 49,
            }}
          />
        )}

        {/* Sidebar */}
        <aside style={{
          width: 240,
          flexShrink: 0,
          background: 'rgba(10,10,15,0.98)',
          borderRight: '1px solid rgba(139,71,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: isMobile ? (sidebarOpen ? 0 : -240) : 0,
          bottom: 0,
          zIndex: 50,
          backdropFilter: 'blur(20px)',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}>
          {/* Logo */}
          <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(139,71,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 42, height: 42,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden',
              }}>
                <img 
                  src="/logo.png" 
                  alt="Acaê" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                    filter: 'brightness(1.2) contrast(1.1)' 
                  }} 
                />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f0eeff', lineHeight: 1 }}>Acaê</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(240,238,255,0.35)', marginTop: 2 }}>Chamados</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(240,238,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.5rem', marginBottom: 4 }}>
              Principal
            </div>
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}

            {isAdmin && (
              <>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(240,238,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.5rem', marginTop: 12, marginBottom: 4 }}>
                  Administração
                </div>
                {adminItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </>
            )}

            {isTecnico && !isAdmin && (
              <>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(240,238,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 0.5rem', marginTop: 12, marginBottom: 4 }}>
                  Equipe
                </div>
                {techItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-item ${isActive(item.href) ? 'active' : ''}`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* User */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(139,71,255,0.1)' }}>
            {profile && (
              <div style={{ marginBottom: 8, padding: '0.625rem 0.75rem', borderRadius: 10, background: 'rgba(139,71,255,0.06)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f0eeff', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile.full_name}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(240,238,255,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>
                  {profile.email}
                </div>
                <span className={`badge badge-${profile.role}`} style={{ fontSize: '0.65rem' }}>
                  {profile.role === 'admin' ? 'Admin' : profile.role === 'tecnico' ? 'Técnico' : 'Usuário'}
                </span>
              </div>
            )}
            <button className="btn-ghost" onClick={handleLogout} style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: 'rgba(240,238,255,0.45)' }}>
              <LogOut size={16} />
              Sair
            </button>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Link href="/creditos" style={{ color: 'rgba(240,238,255,0.3)', fontSize: '0.7rem', textDecoration: 'none' }}>
                Créditos e Sobre
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main style={{ 
          flex: 1, 
          marginLeft: isMobile ? 0 : 240, 
          marginTop: isMobile ? 60 : 0,
          minHeight: '100vh', 
          padding: '0',
          transition: 'margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          width: '100%',
          overflowX: 'hidden'
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}