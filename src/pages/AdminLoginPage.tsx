import { Link } from 'react-router-dom'

import { AdminLoginPanel } from '@/features/auth/AdminLoginPanel'
import { usePageTitle } from '@/hooks/usePageTitle'

export function AdminLoginPage() {
  usePageTitle('Acceso administrador')

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-10 md:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <Link
          to="/"
          className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)]"
        >
          Volver al sitio
        </Link>
        <AdminLoginPanel />
      </div>
    </main>
  )
}
