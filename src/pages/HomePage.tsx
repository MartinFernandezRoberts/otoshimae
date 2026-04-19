import { Link } from 'react-router-dom'

import { PagePlaceholder } from '@/components/PagePlaceholder'
import { ProductGridPlaceholder } from '@/features/catalog/ProductGridPlaceholder'
import { routes } from '@/lib/routes'

export function HomePage() {
  return (
    <PagePlaceholder
      eyebrow="Otoshimae"
      title="Máscaras con identidad propia"
      description="Base del storefront para exhibir colecciones, vender piezas únicas y preparar una administración clara desde el primer sprint."
      actions={
        <Link
          to={routes.catalog}
          className="inline-flex rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)]"
        >
          Explorar catálogo
        </Link>
      }
    >
      <div className="grid gap-5 rounded-[36px] border border-[var(--line)] bg-[rgba(255,252,248,0.84)] p-6 shadow-[0_30px_100px_rgba(65,39,22,0.12)] md:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[28px] bg-[linear-gradient(135deg,#24160f_0%,#b04e1f_100%)] p-8 text-white">
          <p className="text-sm uppercase tracking-[0.28em] text-orange-100/70">
            MVP listo para crecer
          </p>
          <h2 className="mt-6 max-w-lg text-4xl font-semibold tracking-[-0.05em]">
            Storefront público y panel admin desacoplados desde la base.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-orange-50/80">
            Dejé las rutas, layouts y features preparadas para sumar catálogo real,
            carrito persistente, autenticación y gestión de pedidos sin rehacer la
            arquitectura.
          </p>
        </div>

        <div className="grid gap-4">
          {[
            'Arquitectura simple por módulos y features',
            'React Router listo para navegación pública y admin',
            'Configuración compatible con primer deploy en Vercel',
          ].map((item) => (
            <div
              key={item}
              className="rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] p-5 text-sm leading-7 text-[var(--muted)]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <ProductGridPlaceholder limit={3} />
    </PagePlaceholder>
  )
}
