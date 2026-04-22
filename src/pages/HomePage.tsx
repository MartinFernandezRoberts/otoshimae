import { useEffect, useMemo, useState } from 'react'

import { ProductCard } from '@/components/ProductCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Loader } from '@/components/ui/Loader'
import { listPublicCategories, listPublicProducts } from '@/features/catalog/catalog.api'
import { getPrimaryProductImage } from '@/features/catalog/catalog.utils'
import { listHomepageBanners } from '@/features/site/site.api'
import { useSeo } from '@/hooks/useSeo'
import { formatCurrency } from '@/lib/formatCurrency'
import { buildProductPath, routes } from '@/lib/routes'
import type {
  CategoryRow,
  HomepageBannerRow,
  PublicProductSummary,
} from '@/types/database'

type HomeContent = {
  products: PublicProductSummary[]
  categories: CategoryRow[]
  banners: HomepageBannerRow[]
}

const studioNotes = [
  {
    eyebrow: 'Pintura manual',
    title: 'Capas de color con control y contraste.',
    description:
      'Cada pieza se trabaja como un objeto de presencia: negro profundo, acentos precisos y terminaciones que se sienten de cerca.',
  },
  {
    eyebrow: 'Trabajo de taller',
    title: 'Textura, volumen y detalle afinado a mano.',
    description:
      'Algunas mascaras incorporan pelo agregado manualmente para intensificar silueta, gesto y lectura escultorica.',
  },
  {
    eyebrow: 'Series cortas',
    title: 'Exclusividad sostenida por stock real.',
    description:
      'La coleccion se publica con disponibilidad autentica para mantener la sensacion de pieza limitada y bien terminada.',
  },
] as const

function formatMetric(value: number) {
  return value.toString().padStart(2, '0')
}

