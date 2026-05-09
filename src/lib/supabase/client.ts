import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || supabaseUrl === 'your_supabase_url_here' || !supabaseKey || supabaseKey === 'your_supabase_anon_key_here') {
    const mockQuery = {
      eq: () => mockQuery,
      order: () => mockQuery,
      limit: () => mockQuery,
      neq: () => mockQuery,
      single: async () => ({ data: { id: 'mock-id', full_name: 'Admin Teste', role: 'admin', email: 'admin@acai.com' }, error: null }),
      select: () => mockQuery,
      insert: async () => ({ error: null }),
      upsert: async () => ({ error: null }),
      then: (cb: any) => Promise.resolve({ data: [], count: 0, error: null }).then(cb),
    } as any

    return {
      auth: {
        getUser: async () => ({ data: { user: { id: 'mock-id', email: 'admin@acai.com' } }, error: null }),
        signInWithPassword: async () => ({ data: { user: {} }, error: null }),
        signOut: async () => ({ error: null }),
      },
      from: () => mockQuery,
    } as any
  }

  return createBrowserClient(
    supabaseUrl!,
    supabaseKey!
  )
}
