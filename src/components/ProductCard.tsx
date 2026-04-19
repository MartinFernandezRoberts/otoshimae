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
      <div className="relative h-72 overflow-hidden border-b border-[var(--line)] bg-[linear-gradient(145deg,#15171b_0%,#08090b_100%)]">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(207,183,154,0.16),transparent_24%),linear-gradient(145deg,#15171b_0%,#08090b_100%)]" />
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,10,0.04)_0%,rgba(7,8,10,0.18)_45%,rgba(7,8,10,0.85)_100%)]" />

        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          {product.category ? <Badge>{product.category.name}</Badge> : null}
          <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
            {product.stock > 0 ? `Stock ${product.stock}` : 'Agotado'}
          </Badge>
        </div>

        <div className="absolute inset-x-5 bottom-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
            {product.sku ? `SKU ${product.sku}` : 'Pieza Otoshimae'}
          </p>
          <h3 className="mt-2 text-3xl text-[var(--foreground)]">{product.name}</h3>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <p className="min-h-14 text-sm leading-7 text-[var(--foreground-soft)]">
          {product.short_description ??
            product.description ??
            'Mascara con caracter artesanal y lectura contemporanea.'}
        </p>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              Precio
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="text-2xl text-[var(--accent)]">
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

        <div className="flex flex-wrap gap-3">
          <Button
            className="flex-1"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
          </Button>
          <Button
            to={buildProductPath(product.slug)}
            variant="secondary"
            className="flex-1"
          >
            Ver detalle
          </Button>
        </div>
      </div>
    </Card>
  )
}
