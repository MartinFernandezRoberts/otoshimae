import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { ProductCard } from '@/components/ProductCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Loader } from '@/components/ui/Loader'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import {
  listPublicCategories,
  listPublicProducts,
} from '@/features/catalog/catalog.api'
import { matchesProductSearch } from '@/features/catalog/catalog.utils'
import { useSeo } from '@/hooks/useSeo'
import type { CategoryRow, PublicProductSummary } from '@/types/database'

type SortOption = 'featured' | 'recent' | 'price-asc' | 'price-desc' | 'name'

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'featured', label: 'Curaduria principal' },
  { value: 'recent', label: 'Recien incorporadas' },
  { value: 'price-asc', label: 'Precio ascendente' },
  { value: 'price-desc', label: 'Precio descendente' },
  { value: 'name', label: 'Nombre A-Z' },
]

const collectionSignals = [
  'Pintado a mano',
  'Serie corta',
  'Inspiracion japonesa',
  'Pieza decorativa',
] as const

function sortProducts(products: PublicProductSummary[], sort: SortOption) {
  const nextProducts = [...products]

  if (sort === 'price-asc') {
    nextProducts.sort((left, right) => left.price - right.price)
  } else if (sort === 'price-desc') {
    nextProducts.sort((left, right) => right.price - left.price)
  } else if (sort === 'name') {
    nextProducts.sort((left, right) => left.name.localeCompare(right.name))
  } else if (sort === 'recent') {
    nextProducts.sort(
      (left, right) =>
        new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
    )
  } else {
    nextProducts.sort((left, right) => {
      if (left.is_featured === right.is_featured) {
        return (
          new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
        )
      }

      return Number(right.is_featured) - Number(left.is_featured)
    })
  }

  return nextProducts
}

function getCollectionHeading(category: CategoryRow | null, search: string) {
  if (search.trim()) {
    return {
      title: 'Resultados afinados dentro del universo Otoshimae',
      description:
        'Piezas que dialogan con tu busqueda sin salir del lenguaje de la marca: decorativo, artesanal, oscuro y cuidadosamente compuesto.',
    }
  }

  if (!category) {
    return {
      title: 'Coleccion completa de piezas decorativas con presencia propia',
      description:
        'Explora mascaras oni decorativas, collares ornamentales y objetos de adorno desde una grilla clara, elegante y pensada para dejar respirar cada pieza.',
    }
  }

  const normalized = `${category.slug} ${category.name}`.toLowerCase()

  if (normalized.includes('mascar') || normalized.includes('oni')) {
    return {
      title: 'Mascaras decorativas con dramatismo ceremonial y lectura contemporanea',
      description:
        'Rostros de impacto concebidos para coleccion, ambientacion o exhibicion con una tension visual precisa y artesanal.',
    }
  }

  if (normalized.includes('collar')) {
    return {
      title: 'Collares decorativos con acento sobrio y distintivo',
      description:
        'Piezas ornamentales con inspiracion japonesa, contraste controlado y una presencia que se aprecia en coleccion, estilismo o exhibicion.',
    }
  }

  return {
    title: `${category.name} dentro del universo Otoshimae`,
    description:
      category.description ??
      'Una familia visual con identidad propia, acabados de taller y valor ornamental de boutique.',
  }
}

