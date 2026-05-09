import { TicketStatus, TicketPriority, TicketArea, UserRole } from '@/lib/types'

import { Circle } from 'lucide-react'

const statusConfig: Record<TicketStatus, { label: string; className: string; dot: string }> = {

  'Aberto': { label: 'Aberto', className: 'badge-aberto', dot: '#93c5fd' },

  'Em Andamento': { label: 'Em Andamento', className: 'badge-em_andamento', dot: '#fcd34d' },

  'Aguardando': { label: 'Aguardando', className: 'badge-aguardando', dot: '#c4b5fd' },

  'Resolvido': { label: 'Resolvido', className: 'badge-resolvido', dot: '#6ee7b7' },

  'Fechado': { label: 'Fechado', className: 'badge-fechado', dot: '#9ca3af' },

}

const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {

  'Baixa': { label: 'Baixa', className: 'badge-baixa' },

  'Média': { label: 'Média', className: 'badge-media' },

  'Alta': { label: 'Alta', className: 'badge-alta' },

  'Urgente': { label: 'ðŸ”´ Urgente', className: 'badge-urgente' },

}

const areaConfig: Record<TicketArea, { label: string; className: string }> = {

  'TI': { label: 'ðŸ’» TI', className: 'badge-ti' },

  'Manutenção': { label: 'ðŸ”§ Manutenção', className: 'badge-manutencao' },

}

const roleConfig: Record<UserRole, { label: string; className: string }> = {

  'admin': { label: 'ðŸ‘‘ Admin', className: 'badge-admin' },

  'tecnico': { label: 'ðŸ”§ Técnico', className: 'badge-tecnico' },

  'usuario': { label: 'ðŸ‘¤ Usuário', className: 'badge-usuario' },

}

export function StatusBadge({ status }: { status: TicketStatus }) {

  const config = statusConfig[status]

  return (

    <span className={`badge ${config.className}`}>

      <span style={{ width: 6, height: 6, borderRadius: '50%', background: config.dot, display: 'inline-block' }} />

      {config.label}

    </span>

  )

}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {

  const config = priorityConfig[priority]

  return <span className={`badge ${config.className}`}>{config.label}</span>

}

export function AreaBadge({ area }: { area: TicketArea }) {

  const config = areaConfig[area]

  return <span className={`badge ${config.className}`}>{config.label}</span>

}

export function RoleBadge({ role }: { role: UserRole }) {

  const config = roleConfig[role]

  return <span className={`badge ${config.className}`}>{config.label}</span>

}
