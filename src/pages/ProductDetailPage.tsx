import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Loader } from '@/components/ui/Loader'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { getPublicProductBySlug } from '@/features/catalog/catalog.api'
import { useCart } from '@/features/cart/useCart'
import { useSeo } from '@/hooks/useSeo'
import { formatCurrency } from '@/lib/formatCurrency'
import { routes } from '@/lib/routes'
import type { ProductImageRow, PublicProductSummary } from '@/types/database'

export function ProductDetailPage() {
  const { slug = '' } = useParams()
  const { addItem } = useCart()
  const [product, setProduct] = useState<PublicProductSummary | null>(null)
  const [selectedImage, setSelectedImage] = useState<ProductImageRow | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error'
    message: string
  } | null>(null)

  useSeo({
    title: product?.name ?? 'Producto',
    description:
      product?.short_description ??
      product?.description ??
      'Detalle de producto Otoshimae con imagenes, stock real y compra directa.',
  })

  useEffect(() => {
    let cancelled = false

    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const nextProduct = await getPublicProductBySlug(slug)

        if (!cancelled) {
          setProduct(nextProduct)
          setSelectedImage(nextProduct?.images?.[0] ?? null)
          setQuantity(1)
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(
            nextError instanceof Error
              ? nextError.message
              : 'No fue posible cargar este producto.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadProduct()

    return () => {
      cancelled = true
    }
  }, [slug])

  const gallery = product?.images ?? []
  const hasComparePrice =
    typeof product?.compare_price === 'number' &&
    product.compare_price > product.price

  const mainImage = selectedImage ?? gallery[0] ?? null
  const quantityLabel = useMemo(
    () => (product?.stock ?? 0) > 0 ? `${quantity} unidad${quantity > 1 ? 'es' : ''}` : 'Sin stock',
    [product?.stock, quantity],
  )

  const handleAddToCart = () => {
    if (!product) {
      return
    }

    const result = addItem({ product, quantity })

    setFeedback(
      result.success
        ? { tone: 'success', message: 'Pieza agregada al carrito.' }
        : {
            tone: 'error',
            message: result.message ?? 'No fue posible agregar esta pieza.',
          },
    )
  }

  if (loading) {
    return (
      <Card className="p-8">
        <Loader label="Cargando producto..." />
      </Card>
    )
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudo cargar la ficha"
        description={error}
        action={<Button to={routes.catalog}>Volver al catalogo</Button>}
      />
    )
  }

  if (!product) {
    return (
      <EmptyState
        title="Producto no encontrado"
        description="La pieza que buscas no esta activa o ya no existe en el catalogo publico."
        action={<Button to={routes.catalog}>Explorar catalogo</Button>}
      />
    )
  }

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {product.category ? <Badge>{product.category.name}</Badge> : null}
          <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
            {product.stock > 0 ? `Stock ${product.stock}` : 'Agotado'}
          </Badge>
        </div>
        <h1 className="text-5xl text-[var(--foreground)] md:text-6xl">{product.name}</h1>
        <p className="max-w-3xl text-base leading-8 text-[var(--foreground-soft)]">
          {product.short_description ??
            product.description ??
            'Pieza publicada en el catalogo de Otoshimae.'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line)] bg-[linear-gradient(145deg,#15171b_0%,#08090b_100%)] shadow-[var(--shadow-card)]">
            {mainImage ? (
              <img
                src={mainImage.url}
                alt={mainImage.alt ?? product.name}
                className="h-[480px] w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className="h-[480px] bg-[radial-gradient(circle_at_50%_18%,rgba(207,183,154,0.16),transparent_24%),linear-gradient(145deg,#15171b_0%,#08090b_100%)]" />
            )}
          </div>

          {gallery.length > 1 ? (
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  className={`overflow-hidden rounded-[var(--radius-md)] border transition ${
                    image.id === mainImage?.id
                      ? 'border-[var(--accent)]'
                      : 'border-[var(--line)]'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.alt ?? product.name}
                    className="h-24 w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <Card as="aside" className="space-y-6 p-7">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              {product.sku ? `SKU ${product.sku}` : 'Pieza Otoshimae'}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-4xl text-[var(--accent)]">
                {formatCurrency(product.price)}
              </p>
              {hasComparePrice ? (
                <span className="text-base text-[var(--muted)] line-through">
                  {formatCurrency(product.compare_price ?? 0)}
                </span>
              ) : null}
            </div>
          </div>

          <p className="text-base leading-7 text-[var(--foreground-soft)]">
            {product.description ??
              product.short_description ??
              'Ficha de producto conectada a Supabase con stock real e imagenes activas.'}
          </p>

          <div className="space-y-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface)] p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
              Cantidad
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] text-lg text-[var(--foreground)] transition hover:border-[var(--accent)]"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={product.stock <= 0}
              >
                -
              </button>
              <div className="min-w-28 rounded-full border border-[var(--line)] px-4 py-3 text-center text-sm text-[var(--foreground)]">
                {quantityLabel}
              </div>
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] text-lg text-[var(--foreground)] transition hover:border-[var(--accent)]"
                onClick={() =>
                  setQuantity((value) => Math.min(product.stock, value + 1))
                }
                disabled={product.stock <= 0}
              >
                +
              </button>
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
            <Button to={routes.cart} variant="secondary" className="flex-1">
              Ver carrito
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