export function CatalogPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<PublicProductSummary[]>([])
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(() => searchParams.get('categoria') ?? 'all')
  const [sort, setSort] = useState<SortOption>('featured')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const deferredSearch = useDeferredValue(search)

  useSeo({
    title: 'Catalogo',
    description:
      'Explora el catalogo de Otoshimae desde una experiencia de tienda premium con filtros limpios, piezas de autor y stock real.',
  })

  useEffect(() => {
    let cancelled = false

    const loadCatalog = async () => {
      try {
        setLoading(true)
        setError(null)

        const [nextProducts, nextCategories] = await Promise.all([
          listPublicProducts({ force: reloadKey > 0 }),
          listPublicCategories({ force: reloadKey > 0 }),
        ])

        if (!cancelled) {
          setProducts(nextProducts)
          setCategories(nextCategories)
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(
            nextError instanceof Error
              ? nextError.message
              : 'No fue posible cargar el catalogo.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadCatalog()

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const filteredProducts = useMemo(() => {
    const nextProducts = products.filter((product) => {
      const matchesCategory =
        category === 'all' || product.category?.slug === category

      return matchesCategory && matchesProductSearch(product, deferredSearch)
    })

    return sortProducts(nextProducts, sort)
  }, [category, deferredSearch, products, sort])

  const featuredCount = products.filter((product) => product.is_featured).length
  const availableCount = products.filter((product) => product.stock > 0).length

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: 'Todas las categorias' },
      ...categories.map((item) => ({
        value: item.slug,
        label: item.name,
      })),
    ],
    [categories],
  )

  const selectedCategory = categories.find((item) => item.slug === category) ?? null
  const selectedSortLabel =
    sortOptions.find((item) => item.value === sort)?.label ?? 'Curaduria principal'
  const hasActiveFilters =
    search.trim().length > 0 || category !== 'all' || sort !== 'featured'

  const collectionHeading = useMemo(
    () => getCollectionHeading(selectedCategory, search),
    [search, selectedCategory],
  )

  const clearFilters = () => {
    setSearch('')
    setCategory('all')
    setSort('featured')
  }

  const filterControls = (
    <div className="space-y-5">
      <Input
        label="Buscar"
        placeholder="Nombre de la pieza, oni, collar o referencia visual"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        hint="Busca por nombre, descripcion o atmosfera visual."
      />
      <Select
        label="Categoria"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        options={categoryOptions}
        hint="Recorre la coleccion por familia visual."
      />
      <Select
        label="Orden"
        value={sort}
        onChange={(event) => setSort(event.target.value as SortOption)}
        options={sortOptions}
        hint="Prioriza curaduria, novedad o rango de valor."
      />

      <div className="grid gap-3">
        <Button variant="secondary" className="w-full" onClick={clearFilters}>
          Limpiar filtros
        </Button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <Card className="p-8">
        <Loader label="Cargando catalogo..." />
      </Card>
    )
  }

  if (error) {
    return (
      <EmptyState
        title="No se pudo cargar el catalogo"
        description={error}
        action={
          <Button variant="secondary" onClick={() => setReloadKey((value) => value + 1)}>
            Reintentar
          </Button>
        }
      />
    )
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No hay piezas activas en el atelier"
        description="Publica productos desde el panel admin para revelar una coleccion decorativa con identidad, filtros y stock real."
      />
    )
  }

  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line)] bg-[rgba(8,8,8,0.74)] shadow-[var(--shadow-card)]">
        <div className="store-grid absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative grid gap-8 p-6 md:p-8 xl:grid-cols-[1.08fr_0.92fr] xl:p-10">
          <div className="space-y-6">
            <Badge variant="accent">Catalogo Otoshimae</Badge>
            <div className="space-y-5">
              <h1 className="max-w-5xl text-6xl text-[var(--foreground)] md:text-7xl">
                Una coleccion de autor para mirar con calma y elegir por presencia.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--foreground-soft)]">
                El catalogo prioriza contraste, aire y presencia. Aqui cada pieza
                aparece como parte de una curaduria decorativa y premium: hecha a
                mano, de inspiracion japonesa y con un acabado listo para
                coleccion, ambientacion o exhibicion.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {collectionSignals.map((signal) => (
                <Badge key={signal} variant="outline">
                  {signal}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card tone="muted" className="p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Piezas publicadas
              </p>
              <p className="mt-4 text-4xl text-[var(--foreground)]">
                {products.length.toString().padStart(2, '0')}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground-soft)]">
                Series activas listas para exploracion y encargo.
              </p>
            </Card>
            <Card tone="muted" className="p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Seleccion del atelier
              </p>
              <p className="mt-4 text-4xl text-[var(--foreground)]">
                {featuredCount.toString().padStart(2, '0')}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground-soft)]">
                Piezas elegidas por fuerza visual y firma de marca.
              </p>
            </Card>
            <Card tone="muted" className="p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Con stock
              </p>
              <p className="mt-4 text-4xl text-[var(--foreground)]">
                {availableCount.toString().padStart(2, '0')}
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground-soft)]">
                Disponibilidad real para una seleccion clara y sin ruido.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[330px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <Card className="sticky top-32 space-y-6 p-6">
            <div className="space-y-3">
              <Badge>Filtros de coleccion</Badge>
              <h2 className="text-4xl text-[var(--foreground)]">Curaduria afinada</h2>
              <p className="text-sm leading-8 text-[var(--foreground-soft)]">
                Ajusta el catalogo sin ruido visual: una lectura clara para piezas
                decorativas de autor, series artesanales y objetos con inspiracion japonesa.
              </p>
            </div>

            {filterControls}

            <div className="editorial-divider" />

            <div className="space-y-3 text-sm leading-7 text-[var(--foreground-soft)]">
              <p>Filtra por familia visual o por nombre de pieza.</p>
              <p>Explora stock real sin perder el tono editorial del atelier.</p>
              <p>Una grilla pensada para que cada objeto se lea con claridad.</p>
            </div>
          </Card>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 lg:hidden">
            <Badge variant="outline">{filteredProducts.length} piezas visibles</Badge>
            <Button variant="secondary" onClick={() => setFiltersOpen(true)}>
              Abrir curaduria
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                category === 'all'
                  ? 'border-[rgba(184,138,95,0.24)] bg-[rgba(184,138,95,0.12)] text-[var(--accent-strong)]'
                  : 'border-[var(--line)] text-[var(--foreground-soft)] hover:border-[rgba(184,138,95,0.24)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--foreground)]'
              }`}
              onClick={() => setCategory('all')}
            >
              Toda la coleccion
            </button>
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                  category === item.slug
                    ? 'border-[rgba(184,138,95,0.24)] bg-[rgba(184,138,95,0.12)] text-[var(--accent-strong)]'
                    : 'border-[var(--line)] text-[var(--foreground-soft)] hover:border-[rgba(184,138,95,0.24)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--foreground)]'
                }`}
                onClick={() => setCategory(item.slug)}
              >
                {item.name}
              </button>
            ))}
          </div>

          <Card tone="muted" className="space-y-5 p-5 md:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-3">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                  Encabezado de coleccion
                </p>
                <h2 className="max-w-3xl text-4xl text-[var(--foreground)] md:text-5xl">
                  {collectionHeading.title}
                </h2>
                <p className="max-w-2xl text-sm leading-8 text-[var(--foreground-soft)]">
                  {collectionHeading.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Orden: {selectedSortLabel}</Badge>
                <Badge variant="outline">{filteredProducts.length} piezas</Badge>
                {search ? <Badge variant="outline">Busqueda: {search}</Badge> : null}
              </div>
            </div>

            {hasActiveFilters ? (
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-[var(--foreground-soft)]">
                  Vista afinada con filtros activos.
                </p>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Volver a la seleccion principal
                </Button>
              </div>
            ) : (
              <p className="text-sm text-[var(--foreground-soft)]">
                Curaduria abierta: descubre la seleccion completa sin filtros activos.
              </p>
            )}
          </Card>

          {filteredProducts.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 2xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No encontramos piezas para esa combinacion"
              description="Prueba una busqueda mas amplia, vuelve a toda la coleccion o recupera la seleccion principal para seguir explorando el atelier."
              action={
                <Button variant="secondary" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              }
            />
          )}
        </div>
      </section>

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Curaduria del catalogo"
        description="Refina la coleccion por texto, categoria y orden sin perder la lectura premium del storefront."
        footer={
          <Button variant="secondary" onClick={() => setFiltersOpen(false)}>
            Ver resultados
          </Button>
        }
      >
        {filterControls}
      </Modal>
    </div>
  )
}
