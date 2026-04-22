import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { env } from '@/lib/env'
import { publicNavigation, routes } from '@/lib/routes'

export function PublicFooter() {
  return (
    <footer className="relative z-10 px-4 pb-6 md:px-6">
      <div className="mx-auto max-w-[92rem] rounded-[var(--radius-xl)] border border-[var(--line)] bg-[rgba(7,7,7,0.88)] px-6 py-10 shadow-[var(--shadow-card)] backdrop-blur-xl md:px-10 md:py-12">
        <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Badge variant="accent">Otoshimae atelier</Badge>
            <div className="space-y-4">
              <h2 className="max-w-3xl text-4xl text-[var(--foreground)] md:text-5xl">
                Objetos japoneses de autor con oscuridad elegante y acabado manual.
              </h2>
              <p className="max-w-2xl text-sm leading-8 text-[var(--foreground-soft)]">
                Mascaras oni, collares y accesorios concebidos como piezas de
                presencia: pintados a mano, trabajados en series cortas y
                terminados con una lectura editorial contemporanea.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-[var(--line)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--foreground-soft)]">
                Pintado a mano
              </span>
              <span className="rounded-full border border-[var(--line)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--foreground-soft)]">
                Pelo agregado en algunas piezas
              </span>
              <span className="rounded-full border border-[var(--line)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--foreground-soft)]">
                Stock real y series limitadas
              </span>
            </div>

            <div>
              <Button to={routes.catalog} variant="secondary">
                Explorar catalogo
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Navegacion
              </p>
              <div className="flex flex-col gap-2 text-sm text-[var(--foreground-soft)]">
                {publicNavigation.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="transition hover:text-[var(--accent-strong)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Firma
              </p>
              <div className="space-y-3 text-sm leading-7 text-[var(--foreground-soft)]">
                <p>Presencia ritual.</p>
                <p>Artesania con contraste.</p>
                <p>Estetica japonesa contemporanea.</p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Acceso
              </p>
              <div className="flex flex-col gap-2 text-sm text-[var(--foreground-soft)]">
                <Link
                  to={routes.adminLogin}
                  className="transition hover:text-[var(--accent-strong)]"
                >
                  Panel admin
                </Link>
                <span>Coleccion conectada a Supabase y stock en tiempo real.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="editorial-divider mt-10" />

        <div className="mt-6 flex flex-col gap-3 text-[11px] uppercase tracking-[0.28em] text-[var(--muted)] md:flex-row md:items-center md:justify-between">
          <span>{env.appName} / colecciones en series cortas</span>
          <span>Storefront premium con identidad de marca y checkout real</span>
        </div>
      </div>
    </footer>
  )
}
