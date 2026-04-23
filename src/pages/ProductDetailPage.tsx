import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { ProductCard } from '@/components/ProductCard'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Loader } from '@/components/ui/Loader'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { Tabs } from '@/components/ui/Tabs'
import {
  getPublicProductBySlug,
  listPublicProducts,
} from '@/features/catalog/catalog.api'
import { useCart } from '@/features/cart/useCart'
import { useSeo } from '@/hooks/useSeo'
import { formatCurrency } from '@/lib/formatCurrency'
import { routes } from '@/lib/routes'
import type { ProductImageRow, PublicProductSummary } from '@/types/database'

type DetailContent = {
  product: PublicProductSummary | null
  relatedProducts: PublicProductSummary[]
}

function getProductStory(product: PublicProductSummary) {
  const normalizedCategory = `${product.category?.name ?? ''} ${product.slug}`.toLowerCase()

  if (normalizedCategory.includes('mascar') || normalizedCategory.includes('oni')) {
    return {
      eyebrow: 'Mascara oni',
      intro:
        'Una pieza decorativa concebida para sostener dramatismo, presencia y lectura contemporanea sin perder la huella del taller.',
      narrative:
        'Cada mascara oni de Otoshimae se trabaja como un rostro de impacto: contraste oscuro, pintura manual y una presencia frontal que transforma la pieza en un objeto de coleccion, ambientacion o exhibicion.',
      artisanTitle: 'Trabajo artesanal visible en cada gesto',
      artisanCopy:
        'La pintura se construye a mano, capa por capa, para revelar profundidad y tension. En algunas versiones, el pelo agregado manualmente intensifica silueta, volumen y caracter visual.',
      attributes: [
        'Pieza pintada a mano',
        'Inspiracion japonesa contemporanea',
        'Valor decorativo de exhibicion',
        'Cada pieza tiene variaciones unicas',
      ],
      brandStatement:
        'No es un objeto generico: es una interpretacion de autor con fuerza visual, lectura ceremonial y acabado profesional.',
      brandQuote:
        'No es un objeto generico: es una interpretacion de autor con fuerza visual, lectura ceremonial y acabado profesional.',
    }
  }

  if (normalizedCategory.includes('collar')) {
    return {
      eyebrow: 'Collar decorativo',
      intro:
        'Una pieza ornamental concebida para aportar identidad visual con sobriedad, contraste y una lectura japonesa contemporanea.',
      narrative:
        'Los collares de Otoshimae traducen el universo de la marca a una escala mas cercana y ornamental: detalles precisos, composicion elegante y un acabado que se siente boutique.',
      artisanTitle: 'Hecho a mano con criterio de composicion',
      artisanCopy:
        'Cada pieza se afina en taller para equilibrar presencia, textura y terminacion. El objetivo es construir un objeto ornamental distintivo, listo para coleccion, estilismo o exhibicion.',
      attributes: [
        'Pieza pintada a mano',
        'Diseno japones contemporaneo',
        'Valor ornamental de autor',
        'Cada pieza tiene variaciones unicas',
      ],
      brandStatement:
        'Un collar Otoshimae no busca llenar espacio: introduce una presencia precisa y cuidadosamente construida.',
      brandQuote:
        'Un collar Otoshimae no busca llenar espacio: introduce una presencia precisa y cuidadosamente construida.',
    }
  }

  return {
    eyebrow: 'Objeto decorativo',
    intro:
      'Objeto de autor trabajado a mano para aportar contraste, textura y una identidad claramente propia.',
    narrative:
      'Los objetos de Otoshimae nacen del mismo lenguaje visual que las piezas principales: oscuridad elegante, inspiracion japonesa y una sensibilidad artesanal que evita cualquier sensacion generica.',
    artisanTitle: 'Terminacion manual con lectura premium',
    artisanCopy:
      'Cada superficie se revisa en taller para cuidar color, textura y tension visual. El resultado mantiene la huella artesanal, pero con una ejecucion limpia, ornamental y profesional.',
    attributes: [
      'Pieza pintada a mano',
      'Terminaciones artesanales',
      'Inspiracion japonesa contemporanea',
      'Cada pieza tiene variaciones unicas',
    ],
    brandStatement:
      'Un objeto pequeno puede sostener una atmosfera completa cuando esta bien construido.',
    brandQuote:
      'Un objeto pequeno puede sostener una atmosfera completa cuando esta bien construido.',
  }
}

