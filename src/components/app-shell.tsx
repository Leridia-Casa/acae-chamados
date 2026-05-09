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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 40, display: 'none',
          }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0,
        background: 'rgba(10,10,15,0.95)',
        borderRight: '1px solid rgba(139,71,255,0.1)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
        backdropFilter: 'blur(20px)',
      }}>
        {/* Logo */}
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid rgba(139,71,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #8b47ff, #6d12ee)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139,71,255,0.4)', flexShrink: 0,
            }}>
              <Ticket size={16} color="#fff" />
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
              className={`nav-item ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
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
                  className={`nav-item ${pathname === item.href || pathname.startsWith(item.href + '/') ? 'active' : ''}`}
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
                  className={`nav-item ${pathname === item.href ? 'active' : ''}`}
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
                {profile.role === 'admin' ? '👑 Admin' : profile.role === 'tecnico' ? '🔧 Técnico' : '👤 Usuário'}
              </span>
            </div>
          )}
          <button className="btn-ghost" onClick={handleLogout} style={{ width: '100%', justifyContent: 'flex-start', padding: '0.5rem 0.75rem', fontSize: '0.85rem', color: 'rgba(240,238,255,0.45)' }}>
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh', padding: '0' }}>
        {children}
      </main>
    </div>
  )
}
