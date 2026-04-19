import { Navigate, Outlet } from 'react-router-dom'

import { Card } from '@/components/ui/Card'
import { Loader } from '@/components/ui/Loader'
import { useAuth } from '@/features/auth/useAuth'
import { routes } from '@/lib/routes'

export function RedirectIfAuthenticated() {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-5">
        <Card className="w-full max-w-md p-8 text-center">
          <Loader size="lg" label="Verificando sesion..." className="justify-center" />
        </Card>
      </main>
    )
  }

  if (isAdmin) {
    return <Navigate to={routes.admin} replace />
  }

  return <Outlet />
}
