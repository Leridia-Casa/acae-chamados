import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here' || !supabaseKey || supabaseKey === 'your_supabase_anon_key_here') {
    // Better mock client with chaining support
    const mockQuery = {
      eq: () => mockQuery,
      order: () => mockQuery,
      limit: () => mockQuery,
      neq: () => mockQuery,
      single: async () => ({ data: { id: 'mock-id', full_name: 'Admin Teste', role: 'admin', email: 'admin@Acaê' }, error: null }),
      select: () => mockQuery,
      then: (cb: any) => Promise.resolve({ data: [], count: 0, error: null }).then(cb),
    } as any
    return {
      auth: {
        getUser: async () => ({ data: { user: { id: 'mock-id', email: 'admin@Acaê' } }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: {} }, error: null }),
        signOut: async () => ({ error: null }),
      },
      from: () => mockQuery,
    } as any
  }
  const cookieStore = await cookies()
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}