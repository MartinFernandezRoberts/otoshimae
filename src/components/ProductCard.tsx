import { useMemo, useState } from 'react'

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

function getProductTags(product: PublicProductSummary) {
  const normalizedCategory = product.category?.name?.toLowerCase() ?? ''
  const tags = ['Pintado a mano']

  if (product.is_featured) {
    tags.push('Pieza de autor')
  } else {
    tags.push('Edicion artesanal')
  }

  if (
    normalizedCategory.includes('mascar') ||
    normalizedCategory.includes('oni')
  ) {
    tags.push('Inspiracion japonesa')
  } else if (normalizedCategory.includes('collar')) {
    tags.push('Inspiracion japonesa')
  } else {
    tags.push('Serie boutique')
  }

  return tags.slice(0, 3)
}

function getCollectionCopy(product: PublicProductSummary) {
  const normalizedCategory = product.category?.name?.toLowerCase() ?? ''

  if (
    normalizedCategory.includes('mascar') ||
    normalizedCategory.includes('oni')
  ) {
    return 'Rostro ritual de lectura contemporanea'
  }

  if (normalizedCategory.includes('collar')) {
    return 'Accesorio de autor para presencia diaria'
  }

  return 'Objeto artesanal con firma oscura'
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
  const productTags = useMemo(() => getProductTags(product), [product])
  const collectionCopy = useMemo(() => getCollectionCopy(product), [product])

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
    <Card
      as="article"
      className="group overflow-hidden p-0 transition duration-500 hover:-translate-y-1"
    >
      <div className="relative aspect-[5/6] overflow-hidden border-b border-[var(--line)] bg-[linear-gradient(145deg,#171411_0%,#070707_100%)]">
        {primaryImage ? (
          <img
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_18%,rgba(184,138,95,0.18),transparent_24%),linear-gradient(145deg,#171411_0%,#070707_100%)]">
            <span className="text-5xl font-semibold tracking-[0.24em] text-[rgba(244,237,226,0.16)]">
              O
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.06)_0%,rgba(7,7,7,0.1)_26%,rgba(7,7,7,0.84)_100%)]" />

        <div className="absolute inset-x-5 top-5 flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {product.category ? <Badge variant="accent">{product.category.name}</Badge> : null}
            {product.is_featured ? <Badge>Pieza de autor</Badge> : null}
          </div>

          <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
            {product.stock > 0 ? `${product.stock} disponibles` : 'Serie agotada'}
          </Badge>
        </div>

        <div className="absolute inset-x-5 bottom-5 space-y-3">
          <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--foreground-soft)]">
            {product.sku ? `SKU ${product.sku}` : collectionCopy}
          </p>
          <h3 className="max-w-[14ch] text-4xl leading-[0.92] text-[var(--foreground)]">
            {product.name}
          </h3>

          <div className="translate-y-3 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="inline-flex rounded-full border border-[rgba(244,237,226,0.14)] bg-[rgba(7,7,7,0.44)] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[var(--foreground-soft)] backdrop-blur">
              Ver detalle y acabados
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
            Curaduria de coleccion
          </p>
          <p className="min-h-16 text-sm leading-8 text-[var(--foreground-soft)]">
            {product.short_description ??
              product.description ??
              'Pieza de autor con presencia japonesa contemporanea, acabado manual y composicion de boutique.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {productTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--foreground-soft)] transition group-hover:border-[rgba(184,138,95,0.22)] group-hover:text-[var(--foreground)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="ui-surface-inset rounded-[var(--radius-md)] p-4">
          <div className="flex items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Precio atelier
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

            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Estado
              </p>
              <p className="mt-2 text-sm text-[var(--foreground)]">
                {product.stock > 0 ? 'Lista para salir del taller' : 'En espera de nueva serie'}
              </p>
            </div>
          </div>
        </div>

        {feedback ? (
          <StatusMessage tone={feedback.tone} message={feedback.message} />
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
          </Button>
          <Button
            to={buildProductPath(product.slug)}
            variant="secondary"
            className="w-full"
          >
            Ver detalle
          </Button>
        </div>
      </div>
    </Card>
  )
}
