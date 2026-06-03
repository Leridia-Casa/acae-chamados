/* eslint-disable @next/next/no-img-element */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AppShell } from '@/components/app-shell'
import { PriorityBadge } from '@/components/badges'

import {
  Send,
  AlertCircle,
  CheckCircle,
  MapPin,
  Monitor,
  Wrench,
  ChevronDown,
  Image as ImageIcon,
  Sparkles,
  Users,
  Briefcase
} from 'lucide-react'

type Area =
  | 'TI'
  | 'Manutenção Predial'
  | 'Limpeza'
  | 'Coordenação'
  | 'Administrativo'

type Priority = 'Baixa' | 'Média' | 'Alta' | 'Urgente'

const areas = [
  {
    value: 'TI',
    label: 'Tecnologia da Informação',
    icon: <Monitor size={22} />
  },
  {
    value: 'Manutenção Predial',
    label: 'Manutenção Predial',
    icon: <Wrench size={22} />
  },
  {
    value: 'Limpeza',
    label: 'Limpeza',
    icon: <Sparkles size={22} />
  },
  {
    value: 'Coordenação',
    label: 'Coordenação',
    icon: <Users size={22} />
  },
  {
    value: 'Administrativo',
    label: 'Administrativo',
    icon: <Briefcase size={22} />
  }
]

