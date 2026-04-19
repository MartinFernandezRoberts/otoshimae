import { useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { Session } from '@supabase/supabase-js'

import { AuthContext, type AuthContextValue } from '@/features/auth/auth-context'
import { ensureSupabase, supabase } from '@/lib/supabase'
import type { AdminUserRow } from '@/types/database'

const missingConfigMessage =
  'Faltan las variables de Supabase. Revisa tu .env.local o la configuración de Vercel.'

async function fetchAdminUser(userId: string) {
  const client = ensureSupabase()
  const { data, error } = await client
    .from('admin_users')
    .select('id, email, full_name, role, is_active, created_at')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data as AdminUserRow | null
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [adminUser, setAdminUser] = useState<AdminUserRow | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) {
      return undefined
    }

    let cancelled = false

    const syncSession = async (nextSession: Session | null) => {
      setSession(nextSession)

      if (!nextSession?.user) {
        if (!cancelled) {
          setAdminUser(null)
          setLoading(false)
        }
        return
      }

      try {
        const nextAdminUser = await fetchAdminUser(nextSession.user.id)

        if (!cancelled) {
          setAdminUser(nextAdminUser?.is_active ? nextAdminUser : null)
        }
      } catch {
        if (!cancelled) {
          setAdminUser(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void supabase.auth.getSession().then(({ data }) => syncSession(data.session))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncSession(nextSession)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      adminUser,
      isAdmin: Boolean(adminUser?.is_active),
      loading,
      signIn: async (email, password) => {
        if (!supabase) {
          return { error: missingConfigMessage }
        }

        setLoading(true)

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setLoading(false)
          return { error: error.message }
        }

        try {
          const nextAdminUser = await fetchAdminUser(data.user.id)

          if (!nextAdminUser?.is_active) {
            await supabase.auth.signOut()
            setAdminUser(null)
            setLoading(false)
            return {
              error:
                'Tu usuario existe, pero no tiene acceso al panel admin. Agrega el registro en admin_users.',
            }
          }

          setAdminUser(nextAdminUser)
          setLoading(false)
          return { error: null }
        } catch {
          await supabase.auth.signOut()
          setAdminUser(null)
          setLoading(false)
          return {
            error:
              'No se pudo verificar el acceso admin. Revisa la tabla admin_users y sus políticas.',
          }
        }
      },
      signOut: async () => {
        if (!supabase) {
          return
        }

        await supabase.auth.signOut()
        setAdminUser(null)
      },
    }),
    [adminUser, loading, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
