import { Link, useParams } from 'react-router-dom'

import { PagePlaceholder } from '@/components/PagePlaceholder'
import { mockProducts } from '@/features/catalog/mockProducts'
import { formatCurrency } from '@/lib/formatCurrency'
import { routes } from '@/lib/routes'

export function ProductDetailPage() {
  const { slug } = useParams()
  const product = mockProducts.find((item) => item.slug === slug) ?? mockProducts[0]

  return (
    <PagePlaceholder
      eyebrow={product.category}
      title={product.name}
      description="Plantilla base para la ficha de producto individual. Más adelante aquí puede vivir la galería, variantes, stock, SEO y recomendaciones."
      actions={
        <Link
          to={routes.cart}
          className="inline-flex rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-deep)]"
        >
          Ir al carrito
        </Link>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div
          className="min-h-[360px] rounded-[34px] border border-[var(--line)] shadow-[0_30px_90px_rgba(65,39,22,0.16)]"
          style={{
            background: `linear-gradient(135deg, ${product.accent} 0%, #24160f 100%)`,
          }}
        />

        <aside className="space-y-5 rounded-[34px] border border-[var(--line)] bg-[var(--surface-strong)] p-7 shadow-[0_24px_80px_rgba(65,39,22,0.09)]">
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">
            Slug activo: {product.slug}
          </p>
          <p className="text-4xl font-semibold tracking-[-0.04em] text-[var(--accent-deep)]">
            {formatCurrency(product.price)}
          </p>
          <p className="text-base leading-7 text-[var(--muted)]">
            {product.description}
          </p>
          <div className="rounded-[24px] border border-[var(--line)] bg-white p-5 text-sm leading-7 text-[var(--muted)]">
            Placeholder para variantes, materiales, tiempos de producción y CTA
            de compra.
          </div>
        </aside>
      </div>
    </PagePlaceholder>
  )
}
