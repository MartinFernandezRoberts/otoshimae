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
  { value: 'recent', label: 'Mas recientes' },
  { value: 'price-asc', label: 'Precio ascendente' },
  { value: 'price-desc', label: 'Precio descendente' },
  { value: 'name', label: 'Nombre A-Z' },
]

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
      'Explora el catalogo de Otoshimae con una presentacion editorial, filtros por categoria y stock real para cada pieza activa.',
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
  const selectedCategoryLabel = selectedCategory?.name ?? 'Toda la coleccion'
  const selectedSortLabel =
    sortOptions.find((item) => item.value === sort)?.label ?? 'Curaduria principal'
  const featuredCount = products.filter((product) => product.is_featured).length
  const availableCount = products.filter((product) => product.stock > 0).length
  const hasActiveFilters =
    search.trim().length > 0 || category !== 'all' || sort !== 'featured'

  const clearFilters = () => {
    setSearch('')
    setCategory('all')
    setSort('featured')
  }

  const filterControls = (
    <div className="space-y-5">
      <Input
        label="Buscar"
        placeholder="Nombre de la pieza o referencia visual"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        hint="Busca por nombre, descripcion o matiz de la pieza."
      />
      <Select
        label="Categoria"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        options={categoryOptions}
        hint="Filtra el catalogo por familia visual."
      />
      <Select
        label="Orden"
        value={sort}
        onChange={(event) => setSort(event.target.value as SortOption)}
        options={sortOptions}
        hint="Prioriza curaduria, novedad, nombre o precio."
      />

      <Button
        variant="ghost"
        className="w-full justify-center"
        onClick={clearFilters}
      >
        Limpiar filtros
      </Button>
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
        title="No hay productos activos"
        description="Publica al menos una pieza desde el panel admin para revelar el catalogo del storefront."
      />
    )
  }

  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line)] bg-[rgba(8,8,8,0.72)] shadow-[var(--shadow-card)]">
        <div className="grid gap-8 p-6 md:p-8 xl:grid-cols-[1.02fr_0.98fr] xl:p-10">
          <div className="space-y-5">
            <Badge variant="accent">Catalogo Otoshimae</Badge>
            <h1 className="max-w-4xl text-6xl text-[var(--foreground)] md:text-7xl">
              Una coleccion curada para dejar que cada pieza imponga presencia.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--foreground-soft)]">
              Aqui el producto manda: contraste alto, lectura limpia y filtros
              suficientes para descubrir mascaras, collares y accesorios sin perder
              la sensacion de marca de autor.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card tone="muted" className="p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Piezas publicadas
              </p>
              <p className="mt-4 text-4xl text-[var(--foreground)]">
                {products.length.toString().padStart(2, '0')}
              </p>
            </Card>
            <Card tone="muted" className="p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Atelier picks
              </p>
              <p className="mt-4 text-4xl text-[var(--foreground)]">
                {featuredCount.toString().padStart(2, '0')}
              </p>
            </Card>
            <Card tone="muted" className="p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                Con stock
              </p>
              <p className="mt-4 text-4xl text-[var(--foreground)]">
                {availableCount.toString().padStart(2, '0')}
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <Card className="sticky top-32 space-y-6 p-6">
            <div className="space-y-2">
              <Badge>Filtros</Badge>
              <h2 className="text-4xl text-[var(--foreground)]">Curaduria</h2>
              <p className="text-sm leading-8 text-[var(--foreground-soft)]">
                Ajusta la vista para descubrir familias visuales, series activas y
                piezas destacadas sin salir del lenguaje premium de la tienda.
              </p>
            </div>

            {filterControls}

            <div className="editorial-divider" />

            <div className="space-y-3 text-sm leading-7 text-[var(--foreground-soft)]">
              <p>Pintado a mano y detalle visible.</p>
              <p>Series cortas con stock real.</p>
              <p>Estetica japonesa contemporanea con lectura editorial.</p>
            </div>
          </Card>
        </aside>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 lg:hidden">
            <Badge variant="outline">{filteredProducts.length} piezas visibles</Badge>
            <Button variant="secondary" onClick={() => setFiltersOpen(true)}>
              Abrir filtros
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className={`rounded-full border px-4 py-2 text-sm transition ${
                category === 'all'
                  ? 'border-[rgba(209,178,138,0.24)] bg-[rgba(209,178,138,0.1)] text-[var(--accent-strong)]'
                  : 'border-[var(--line)] text-[var(--foreground-soft)] hover:border-[var(--line-strong)] hover:text-[var(--foreground)]'
              }`}
              onClick={() => setCategory('all')}
            >
              Todo
            </button>
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  category === item.slug
                    ? 'border-[rgba(209,178,138,0.24)] bg-[rgba(209,178,138,0.1)] text-[var(--accent-strong)]'
                    : 'border-[var(--line)] text-[var(--foreground-soft)] hover:border-[var(--line-strong)] hover:text-[var(--foreground)]'
                }`}
                onClick={() => setCategory(item.slug)}
              >
                {item.name}
              </button>
            ))}
          </div>

          <Card tone="muted" className="p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--muted)]">
                  Vista actual
                </p>
                <p className="text-2xl text-[var(--foreground)]">
                  {selectedCategoryLabel}
                </p>
                <p className="text-sm leading-7 text-[var(--foreground-soft)]">
                  {selectedCategory?.description ??
                    'Recorre toda la coleccion para descubrir el universo completo de Otoshimae.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Busqueda: {search || 'sin texto'}</Badge>
                <Badge variant="outline">Orden: {selectedSortLabel}</Badge>
                <Badge variant="outline">{filteredProducts.length} resultados</Badge>
              </div>
            </div>

            {hasActiveFilters ? (
              <div className="mt-4">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Restablecer vista
                </Button>
              </div>
            ) : null}
          </Card>

          {filteredProducts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No encontramos piezas con esos filtros"
              description="Prueba con otra busqueda, vuelve a una categoria mas amplia o recupera la curaduria principal del catalogo."
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
        title="Filtros del catalogo"
        description="Ajusta categoria, texto y orden para explorar la coleccion."
        footer={
          <Button variant="secondary" onClick={() => setFiltersOpen(false)}>
            Aplicar
          </Button>
        }
      >
        {filterControls}
      </Modal>
    </div>
  )
}