export function ProductDetailPage() {
  const { slug = '' } = useParams()
  const { addItem } = useCart()
  const [content, setContent] = useState<DetailContent>({
    product: null,
    relatedProducts: [],
  })
  const [selectedImage, setSelectedImage] = useState<ProductImageRow | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{
    tone: 'success' | 'error'
    message: string
  } | null>(null)

  const product = content.product

  useSeo({
    title: product?.name ?? 'Producto',
    description:
      product?.short_description ??
      product?.description ??
      'Detalle de producto Otoshimae con galeria inmersiva, narrativa de marca y foco en su valor decorativo, artesanal y de coleccion.',
  })

  useEffect(() => {
    let cancelled = false

    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const [nextProduct, allProducts] = await Promise.all([
          getPublicProductBySlug(slug),
          listPublicProducts(),
        ])

        if (cancelled) {
          return
        }

        const relatedProducts = nextProduct
          ? allProducts
              .filter((item) => item.id !== nextProduct.id)
              .sort((left, right) => {
                const leftScore =
                  Number(left.category_id === nextProduct.category_id) * 3 +
                  Number(left.is_featured)
                const rightScore =
                  Number(right.category_id === nextProduct.category_id) * 3 +
                  Number(right.is_featured)

                return rightScore - leftScore
              })
              .slice(0, 3)
          : []

        setContent({
          product: nextProduct,
          relatedProducts,
        })
        setSelectedImage(nextProduct?.images?.[0] ?? null)
        setQuantity(1)
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
  const mainImage = selectedImage ?? gallery[0] ?? null
  const hasComparePrice =
    typeof product?.compare_price === 'number' &&
    product.compare_price > product.price

  const quantityLabel = useMemo(
    () =>
      (product?.stock ?? 0) > 0
        ? `${quantity} unidad${quantity > 1 ? 'es' : ''}`
        : 'Serie agotada',
    [product?.stock, quantity],
  )

  const story = useMemo(
    () => (product ? getProductStory(product) : null),
    [product],
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
        value: 'Terminaciones artesanales y revision de taller',
      },
    ],
    [product?.category?.name, product?.stock],
  )

  const purchaseNotes = useMemo(
    () => [
      'Pieza pintada a mano.',
      'Cada pieza tiene variaciones unicas propias del trabajo artesanal.',
      'La orden se registra con snapshot de precio y nombre para asegurar trazabilidad.',
      'El stock se valida nuevamente antes de confirmar el encargo.',
    ],
    [],
  )

  const tabs = useMemo(
    () =>
      story
        ? [
            {
              value: 'historia',
              label: 'Narrativa',
              content: (
                <div className="space-y-4">
                  <div className="ui-surface-inset rounded-[var(--radius-md)] p-5">
                    <p className="text-sm leading-8 text-[var(--foreground-soft)]">
                      {story.narrative}
                    </p>
                  </div>
                  <div className="ui-surface-inset rounded-[var(--radius-md)] p-5">
                    <p className="text-sm leading-8 text-[var(--foreground-soft)]">
                      {story.brandStatement ?? story.brandQuote}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              value: 'artesania',
              label: 'Trabajo artesanal',
              content: (
                <div className="space-y-4">
                  <div className="ui-surface-inset rounded-[var(--radius-md)] p-5">
                    <p className="text-lg text-[var(--foreground)]">
                      {story.artisanTitle}
                    </p>
                    <p className="mt-3 text-sm leading-8 text-[var(--foreground-soft)]">
                      {story.artisanCopy}
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {story.attributes.map((attribute) => (
                      <div
                        key={attribute}
                        className="ui-surface-inset rounded-[var(--radius-md)] p-4 text-sm leading-7 text-[var(--foreground-soft)]"
                      >
                        {attribute}
                      </div>
                    ))}
                  </div>
                </div>
              ),
            },
            {
              value: 'compra',
              label: 'Compra',
              content: (
                <div className="space-y-3">
                  {purchaseNotes.map((note) => (
                    <div
                      key={note}
                      className="ui-surface-inset rounded-[var(--radius-md)] p-4 text-sm leading-7 text-[var(--foreground-soft)]"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              ),
            },
          ]
        : [],
    [purchaseNotes, story],
  )

  const handleAddToCart = () => {
    if (!product) {
      return
    }

    const result = addItem({ product, quantity })

    setFeedback(
      result.success
        ? { tone: 'success', message: 'La pieza ya forma parte de tu seleccion.' }
        : {
            tone: 'error',
            message: result.message ?? 'No pudimos sumar esta pieza a tu seleccion.',
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
        action={<Button to={routes.catalog}>Volver a la coleccion</Button>}
      />
    )
  }

  if (!product || !story) {
    return (
      <EmptyState
        title="Producto no encontrado"
        description="La pieza que buscas no esta activa o ya no existe dentro de la coleccion publica."
        action={<Button to={routes.catalog}>Explorar la coleccion</Button>}
      />
    )
  }

  return (
    <div className="space-y-12">
      <Breadcrumbs
        items={[
          { label: 'Inicio', to: routes.home },
          { label: 'Catalogo', to: routes.catalog },
          { label: product.name },
        ]}
      />

      <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line)] bg-[rgba(8,8,8,0.76)] shadow-[var(--shadow-card)]">
        <div className="relative grid gap-8 p-6 md:p-8 xl:grid-cols-[1.06fr_0.94fr] xl:p-10">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {product.category ? <Badge variant="accent">{product.category.name}</Badge> : null}
              <Badge>Pieza pintada a mano</Badge>
              <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
                {product.stock > 0 ? `${product.stock} disponibles` : 'Serie agotada'}
              </Badge>
            </div>

            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                {story.eyebrow}
              </p>
              <h1 className="max-w-5xl text-6xl text-[var(--foreground)] md:text-7xl">
                {product.name}
              </h1>
              <p className="max-w-3xl text-base leading-8 text-[var(--foreground-soft)] md:text-lg">
                {story.intro}
              </p>
            </div>
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

      <section className="grid gap-8 xl:grid-cols-[1.12fr_0.88fr]">
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-[120px_minmax(0,1fr)]">
            <div className="order-2 grid grid-cols-4 gap-3 lg:order-1 lg:grid-cols-1">
              {gallery.length > 0 ? (
                gallery.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    aria-label={`Ver imagen ${image.alt ?? product.name}`}
                    aria-pressed={image.id === mainImage?.id}
                    className={`overflow-hidden rounded-[var(--radius-md)] border transition ${
                      image.id === mainImage?.id
                        ? 'border-[rgba(184,138,95,0.42)] shadow-[0_0_0_1px_rgba(184,138,95,0.18)]'
                        : 'border-[var(--line)]'
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image.url}
                      alt={image.alt ?? product.name}
                      className="h-24 w-full object-cover lg:h-[116px]"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                ))
              ) : (
                <div className="ui-surface-inset rounded-[var(--radius-md)] p-4 text-center text-sm text-[var(--foreground-soft)]">
                  Sin galeria adicional
                </div>
              )}
            </div>

            <div className="order-1 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line)] bg-[linear-gradient(145deg,#161210_0%,#060606_100%)] shadow-[var(--shadow-card)] lg:order-2">
              <div className="relative h-[620px]">
                {mainImage ? (
                  <img
                    src={mainImage.url}
                    alt={mainImage.alt ?? product.name}
                    className="h-full w-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_18%,rgba(184,138,95,0.16),transparent_24%),linear-gradient(145deg,#161210_0%,#060606_100%)]">
                    <span className="text-6xl font-semibold tracking-[0.24em] text-[rgba(244,237,226,0.14)]">
                      O
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03)_0%,rgba(0,0,0,0.12)_28%,rgba(0,0,0,0.72)_100%)]" />

                <div className="absolute left-6 top-6 max-w-sm rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(7,7,7,0.58)] p-5 backdrop-blur-xl">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                    Inspiracion japonesa contemporanea
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--foreground-soft)]">
                    Terminaciones artesanales, contraste controlado y una presencia
                    construida para coleccion, ambientacion o exhibicion.
                  </p>
                </div>

                <div className="absolute bottom-6 left-6 right-6 grid gap-4 md:grid-cols-2">
                  <Card tone="muted" className="border-[var(--border)] bg-[rgba(0,0,0,0.42)] p-4">
                    <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                      Trabajo artesanal
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
                      Cada pieza tiene variaciones unicas propias del trabajo manual.
                    </p>
                  </Card>
                  <Card tone="muted" className="border-[var(--border)] bg-[rgba(0,0,0,0.42)] p-4">
                    <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                      Acabado
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
                      Revision de taller, presencia ornamental y lectura boutique.
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          <Card tone="accent" className="space-y-5 p-7">
            <div className="space-y-2">
              <Badge variant="accent">Narrativa de la pieza</Badge>
              <h2 className="text-4xl text-[var(--foreground)] md:text-5xl">
                Un objeto construido para sostener caracter
              </h2>
            </div>
            <p className="text-sm leading-8 text-[var(--foreground-soft)]">
              {story.narrative}
            </p>
            <p className="text-sm leading-8 text-[var(--foreground-soft)]">
              {story.brandStatement ?? story.brandQuote}
            </p>
          </Card>
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

          <div className="space-y-4">
            <p className="text-sm leading-8 text-[var(--foreground-soft)]">
              {product.description ??
                product.short_description ??
                'Pieza decorativa de autor conectada al catalogo real de Otoshimae, con stock sincronizado y presentacion premium.'}
            </p>

            <div className="grid gap-3">
              {story.attributes.map((attribute) => (
                <div
                  key={attribute}
                  className="ui-surface-inset rounded-[var(--radius-md)] p-4 text-sm leading-7 text-[var(--foreground-soft)]"
                >
                  {attribute}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Card tone="muted" className="p-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Trabajo de taller
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
                {story.artisanTitle}
              </p>
            </Card>
            <Card tone="muted" className="p-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Valor de compra
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
                Serie cuidada, stock real y una identidad decorativa reconocible.
              </p>
            </Card>
          </div>

          <div className="ui-surface-inset space-y-3 rounded-[var(--radius-md)] p-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
              Cantidad
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Disminuir cantidad"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] text-lg text-[var(--foreground)] transition hover:border-[rgba(184,138,95,0.4)]"
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
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] text-lg text-[var(--foreground)] transition hover:border-[rgba(184,138,95,0.4)]"
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
              {product.stock > 0 ? 'Sumar esta pieza' : 'Serie agotada'}
            </Button>
            <Button to={routes.cart} variant="secondary">
              Abrir mi seleccion
            </Button>
          </div>

          <p className="text-sm leading-8 text-[var(--foreground-soft)]">
            La ficha pone en primer plano su valor real: pieza pintada a mano,
            terminaciones artesanales y una presentacion cuidada para una
            seleccion de autor.
          </p>
        </Card>
      </section>

      <section className="space-y-5">
        <div className="space-y-2">
          <Badge>Detalles y contexto</Badge>
          <h2 className="text-4xl text-[var(--foreground)] md:text-5xl">
            Artesania, narrativa y seleccion en una sola lectura
          </h2>
        </div>

        <Tabs items={tabs} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.98fr_1.02fr]">
        <Card tone="muted" className="space-y-5 p-7">
          <div className="space-y-2">
            <Badge variant="accent">Trabajo artesanal</Badge>
            <h2 className="text-4xl text-[var(--foreground)]">La huella del taller</h2>
          </div>
          <p className="text-sm leading-8 text-[var(--foreground-soft)]">
            {story.artisanCopy}
          </p>
          <div className="grid gap-3">
            <div className="ui-surface-inset rounded-[var(--radius-md)] p-4 text-sm leading-7 text-[var(--foreground-soft)]">
              Pieza pintada a mano.
            </div>
            <div className="ui-surface-inset rounded-[var(--radius-md)] p-4 text-sm leading-7 text-[var(--foreground-soft)]">
              Terminaciones artesanales y revision visual cuidada.
            </div>
            <div className="ui-surface-inset rounded-[var(--radius-md)] p-4 text-sm leading-7 text-[var(--foreground-soft)]">
              Cada pieza tiene variaciones unicas que refuerzan su condicion de autor.
            </div>
          </div>
        </Card>

        <Card className="space-y-5 p-7">
          <div className="space-y-2">
            <Badge>Narrativa de marca</Badge>
            <h2 className="text-4xl text-[var(--foreground)]">
              Oscuridad elegante, composicion precisa
            </h2>
          </div>
          <p className="text-sm leading-8 text-[var(--foreground-soft)]">
            Otoshimae trabaja objetos inspirados en la estetica japonesa
            contemporanea, pero filtrados por una mirada de boutique: menos
            folclor, mas caracter; menos ruido, mas presencia.
          </p>
          <p className="text-sm leading-8 text-[var(--foreground-soft)]">
            Cada pieza busca un equilibrio entre artesania visible y acabado
            profesional, para que el resultado se sienta unico sin dejar de verse
            pulido, ornamental y deseable.
          </p>
        </Card>
      </section>

      {content.relatedProducts.length > 0 ? (
        <section className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <Badge variant="accent">Productos relacionados</Badge>
              <h2 className="max-w-4xl text-5xl text-[var(--foreground)] md:text-6xl">
                Otras piezas para construir la misma atmosfera
              </h2>
              <p className="max-w-2xl text-sm leading-8 text-[var(--foreground-soft)]">
                Si esta pieza conecto contigo, estas selecciones siguen la misma
                linea de autor: contraste, identidad japonesa y trabajo manual.
              </p>
            </div>

            <Button to={routes.catalog} variant="secondary">
              Ver toda la coleccion
            </Button>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {content.relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
