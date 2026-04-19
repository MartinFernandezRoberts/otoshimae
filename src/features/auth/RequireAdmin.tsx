import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { useAuth } from '@/features/auth/useAuth'
import { routes } from '@/lib/routes'

export function RequireAdmin() {
  const location = useLocation()
  const { isAdmin, loading, session } = useAuth()

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--admin)] px-5">
        <Card tone="admin" className="w-full max-w-md p-8 text-center">
          <Loader size="lg" label="Verificando acceso admin..." className="justify-center" />
        </Card>
      </main>
    )
  }

  if (!session || !isAdmin) {
    return (
      <Navigate
        to={routes.adminLogin}
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    )
  }

  return <Outlet />
}
