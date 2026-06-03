import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  
  const body = await request.json()
  const { id, full_name, role, area } = body
  if (!id || !full_name || !role) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
  }

  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Atualiza nome nos metadados do Auth
  const { error: updateError } = await adminSupabase.auth.admin.updateUserById(id, {
    user_metadata: { full_name }
  })
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 })
  }

  // Atualiza perfil no banco público
  const { data: updatedProfile, error: profileError } = await adminSupabase
    .from('profiles')
    .update({
      full_name,
      role,
      area: area || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  return NextResponse.json({ profile: updatedProfile })
}
