import { Link } from 'react-router-dom'

import { PagePlaceholder } from '@/components/PagePlaceholder'
import { routes } from '@/lib/routes'

export function NotFoundPage() {
  return (
    <PagePlaceholder
      eyebrow="404"
      title="Página no encontrada"
      description="La ruta existe como base del SPA, pero este destino todavía no fue definido dentro del proyecto."
      actions={
        <Link
          to={routes.home}
          className="inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)]"
        >
          Volver al inicio
        </Link>
      }
    >
      <div className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] p-6 text-sm leading-7 text-[var(--muted)]">
        El rewrite de Vercel ya quedó configurado para que React Router pueda
        resolver este tipo de rutas del lado del cliente.
      </div>
    </PagePlaceholder>
  )
}
