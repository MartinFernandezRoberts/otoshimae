import { createContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'

import type { AdminUserRow } from '@/types/database'

export type AuthContextValue = {
  session: Session | null
  user: User | null
  adminUser: AdminUserRow | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)
