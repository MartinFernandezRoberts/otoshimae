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

type CategoryHighlight = CategoryRow & {
  productCount: number
  coverProduct: PublicProductSummary | null
  eyebrow: string
  marketingTitle: string
  marketingDescription: string
}

const storytellingMoments = [
  {
    eyebrow: 'Universo',
    title: 'Otoshimae nace donde la presencia se vuelve objeto.',
    description:
      'No trabajamos piezas para pasar desapercibidas. Cada mascara oni, collar o accesorio se construye para dejar una huella visual precisa: oscura, refinada y claramente contemporanea.',
  },
  {
    eyebrow: 'Lenguaje',
    title: 'Japon contemporaneo, gesto ritual y lectura editorial.',
    description:
      'La marca mezcla imaginario japones con una direccion visual sobria y profesional. El resultado no busca folclor ni disfraz: busca caracter, composicion y una identidad de autor.',
  },
] as const

const artisanNotes = [
  {
    eyebrow: 'Pintura manual',
    title: 'Color trabajado capa por capa.',
    description:
      'Las superficies se afinan a mano para lograr contraste alto, profundidad visual y una terminacion limpia que se sostiene tanto en fotografia como en cercania real.',
  },
  {
    eyebrow: 'Detalle construido',
    title: 'Volumen, textura y gesto con criterio de taller.',
    description:
      'Algunas piezas incorporan pelo agregado a mano para reforzar silueta, tension y dramatismo. No es adorno; es parte de la presencia final del objeto.',
  },
  {
    eyebrow: 'Series cortas',
    title: 'Artesania con acabado profesional.',
    description:
      'La exclusividad nace del trabajo manual y del stock real. Cada salida del taller conserva la sensacion de pieza cuidada, limitada y lista para una coleccion exigente.',
  },
] as const

function formatMetric(value: number) {
  return value.toString().padStart(2, '0')
}

