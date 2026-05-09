// Supabase client types for the Acae ticket system

export type UserRole = 'admin' | 'tecnico' | 'usuario'

export type TicketArea = 'TI' | 'Manutenção'

export type TicketStatus =
  | 'Aberto'
  | 'Em Andamento'
  | 'Aguardando'
  | 'Resolvido'
  | 'Fechado'

export type TicketPriority = 'Baixa' | 'Média' | 'Alta' | 'Urgente'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  area?: TicketArea
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: string
  protocol: string
  title: string
  description: string
  area: TicketArea
  priority: TicketPriority
  status: TicketStatus
  location: string
  user_id: string
  assigned_to?: string
  created_at: string
  updated_at: string
  resolved_at?: string
  // Relations
  user?: Profile
  assigned_user?: Profile
  comments?: TicketComment[]
}

export interface TicketComment {
  id: string
  ticket_id: string
  user_id: string
  content: string
  is_internal: boolean
  created_at: string
  user?: Profile
}

export interface DashboardStats {
  total: number
  aberto: number
  em_andamento: number
  resolvido: number
  urgente: number
}
