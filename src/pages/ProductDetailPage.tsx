import { useParams } from 'react-router-dom'

import { PagePlaceholder } from '@/components/PagePlaceholder'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
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
      description="Primera ficha de producto con tono editorial, materialidad visible y estructura preparada para sumar galería, stock y contenido comercial."
      actions={<Button to={routes.cart}>Ir al carrito</Button>}
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div
          className="min-h-[420px] rounded-[var(--radius-xl)] border border-[var(--line)] shadow-[var(--shadow-card)]"
          style={{
            background: `radial-gradient(circle at 50% 20%, ${product.accent} 0%, rgba(255,255,255,0) 26%), linear-gradient(135deg, #181a1f 0%, #060709 100%)`,
          }}
        />

        <Card as="aside" className="space-y-5 p-7">
          <div className="flex flex-wrap gap-2">
            <Badge variant="accent">{product.edition}</Badge>
            <Badge>{product.material}</Badge>
          </div>
          <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">
            Slug activo: {product.slug}
          </p>
          <p className="text-4xl text-[var(--accent)]">
            {formatCurrency(product.price)}
          </p>
          <p className="text-base leading-7 text-[var(--foreground-soft)]">
            {product.description}
          </p>
          <Card tone="muted" className="p-5 text-sm leading-7 text-[var(--foreground-soft)]">
            Placeholder para variantes, tiempos de producción, fotografía real y recomendaciones cruzadas.
          </Card>
        </Card>
      </div>
    </PagePlaceholder>
  )
}
