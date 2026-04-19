import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/features/auth/useAuth'
import { routes } from '@/lib/routes'

export function RedirectIfAuthenticated() {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return <Outlet />
  }

  if (isAdmin) {
    return <Navigate to={routes.admin} replace />
  }

  return <Outlet />
}
