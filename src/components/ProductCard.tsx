import { useState } from 'react'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { getPrimaryProductImage } from '@/features/catalog/catalog.utils'
import { useCart } from '@/features/cart/useCart'
import { formatCurrency } from '@/lib/formatCurrency'
import { buildProductPath } from '@/lib/routes'
import type { PublicProductSummary } from '@/types/database'

type ProductCardProps = {
  product: PublicProductSummary
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error'
    message: string
  } | null>(null)

  const primaryImage = getPrimaryProductImage(product)
  const hasComparePrice =
    typeof product.compare_price === 'number' &&
    product.compare_price > product.price

  const handleAddToCart = () => {
    const result = addItem({ product })

    setFeedback(
      result.success
        ? {
            tone: 'success',
            message: 'Pieza agregada al carrito.',
          }
        : {
            tone: 'error',
            message: result.message ?? 'No fue posible agregar la pieza.',
          },
    )
  }

  return (
    <Card as="article" className="group overflow-hidden p-0">
      <div className="relative aspect-[4/5] overflow-hidden border-b border-[var(--line)] bg-[linear-gradient(145deg,#171411_0%,#070707_100%)]">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_18%,rgba(209,178,138,0.16),transparent_24%),linear-gradient(145deg,#171411_0%,#070707_100%)]">
            <span className="text-5xl font-semibold tracking-[0.24em] text-[rgba(245,240,232,0.16)]">
              O
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.02)_0%,rgba(7,7,7,0.18)_38%,rgba(7,7,7,0.92)_100%)]" />

        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          {product.category ? <Badge variant="accent">{product.category.name}</Badge> : null}
          {product.is_featured ? <Badge>Atelier pick</Badge> : null}
          <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
            {product.stock > 0 ? `${product.stock} disponibles` : 'Serie agotada'}
          </Badge>
        </div>

        <div className="absolute inset-x-5 bottom-5">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--foreground-soft)]">
            {product.sku ? `SKU ${product.sku}` : 'Pieza Otoshimae'}
          </p>
          <h3 className="mt-2 text-4xl text-[var(--foreground)]">{product.name}</h3>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <p className="min-h-16 text-sm leading-8 text-[var(--foreground-soft)]">
          {product.short_description ??
            product.description ??
            'Pieza de autor con presencia japonesa contemporanea y acabado manual.'}
        </p>

        <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--muted)]">
          <span className="rounded-full border border-[var(--line)] px-3 py-1">
            Pintado a mano
          </span>
          <span className="rounded-full border border-[var(--line)] px-3 py-1">
            Estetica editorial
          </span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
              Precio
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-3xl text-[var(--accent-strong)]">
                {formatCurrency(product.price)}
              </p>
              {hasComparePrice ? (
                <span className="text-sm text-[var(--muted)] line-through">
                  {formatCurrency(product.compare_price ?? 0)}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {feedback ? (
          <StatusMessage tone={feedback.tone} message={feedback.message} />
        ) : null}

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? 'Agregar pieza' : 'Sin stock'}
          </Button>
          <Button
            to={buildProductPath(product.slug)}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Ver ficha
          </Button>
        </div>
      </div>
    </Card>
  )
}
