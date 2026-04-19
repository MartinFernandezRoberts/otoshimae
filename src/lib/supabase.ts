import { createClient } from '@supabase/supabase-js'

import { env, hasSupabaseEnv } from '@/lib/env'

export const supabase = hasSupabaseEnv
  ? createClient(env.supabaseUrl, env.supabasePublishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null

export function ensureSupabase() {
  if (!supabase) {
    throw new Error(
      'Faltan VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en el entorno.',
    )
  }

  return supabase
}
