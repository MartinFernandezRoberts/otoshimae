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
      'Detalle de producto Otoshimae con galeria, stock real y una presentacion premium lista para compra.',
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
    () =>
      (product?.stock ?? 0) > 0
        ? `${quantity} unidad${quantity > 1 ? 'es' : ''}`
        : 'Sin stock',
    [product?.stock, quantity],
  )

  const productFacts = useMemo(
    () => [
      {
        label: 'Categoria',
        value: product?.category?.name ?? 'Coleccion libre',
      },
      {
        label: 'Disponibilidad',
        value:
          (product?.stock ?? 0) > 0
            ? `${product?.stock ?? 0} piezas activas`
            : 'Serie agotada',
      },
      {
        label: 'Acabado',
        value: 'Pintado a mano y afinado en taller',
      },
    ],
    [product?.category?.name, product?.stock],
  )

  const atelierNotes = useMemo(
    () => [
      'Construccion pensada para verse de cerca, con contraste, textura y silueta definida.',
      'Algunas piezas incorporan pelo agregado manualmente para reforzar presencia y caracter.',
      'La disponibilidad se sincroniza con stock real para sostener la sensacion de exclusividad.',
    ],
    [],
  )

  const careNotes = useMemo(
    () => [
      'Ideal para styling editorial, coleccion personal o presencia decorativa con caracter.',
      'Evita contacto prolongado con humedad o sol directo para conservar pintura y terminaciones.',
      'El checkout valida nuevamente stock y precio antes de crear la orden final.',
    ],
    [],
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
        description="La pieza que buscas no esta activa o ya no existe dentro del catalogo publico."
        action={<Button to={routes.catalog}>Explorar catalogo</Button>}
      />
    )
  }

  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line)] bg-[rgba(8,8,8,0.74)] shadow-[var(--shadow-card)]">
        <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1.02fr_0.98fr] xl:p-10">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {product.category ? <Badge variant="accent">{product.category.name}</Badge> : null}
              <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
                {product.stock > 0 ? `${product.stock} disponibles` : 'Serie agotada'}
              </Badge>
            </div>

            <h1 className="max-w-4xl text-6xl text-[var(--foreground)] md:text-7xl">
              {product.name}
            </h1>

            <p className="max-w-2xl text-base leading-8 text-[var(--foreground-soft)] md:text-lg">
              {product.short_description ??
                product.description ??
                'Pieza publicada en el catalogo de Otoshimae con lectura premium y stock en tiempo real.'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {productFacts.map((fact) => (
              <Card key={fact.label} tone="muted" className="p-5">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                  {fact.label}
                </p>
                <p className="mt-4 text-lg leading-7 text-[var(--foreground)]">
                  {fact.value}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line)] bg-[linear-gradient(145deg,#161210_0%,#060606_100%)] shadow-[var(--shadow-card)]">
            {mainImage ? (
              <img
                src={mainImage.url}
                alt={mainImage.alt ?? product.name}
                className="h-[560px] w-full object-cover"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className="flex h-[560px] items-center justify-center bg-[radial-gradient(circle_at_50%_18%,rgba(209,178,138,0.16),transparent_24%),linear-gradient(145deg,#161210_0%,#060606_100%)]">
                <span className="text-6xl font-semibold tracking-[0.24em] text-[rgba(245,240,232,0.14)]">
                  O
                </span>
              </div>
            )}
          </div>

          {gallery.length > 1 ? (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {gallery.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  aria-label={`Ver imagen ${image.alt ?? product.name}`}
                  aria-pressed={image.id === mainImage?.id}
                  className={`overflow-hidden rounded-[var(--radius-md)] border transition ${
                    image.id === mainImage?.id
                      ? 'border-[rgba(209,178,138,0.42)] shadow-[0_0_0_1px_rgba(209,178,138,0.18)]'
                      : 'border-[var(--line)]'
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.url}
                    alt={image.alt ?? product.name}
                    className="h-28 w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <Card as="aside" className="space-y-6 p-7 md:p-8">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
              {product.sku ? `SKU ${product.sku}` : 'Pieza Otoshimae'}
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-5xl text-[var(--accent-strong)]">
                {formatCurrency(product.price)}
              </p>
              {hasComparePrice ? (
                <span className="pb-1 text-base text-[var(--muted)] line-through">
                  {formatCurrency(product.compare_price ?? 0)}
                </span>
              ) : null}
            </div>
          </div>

          <p className="text-sm leading-8 text-[var(--foreground-soft)]">
            {product.description ??
              product.short_description ??
              'Ficha de producto conectada a Supabase con stock real, imagenes activas y checkout inmediato.'}
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <Card tone="muted" className="p-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Construccion
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
                Pintura manual con criterio de contraste y silueta.
              </p>
            </Card>
            <Card tone="muted" className="p-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Presencia
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
                Pensada para styling, coleccion o exhibicion con fuerza visual.
              </p>
            </Card>
          </div>

          <div className="space-y-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] p-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
              Cantidad
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Disminuir cantidad"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] text-lg text-[var(--foreground)] transition hover:border-[rgba(209,178,138,0.4)]"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={product.stock <= 0}
              >
                -
              </button>
              <div className="min-w-32 rounded-full border border-[var(--line)] px-4 py-3 text-center text-sm text-[var(--foreground)]">
                {quantityLabel}
              </div>
              <button
                type="button"
                aria-label="Aumentar cantidad"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] text-lg text-[var(--foreground)] transition hover:border-[rgba(209,178,138,0.4)]"
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

          <div className="grid gap-3">
            <Button onClick={handleAddToCart} disabled={product.stock <= 0}>
              {product.stock > 0 ? 'Agregar pieza al carrito' : 'Sin stock'}
            </Button>
            <Button to={routes.cart} variant="secondary">
              Ver carrito
            </Button>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-5 p-7">
          <div className="space-y-2">
            <Badge>Detalles del atelier</Badge>
            <h2 className="text-4xl text-[var(--foreground)]">Materialidad y gesto</h2>
          </div>
          <div className="space-y-3">
            {atelierNotes.map((note) => (
              <div
                key={note}
                className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] p-4 text-sm leading-7 text-[var(--foreground-soft)]"
              >
                {note}
              </div>
            ))}
          </div>
        </Card>

        <Card tone="muted" className="space-y-5 p-7">
          <div className="space-y-2">
            <Badge variant="accent">Cuidado y compra</Badge>
            <h2 className="text-4xl text-[var(--foreground)]">Antes de confirmar</h2>
          </div>
          <div className="space-y-3">
            {careNotes.map((note) => (
              <div
                key={note}
                className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(255,255,255,0.03)] p-4 text-sm leading-7 text-[var(--foreground-soft)]"
              >
                {note}
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}
