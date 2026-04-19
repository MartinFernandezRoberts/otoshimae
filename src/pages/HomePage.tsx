import { useEffect, useMemo, useState } from 'react'

import { ProductCard } from '@/components/ProductCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Loader } from '@/components/ui/Loader'
import { listPublicCategories, listPublicProducts } from '@/features/catalog/catalog.api'
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
      'Descubre mascaras Otoshimae con una presentacion sobria, editorial y conectada al catalogo real de la tienda.',
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

  const heroProduct = featuredProducts[0] ?? content.products[0] ?? null
  const heroBanner = content.banners[0] ?? null

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
        description="Activa productos en Supabase para mostrar el storefront publico."
        action={<Button to={routes.adminLogin}>Ir al panel admin</Button>}
      />
    )
  }

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card tone="accent" className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8 p-8 md:p-10">
              <Badge variant="accent">
                {heroBanner?.title ?? 'Otoshimae / Seleccion destacada'}
              </Badge>
              <div className="space-y-5">
                <h1 className="max-w-3xl text-5xl leading-none text-[var(--foreground)] md:text-7xl">
                  Mascaras con pulso artesanal y lectura editorial.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[var(--foreground-soft)] md:text-lg">
                  {heroBanner?.subtitle ??
                    heroProduct.short_description ??
                    'Una experiencia sobria, premium y centrada en producto para la primera etapa del e-commerce.'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button to={routes.catalog} size="lg">
                  Explorar catalogo
                </Button>
                <Button
                  to={buildProductPath(heroProduct.slug)}
                  variant="secondary"
                  size="lg"
                >
                  Ver pieza destacada
                </Button>
              </div>
            </div>

            <div className="relative min-h-[360px] overflow-hidden border-t border-[var(--line)] lg:border-l lg:border-t-0">
              {heroBanner?.image_url ? (
                <img
                  src={heroBanner.image_url}
                  alt={heroBanner.title}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              ) : null}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_22%,rgba(207,183,154,0.22),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(0,0,0,0.32)),linear-gradient(145deg,#14161a_0%,#090a0d_100%)]" />
              <div className="absolute left-8 right-8 top-8 rounded-[var(--radius-lg)] border border-white/10 bg-[rgba(7,8,10,0.45)] p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                  Pieza en foco
                </p>
                <h2 className="mt-3 text-4xl text-[var(--foreground)]">
                  {heroProduct.name}
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--foreground-soft)]">
                  {heroProduct.description ??
                    heroProduct.short_description ??
                    'Producto publicado y listo para compra.'}
                </p>
              </div>
              <div className="absolute bottom-8 left-8 right-8 grid gap-4 sm:grid-cols-2">
                <Card tone="muted" className="border-white/10 bg-[rgba(0,0,0,0.26)] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    Precio
                  </p>
                  <p className="mt-3 text-2xl text-[var(--accent)]">
                    {formatCurrency(heroProduct.price)}
                  </p>
                </Card>
                <Card tone="muted" className="border-white/10 bg-[rgba(0,0,0,0.26)] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
                    Stock actual
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
                    {heroProduct.stock > 0
                      ? `${heroProduct.stock} unidades disponibles`
                      : 'Sin stock por ahora'}
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mt-16 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Badge>Destacados</Badge>
            <h2 className="text-4xl text-[var(--foreground)]">
              Productos con foco en presencia
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--foreground-soft)]">
              Seleccion dinamica desde Supabase para destacar las piezas activas
              y mantener la portada alineada al stock real.
            </p>
          </div>
          <Button to={routes.catalog} variant="secondary">
            Ver catalogo completo
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-6">
        <div className="space-y-2">
          <Badge variant="accent">Categorias</Badge>
          <h2 className="text-4xl text-[var(--foreground)]">
            Familias visuales para ordenar la coleccion
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {categoryHighlights.map((category) => (
            <Card key={category.id} as="article" className="overflow-hidden p-0">
              <div className="h-28 border-b border-[var(--line)] bg-[radial-gradient(circle_at_22%_20%,rgba(207,183,154,0.18),transparent_26%),linear-gradient(135deg,#16181d_0%,#0a0b0e_100%)]" />
              <div className="space-y-4 p-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-3xl text-[var(--foreground)]">{category.name}</h3>
                  <Badge>{category.productCount} piezas</Badge>
                </div>
                <p className="text-sm leading-7 text-[var(--foreground-soft)]">
                  {category.description ?? 'Categoria activa lista para filtrar el catalogo.'}
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
      </section>
    </>
  )
}
