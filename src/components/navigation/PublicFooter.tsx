import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import { publicNavigation, routes } from '@/lib/routes'

export function PublicFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[rgba(8,9,11,0.94)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <Badge variant="accent">Otoshimae</Badge>
          <h2 className="max-w-xl text-3xl text-[var(--foreground)]">
            Máscaras con presencia editorial, gesto artesanal y lectura contemporánea.
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-[var(--foreground-soft)]">
            Base visual del storefront y del panel administrativo, preparada para crecer hacia catálogo real, checkout y operación interna.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              Navegación
            </p>
            <div className="flex flex-col gap-2 text-sm text-[var(--foreground-soft)]">
              {publicNavigation.map((item) => (
                <Link key={item.to} to={item.to} className="transition hover:text-[var(--accent)]">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              Acceso
            </p>
            <div className="flex flex-col gap-2 text-sm text-[var(--foreground-soft)]">
              <Link to={routes.adminLogin} className="transition hover:text-[var(--accent)]">
                Admin
              </Link>
              <span>Tienda en construcción para primer release</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