export default function NovoChamadoPage() {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [protocol, setProtocol] = useState('')
  const [error, setError] = useState('')

  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    area: '' as Area | '',
    priority: 'Média' as Priority,
    location: '',
    description: '',
  })

  const generateProtocol = () => {
    const year = new Date().getFullYear()
    const rand = Math.floor(Math.random() * 90000) + 10000

    return `Acaê-${year}-${rand}`
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Selecione uma imagem válida')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB')
      return
    }

    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.area) {
      setError('Selecione uma área')
      return
    }

    setLoading(true)
    setError('')

    const supabase = createClient()

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    let imageUrl = null

    // upload da imagem
    if (image) {
      const fileExt = image.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('tickets')
        .upload(fileName, image)

      if (uploadError) {
        console.error('Storage error:', uploadError)
        setError('Erro ao enviar imagem: ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data } = supabase.storage
        .from('tickets')
        .getPublicUrl(fileName)

      imageUrl = data.publicUrl
    }

    const proto = generateProtocol()

    const { error: insertError } = await supabase
      .from('tickets')
      .insert({
        protocol: proto,
        title: form.title,
        area: form.area,
        priority: form.priority,
        location: form.location,
        description: form.description,
        image_url: imageUrl,
        status: 'Aberto',
        user_id: user.id,
      })

    if (insertError) {
      setError('Erro ao abrir chamado: ' + insertError.message)
      setLoading(false)
      return
    }

    setProtocol(proto)
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <AppShell>
        <div
          style={{
            padding: '1rem',
            maxWidth: 600,
            margin: '0 auto',
            paddingTop: 'min(4rem, 10vh)'
          }}
        >
          <div
            className="glass-card"
            style={{
              padding: '2rem',
              textAlign: 'center'
            }}
          >
            <CheckCircle
              size={56}
              color="#6ee7b7"
              style={{ marginBottom: 20 }}
            />

            <h2
              style={{
                fontSize: '1.5rem',
                color: '#fff',
                marginBottom: 12
              }}
            >
              Chamado Aberto!
            </h2>

            <p
              style={{
                color: 'rgba(255,255,255,0.6)',
                marginBottom: 20
              }}
            >
              Seu chamado foi registrado com sucesso.
            </p>

            <div
              style={{
                background: 'rgba(139,71,255,0.1)',
                padding: '1rem',
                borderRadius: 12,
                marginBottom: 24
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  opacity: 0.6
                }}
              >
                PROTOCOLO
              </p>

              <strong
                style={{
                  fontSize: 20,
                  color: '#c084fc'
                }}
              >
                {protocol}
              </strong>
            </div>

            <button
              className="btn-primary"
              onClick={() => router.push('/chamados')}
            >
              Ver meus chamados
            </button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div
        style={{
          padding: '2rem',
          maxWidth: 720,
          margin: '0 auto'
        }}
      >
        <h1
          style={{
            fontSize: '1.7rem',
            fontWeight: 800,
            color: '#fff',
            marginBottom: 8
          }}
        >
          Abrir Chamado
        </h1>

        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 24
          }}
        >
          Preencha as informações abaixo
        </p>

        {error && (
          <div className="alert-error" style={{ marginBottom: 20 }}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}
        >
          {/* ÁREA */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <label className="form-label">
              Área de Atendimento *
            </label>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit,minmax(240px,1fr))',
                gap: 12
              }}
            >
              {areas.map((area) => (
                <button
                  key={area.value}
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      area: area.value as Area
                    }))
                  }
                  style={{
                    padding: '1.5rem',
                    borderRadius: 12,
                    border:
                      form.area === area.value
                        ? '2px solid #8b47ff'
                        : '1px solid rgba(255,255,255,0.1)',
                    background:
                      form.area === area.value
                        ? 'rgba(139,71,255,0.15)'
                        : 'transparent',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  {area.icon}

                  <div style={{ marginTop: 10 }}>
                    {area.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* INFORMAÇÕES ADICIONAIS */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {/* TITULO */}
              <div>
                <label className="form-label">
                  Assunto / Título *
                </label>

            <input
              type="text"
              className="Acaê-input"
              placeholder="Ex: Computador não liga"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  title: e.target.value
                }))
              }
              required
            />
              </div>

              {/* PRIORIDADE */}
              <div>
                <label className="form-label">
                  Prioridade *
                </label>

            <div style={{ position: 'relative' }}>
              <select
                className="Acaê-select"
                value={form.priority}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    priority: e.target.value as Priority
                  }))
                }
              >
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
                <option value="Urgente">Urgente</option>
              </select>

              <ChevronDown
                size={14}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
            </div>

            <div style={{ marginTop: 10 }}>
              <PriorityBadge priority={form.priority} />
            </div>
              </div>
            </div>

            {/* LOCAL */}
            <div>
              <label className="form-label">
                Localização / Setor
              </label>

            <div style={{ position: 'relative' }}>
              <MapPin
                size={16}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              />

              <input
                type="text"
                className="Acaê-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Ex: Sala 201"
                value={form.location}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    location: e.target.value
                  }))
                }
              />
            </div>
            </div>

            {/* DESCRIÇÃO */}
            <div>
              <label className="form-label">
                Descrição Detalhada *
              </label>

            <textarea
              className="Acaê-textarea"
              placeholder="Descreva o problema..."
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  description: e.target.value
                }))
              }
              required
              minLength={20}
              style={{ minHeight: 140 }}
            />

            <div
              style={{
                textAlign: 'right',
                marginTop: 8,
                fontSize: 12,
                opacity: 0.4
              }}
            >
              {form.description.length} caracteres
            </div>
            </div>

            {/* FOTO */}
            <div>
              <div className="form-label">
                Anexar Foto
              </div>

            <div
              style={{
                border: '1px dashed rgba(139,71,255,0.3)',
                borderRadius: 14,
                padding: '1.5rem',
                textAlign: 'center',
                background: 'rgba(139,71,255,0.04)'
              }}
            >
              <label
                htmlFor="ticket-image"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  minHeight: 180,
                  gap: 12,
                  padding: '1rem 0'
                }}
              >
                <ImageIcon
                  size={32}
                  color="rgba(255,255,255,0.5)"
                />

                <div
                  style={{
                    marginTop: 0,
                    color: 'rgba(255,255,255,0.85)',
                    fontWeight: 700,
                    fontSize: '0.98rem'
                  }}
                >
                  Clique para anexar uma imagem
                </div>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.65rem 1.2rem',
                    borderRadius: 9999,
                    background: 'rgba(139,71,255,0.18)',
                    color: '#fff',
                    fontWeight: 600,
                    border: '1px solid rgba(139,71,255,0.35)',
                    transition: 'background 0.2s ease'
                  }}
                >
                  Selecionar imagem
                </div>

                <p
                  style={{
                    marginTop: 0,
                    fontSize: 12,
                    opacity: 0.5
                  }}
                >
                  PNG, JPG ou JPEG • Máximo 5MB
                </p>
              </label>

              <input
                id="ticket-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    marginTop: 20,
                    borderRadius: 12,
                    maxHeight: 260,
                    objectFit: 'cover'
                  }}
                />
              )}
            </div>
          </div>
          </div>

          {/* BOTÕES */}
          <div
            style={{
              display: 'flex',
              gap: 12
            }}
          >
            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.back()}
              style={{ flex: 1 }}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ flex: 2 }}
            >
              {loading ? 'Enviando...' : (
                <>
                  <Send size={16} />
                  Abrir Chamado
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