function buildCategoryCopy(category: CategoryRow) {
  const normalized = `${category.slug} ${category.name}`.toLowerCase()

  if (normalized.includes('mascar')) {
    return {
      eyebrow: 'Rostros de impacto',
      marketingTitle: 'Mascaras oni con dramatismo escultorico.',
      marketingDescription:
        'Piezas de presencia frontal, contraste profundo y gesto ritual. Pensadas para coleccion, styling o exhibicion con caracter.',
    }
  }

  if (
    normalized.includes('collar') ||
    normalized.includes('necklace') ||
    normalized.includes('joya')
  ) {
    return {
      eyebrow: 'Porte diario',
      marketingTitle: 'Collares con lenguaje japones contemporaneo.',
      marketingDescription:
        'Accesorios que se sienten precisos y distintos: oscuros, elegantes y trabajados para llevar identidad sin caer en lo obvio.',
    }
  }

  if (
    normalized.includes('accesorio') ||
    normalized.includes('accessor') ||
    normalized.includes('objeto')
  ) {
    return {
      eyebrow: 'Objetos de autor',
      marketingTitle: 'Accesorios con acabado boutique y mirada de taller.',
      marketingDescription:
        'Detalles que completan el universo Otoshimae con la misma mezcla de artesania visible, control material y lectura premium.',
    }
  }

  return {
    eyebrow: 'Coleccion curada',
    marketingTitle: `${category.name} con identidad propia.`,
    marketingDescription:
      category.description ??
      'Una familia visual pensada para entrar al universo de Otoshimae desde una pieza con caracter y terminacion de autor.',
  }
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
      'Descubre el universo de Otoshimae: mascaras oni, collares y accesorios pintados a mano en una experiencia de marca oscura, premium y contemporanea.',
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
  const heroVisual =
    heroBanner?.image_url ??
    (heroProduct ? getPrimaryProductImage(heroProduct)?.url : null) ??
    null

  const heroMetrics = useMemo(
    () => [
      { label: 'Piezas activas', value: formatMetric(content.products.length) },
      { label: 'Categorias', value: formatMetric(content.categories.length) },
      { label: 'Atelier picks', value: formatMetric(featuredProducts.length) },
    ],
    [content.categories.length, content.products.length, featuredProducts.length],
  )

  const categoryHighlights = useMemo<CategoryHighlight[]>(
    () =>
      content.categories
        .map((category) => {
          const productsInCategory = content.products.filter(
            (product) => product.category_id === category.id,
          )
          const baseCopy = buildCategoryCopy(category)

          return {
            ...category,
            productCount: productsInCategory.length,
            coverProduct: productsInCategory[0] ?? null,
            ...baseCopy,
          }
        })
        .sort((left, right) => right.productCount - left.productCount)
        .slice(0, 3),
    [content.categories, content.products],
  )

  const brandSignals = useMemo(
    () => [
      {
        label: 'Firma visual',
        value: 'Negro profundo, marfil envejecido y cobre oscuro.',
      },
      {
        label: 'Materia',
        value: 'Pintura manual, textura afinada y detalle visible.',
      },
      {
        label: 'Intencion',
        value: 'Objetos de autor con presencia profesional.',
      },
    ],
    [],
  )

  if (loading) {
    return (
      <Card className="p-8">
        <Loader label="Cargando portada del atelier..." />
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
        description="Activa productos en Supabase para revelar la Home publica y comenzar a construir el universo de Otoshimae."
        action={<Button to={routes.adminLogin}>Ir al panel admin</Button>}
      />
    )
  }

  return (
    <div className="space-y-20">
      <section className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line)] bg-[rgba(8,8,8,0.74)] shadow-[var(--shadow-floating)]">
        <div className="store-grid absolute inset-0 opacity-25" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,138,95,0.18),transparent_28%),radial-gradient(circle_at_85%_12%,rgba(109,38,33,0.18),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.2))]"
          aria-hidden="true"
        />

        <div className="relative grid gap-10 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-8 p-6 md:p-8 xl:p-10">
            <div className="space-y-4">
              <Badge variant="accent">
                {heroBanner?.title ?? 'Otoshimae / Atelier de presencia'}
              </Badge>
              <div className="space-y-5">
                <h1 className="max-w-5xl text-6xl leading-[0.84] text-[var(--foreground)] md:text-7xl xl:text-8xl">
                  Objetos japoneses de autor para quienes visten presencia.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-[var(--foreground-soft)] md:text-lg">
                  Otoshimae convierte mascaras oni, collares y accesorios en un
                  lenguaje visual propio: oscuro, refinado, pintado a mano y con
                  una terminacion que se siente artesanal sin perder rigor
                  profesional.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button to={routes.catalog} size="lg">
                Explorar el universo
              </Button>
              <Button
                to={buildProductPath(heroProduct.slug)}
                variant="secondary"
                size="lg"
              >
                Ver pieza protagonista
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {heroMetrics.map((metric) => (
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
            <div className="relative min-h-[580px] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[linear-gradient(145deg,#161210_0%,#060606_100%)] shadow-[var(--shadow-card)]">
              {heroVisual ? (
                <img
                  src={heroVisual}
                  alt={heroBanner?.title ?? heroProduct.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                />
              ) : null}

              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02)_0%,rgba(0,0,0,0.24)_42%,rgba(0,0,0,0.92)_100%)]" />

              <div className="absolute left-6 top-6 max-w-md rounded-[var(--radius-md)] border border-[var(--line)] bg-[rgba(7,7,7,0.58)] p-5 backdrop-blur-xl">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                  Pieza en foco
                </p>
                <h2 className="mt-3 text-5xl text-[var(--foreground)]">
                  {heroProduct.name}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--foreground-soft)]">
                  {heroProduct.short_description ??
                    heroProduct.description ??
                    'Una pieza concebida para sostener dramatismo, textura y lectura contemporanea.'}
                </p>
              </div>

              <div className="absolute bottom-6 left-6 right-6 grid gap-4 md:grid-cols-2">
                <Card tone="muted" className="border-[var(--border)] bg-[rgba(0,0,0,0.42)] p-5">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                    Precio atelier
                  </p>
                  <p className="mt-4 text-3xl text-[var(--accent-strong)]">
                    {formatCurrency(heroProduct.price)}
                  </p>
                </Card>
                <Card tone="muted" className="border-[var(--border)] bg-[rgba(0,0,0,0.42)] p-5">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                    Manifiesto material
                  </p>
                  <p className="mt-4 text-lg leading-7 text-[var(--foreground)]">
                    Pintado a mano. Algunas piezas con pelo agregado manualmente.
                  </p>
                </Card>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {brandSignals.map((signal) => (
                <Card key={signal.label} tone="muted" className="p-5">
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                    {signal.label}
                  </p>
                  <p className="mt-3 text-lg leading-7 text-[var(--foreground)]">
                    {signal.value}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge variant="accent">Categorias destacadas</Badge>
            <h2 className="max-w-4xl text-5xl text-[var(--foreground)] md:text-6xl">
              Entradas distintas al mismo universo oscuro.
            </h2>
            <p className="max-w-2xl text-sm leading-8 text-[var(--foreground-soft)]">
              Cada categoria funciona como una puerta de acceso a la marca:
              rostros de impacto, accesorios de autor y piezas con una lectura
              claramente boutique.
            </p>
          </div>
        </div>

        {categoryHighlights.length > 0 ? (
          <div className="grid gap-6 xl:grid-cols-3">
            {categoryHighlights.map((category) => {
              const coverImage = category.coverProduct
                ? getPrimaryProductImage(category.coverProduct)?.url
                : null

              return (
                <Card key={category.id} as="article" className="overflow-hidden p-0">
                  <div className="relative h-64 overflow-hidden border-b border-[var(--line)] bg-[linear-gradient(145deg,#171411_0%,#070707_100%)]">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt={category.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.88)_100%)]" />
                    <div className="absolute left-5 top-5 flex flex-wrap gap-2">
                      <Badge>{category.eyebrow}</Badge>
                      <Badge variant="accent">{category.productCount} piezas</Badge>
                    </div>
                    <div className="absolute inset-x-5 bottom-5">
                      <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--foreground-soft)]">
                        Categoria destacada
                      </p>
                      <h3 className="mt-2 text-4xl text-[var(--foreground)]">
                        {category.name}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-5 p-6">
                    <div className="space-y-3">
                      <h4 className="text-4xl text-[var(--foreground)]">
                        {category.marketingTitle}
                      </h4>
                      <p className="text-sm leading-8 text-[var(--foreground-soft)]">
                        {category.marketingDescription}
                      </p>
                    </div>

                    <Button
                      to={`${routes.catalog}?categoria=${encodeURIComponent(category.slug)}`}
                      variant="secondary"
                    >
                      Explorar categoria
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="p-7">
            <p className="text-sm leading-8 text-[var(--foreground-soft)]">
              Las categorias apareceran aqui cuando se activen desde el panel admin.
            </p>
          </Card>
        )}
      </section>

      <section className="space-y-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <Badge>Productos destacados</Badge>
            <h2 className="max-w-4xl text-5xl text-[var(--foreground)] md:text-6xl">
              Piezas elegidas por su fuerza visual y acabado de taller.
            </h2>
            <p className="max-w-2xl text-sm leading-8 text-[var(--foreground-soft)]">
              Esta seleccion concentra el pulso de la marca: presencia, contraste,
              detalle manual y una silueta capaz de sostenerse sola.
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

      <section className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Card tone="accent" className="space-y-8 p-7 md:p-9">
          <div className="space-y-3">
            <Badge variant="accent">Storytelling</Badge>
            <h2 className="max-w-3xl text-5xl text-[var(--foreground)] md:text-6xl">
              No vendemos accesorios aislados. Vendemos una atmosfera con firma propia.
            </h2>
            <p className="max-w-2xl text-sm leading-8 text-[var(--foreground-soft)]">
              Otoshimae esta pensado como una marca boutique real: objetos que
              toman referencias japonesas y las traducen a una presencia oscura,
              sobria y altamente reconocible.
            </p>
          </div>

          <div className="editorial-divider" />

          <div className="space-y-5">
            {storytellingMoments.map((moment) => (
              <div key={moment.title} className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--accent-strong)]">
                  {moment.eyebrow}
                </p>
                <h3 className="text-4xl text-[var(--foreground)]">{moment.title}</h3>
                <p className="max-w-2xl text-sm leading-8 text-[var(--foreground-soft)]">
                  {moment.description}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-6 p-7 md:p-8">
          <div className="space-y-3">
            <Badge>Firma Otoshimae</Badge>
            <h3 className="text-5xl text-[var(--foreground)]">
              Poetica oscura, lectura clara.
            </h3>
            <p className="text-sm leading-8 text-[var(--foreground-soft)]">
              El tono visual de la marca busca tension elegante, no estridencia.
              Por eso cada composicion cuida vacio, escala, color y textura con
              el mismo rigor que la pieza fisica.
            </p>
          </div>

          <div className="grid gap-4">
            <Card tone="muted" className="p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Slogan
              </p>
              <p className="mt-3 text-3xl text-[var(--foreground)]">
                Presencia japonesa. Artesania oscura. Acabado de autor.
              </p>
            </Card>
            <Card tone="muted" className="p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Tesis comercial
              </p>
              <p className="mt-3 text-sm leading-8 text-[var(--foreground-soft)]">
                Piezas pensadas para quien no busca decoracion generica, sino una
                firma visual reconocible y bien terminada.
              </p>
            </Card>
          </div>
        </Card>
      </section>

      <section className="space-y-7">
        <div className="space-y-3">
          <Badge variant="accent">Trabajo artesanal</Badge>
          <h2 className="max-w-4xl text-5xl text-[var(--foreground)] md:text-6xl">
            El gesto manual no es un detalle decorativo. Es la base del caracter.
          </h2>
          <p className="max-w-2xl text-sm leading-8 text-[var(--foreground-soft)]">
            La materialidad de Otoshimae se construye desde el taller: pintura a
            mano, ajuste visual fino y decisiones que buscan dramatismo con
            precision, no ruido.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {artisanNotes.map((note) => (
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

      <section className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line)] bg-[linear-gradient(135deg,rgba(184,138,95,0.16)_0%,rgba(14,11,10,0.96)_36%,rgba(7,7,7,0.98)_100%)] shadow-[var(--shadow-card)]">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,138,95,0.16),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(109,38,33,0.16),transparent_24%)]"
          aria-hidden="true"
        />

        <div className="relative grid gap-8 p-8 md:p-10 xl:grid-cols-[1.05fr_0.95fr] xl:p-12">
          <div className="space-y-5">
            <Badge variant="accent">Cierre</Badge>
            <h2 className="max-w-4xl text-6xl text-[var(--foreground)] md:text-7xl">
              Entra al atelier y elige una pieza que no pida permiso para ser vista.
            </h2>
            <p className="max-w-2xl text-base leading-8 text-[var(--foreground-soft)]">
              Si buscas una marca artesanal con identidad fuerte, acabados
              profesionales y una oscuridad elegante de lectura contemporanea,
              este es el momento de explorar la coleccion completa.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button to={routes.catalog} size="lg">
                Ver toda la coleccion
              </Button>
              <Button to={routes.cart} variant="secondary" size="lg">
                Revisar carrito
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card tone="muted" className="p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Ideal para
              </p>
              <p className="mt-3 text-lg leading-7 text-[var(--foreground)]">
                Coleccion personal, styling editorial y objetos con presencia en escena.
              </p>
            </Card>
            <Card tone="muted" className="p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Promesa de marca
              </p>
              <p className="mt-3 text-lg leading-7 text-[var(--foreground)]">
                Artesania visible, composicion cuidada y una identidad que se recuerda.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