export function HomePage() {
  const [content, setContent] = useState<HomeContent>({
    products: [],
    categories: [],
    banners: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useSeo({
    title: 'Inicio',
    description:
      'Descubre mascaras oni, collares y accesorios Otoshimae desde un storefront editorial, oscuro y conectado al stock real de la tienda.',
  })

  useEffect(() => {
    let cancelled = false

    const loadContent = async () => {
      try {
        setLoading(true)
        setError(null)

        const [products, categories, banners] = await Promise.all([
          listPublicProducts({ force: reloadKey > 0 }),
          listPublicCategories({ force: reloadKey > 0 }),
          listHomepageBanners({ force: reloadKey > 0 }),
        ])

        if (!cancelled) {
          setContent({ products, categories, banners })
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(
            nextError instanceof Error
              ? nextError.message
              : 'No fue posible cargar el storefront.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadContent()

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const featuredProducts = useMemo(() => {
    const featured = content.products.filter((product) => product.is_featured)
    return (featured.length > 0 ? featured : content.products).slice(0, 3)
  }, [content.products])

  const latestProducts = useMemo(
    () =>
      [...content.products]
        .sort(
          (left, right) =>
            new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
        )
        .slice(0, 3),
    [content.products],
  )

  const heroProduct = featuredProducts[0] ?? content.products[0] ?? null
  const heroBanner = content.banners[0] ?? null
  const heroVisual =
    heroBanner?.image_url ??
    (heroProduct ? getPrimaryProductImage(heroProduct)?.url : null) ??
    null

  const categoryHighlights = useMemo(
    () =>
      content.categories.map((category) => ({
        ...category,
        productCount: content.products.filter(
          (product) => product.category_id === category.id,
        ).length,
      })),
    [content.categories, content.products],
  )

  const atelierMetrics = useMemo(
    () => [
      { label: 'Piezas activas', value: formatMetric(content.products.length) },
      { label: 'Categorias vivas', value: formatMetric(content.categories.length) },
      { label: 'Series destacadas', value: formatMetric(featuredProducts.length) },
    ],
    [content.categories.length, content.products.length, featuredProducts.length],
  )

  if (loading) {
    return (
      <Card className="p-8">
        <Loader label="Cargando seleccion editorial..." />
      </Card>
    )
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudo cargar la portada"
        description={error}
        action={
          <Button variant="secondary" onClick={() => setReloadKey((value) => value + 1)}>
            Reintentar
          </Button>
        }
      />
    )
  }

  if (!heroProduct) {
    return (
      <EmptyState
        title="Aun no hay piezas publicadas"
        description="Activa productos en Supabase para revelar el storefront publico y comenzar a construir la coleccion."
        action={<Button to={routes.adminLogin}>Ir al panel admin</Button>}
      />
    )
  }

  return (
    <div className="space-y-20">
      <section className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line)] bg-[rgba(8,8,8,0.72)] shadow-[var(--shadow-floating)]">
        <div className="store-grid absolute inset-0 opacity-30" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(209,178,138,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(121,36,27,0.14),transparent_26%)]"
          aria-hidden="true"
        />

        <div className="relative grid gap-10 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-8 p-6 md:p-8 xl:p-10">
            <div className="space-y-4">
              <Badge variant="accent">
                {heroBanner?.title ?? 'Atelier Otoshimae'}
              </Badge>
              <div className="space-y-5">
                <h1 className="max-w-5xl text-6xl leading-[0.88] text-[var(--foreground)] md:text-7xl xl:text-8xl">
                  Oscuridad japonesa con gesto artesanal de autor.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[var(--foreground-soft)] md:text-lg">
                  {heroBanner?.subtitle ??
                    heroProduct.short_description ??
                    'Mascaras oni, collares y accesorios hechos para mirar de cerca: contraste, presencia, acabado manual y una lectura boutique contemporanea.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button to={routes.catalog} size="lg">
                Explorar coleccion
              </Button>
              <Button
                to={buildProductPath(heroProduct.slug)}
                variant="secondary"
                size="lg"
              >
                Ver pieza en foco
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {atelierMetrics.map((metric) => (
                <Card key={metric.label} tone="muted" className="p-5">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                    {metric.label}
                  </p>
                  <p className="mt-4 text-4xl text-[var(--foreground)]">
                    {metric.value}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-4 p-6 pt-0 md:p-8 md:pt-0 xl:p-10 xl:pl-0">
            <div className="relative min-h-[520px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[linear-gradient(145deg,#161210_0%,#060606_100%)] shadow-[var(--shadow-card)]">
              {heroVisual ? (
                <img
                  src={heroVisual}
                  alt={heroBanner?.title ?? heroProduct.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              ) : null}
              <div
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04)_0%,rgba(0,0,0,0.18)_38%,rgba(0,0,0,0.92)_100%)]"
                aria-hidden="true"
              />

              <div className="absolute left-6 top-6 max-w-sm rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(7,7,7,0.54)] p-5 backdrop-blur-xl">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                  Pieza en primer plano
                </p>
                <h2 className="mt-3 text-5xl text-[var(--foreground)]">
                  {heroProduct.name}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--foreground-soft)]">
                  {heroProduct.description ??
                    heroProduct.short_description ??
                    'Objeto de presencia con composicion japonesa contemporanea y acabado manual.'}
                </p>
              </div>

              <div className="absolute bottom-6 left-6 right-6 grid gap-4 md:grid-cols-2">
                <Card tone="muted" className="border-white/10 bg-[rgba(0,0,0,0.42)] p-5">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                    Precio atelier
                  </p>
                  <p className="mt-4 text-3xl text-[var(--accent-strong)]">
                    {formatCurrency(heroProduct.price)}
                  </p>
                </Card>
                <Card tone="muted" className="border-white/10 bg-[rgba(0,0,0,0.42)] p-5">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                    Disponibilidad
                  </p>
                  <p className="mt-4 text-lg leading-7 text-[var(--foreground)]">
                    {heroProduct.stock > 0
                      ? `${heroProduct.stock} piezas listas para salir del taller`
                      : 'Serie agotada por ahora'}
                  </p>
                </Card>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card tone="muted" className="p-5">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                  Firma visual
                </p>
                <p className="mt-3 text-lg leading-7 text-[var(--foreground)]">
                  Negro profundo, oro envejecido y lectura editorial.
                </p>
              </Card>
              <Card tone="muted" className="p-5">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                  Categoria
                </p>
                <p className="mt-3 text-lg leading-7 text-[var(--foreground)]">
                  {heroProduct.category?.name ?? 'Coleccion libre'}
                </p>
              </Card>
              <Card tone="muted" className="p-5">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                  Acabado
                </p>
                <p className="mt-3 text-lg leading-7 text-[var(--foreground)]">
                  Pintado a mano y afinado con criterio de autor.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge>Seleccion destacada</Badge>
            <h2 className="max-w-3xl text-5xl text-[var(--foreground)] md:text-6xl">
              Piezas con fuerza visual y terminacion de boutique.
            </h2>
            <p className="max-w-2xl text-sm leading-8 text-[var(--foreground-soft)]">
              La portada privilegia mascaras y accesorios que sostienen la identidad
              de marca: artesania visible, contraste alto y una presencia que no
              se siente generica.
            </p>
          </div>
          <Button to={routes.catalog} variant="secondary">
            Ver catalogo completo
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
        <Card tone="accent" className="space-y-6 p-7 md:p-8">
          <div className="space-y-3">
            <Badge variant="accent">Lenguaje de marca</Badge>
            <h2 className="max-w-2xl text-5xl text-[var(--foreground)] md:text-6xl">
              Objetos de presencia, no accesorios de paso.
            </h2>
            <p className="max-w-2xl text-sm leading-8 text-[var(--foreground-soft)]">
              Otoshimae mezcla imaginario japones contemporaneo, acabado manual y
              una oscuridad elegante para convertir cada pieza en un gesto de autor.
            </p>
          </div>

          <div className="editorial-divider" />

          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
              Llegadas recientes
            </p>
            <div className="space-y-3">
              {latestProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[rgba(245,240,232,0.08)] bg-[rgba(255,255,255,0.03)] p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-lg text-[var(--foreground)]">{product.name}</p>
                    <p className="mt-1 text-sm text-[var(--foreground-soft)]">
                      {product.short_description ??
                        product.description ??
                        'Nueva incorporacion al atelier.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-lg text-[var(--accent-strong)]">
                      {formatCurrency(product.price)}
                    </p>
                    <Button
                      to={buildProductPath(product.slug)}
                      variant="ghost"
                      size="sm"
                    >
                      Ver
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          {studioNotes.map((note) => (
            <Card key={note.title} className="space-y-5 p-6">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--accent-strong)]">
                {note.eyebrow}
              </p>
              <h3 className="text-4xl text-[var(--foreground)]">{note.title}</h3>
              <p className="text-sm leading-8 text-[var(--foreground-soft)]">
                {note.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge variant="accent">Categorias</Badge>
            <h2 className="max-w-3xl text-5xl text-[var(--foreground)] md:text-6xl">
              Familias visuales para ordenar una coleccion de autor.
            </h2>
            <p className="max-w-2xl text-sm leading-8 text-[var(--foreground-soft)]">
              Cada categoria funciona como una entrada al universo de la marca:
              ritual, gesto y materialidad con una lectura clara para compra real.
            </p>
          </div>
        </div>

        {categoryHighlights.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categoryHighlights.map((category) => (
              <Card key={category.id} as="article" className="overflow-hidden p-0">
                <div className="h-32 border-b border-[var(--line)] bg-[radial-gradient(circle_at_24%_18%,rgba(209,178,138,0.22),transparent_24%),linear-gradient(135deg,#1a1512_0%,#070707_100%)]" />
                <div className="space-y-5 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-4xl text-[var(--foreground)]">
                      {category.name}
                    </h3>
                    <Badge>{category.productCount} piezas</Badge>
                  </div>
                  <p className="text-sm leading-8 text-[var(--foreground-soft)]">
                    {category.description ??
                      'Categoria activa lista para agrupar el caracter visual de la coleccion.'}
                  </p>
                  <Button
                    to={`${routes.catalog}?categoria=${encodeURIComponent(category.slug)}`}
                    variant="ghost"
                    className="px-0"
                  >
                    Explorar categoria
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-7">
            <p className="text-sm leading-8 text-[var(--foreground-soft)]">
              Las categorias apareceran aqui cuando se activen desde el panel admin.
            </p>
          </Card>
        )}
      </section>
    </div>
  )
}
