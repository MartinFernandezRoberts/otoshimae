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

const sortOptions = [
  { value: 'featured', label: 'Destacados primero' },
  { value: 'recent', label: 'Mas recientes' },
  { value: 'price-asc', label: 'Precio ascendente' },
  { value: 'price-desc', label: 'Precio descendente' },
  { value: 'name', label: 'Nombre A-Z' },
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
      'Explora el catalogo activo de Otoshimae con filtros por categoria, busqueda por nombre y stock en tiempo real.',
  })

  useEffect(() => {
    let cancelled = false

    const loadCatalog = async () => {
      try {
        setLoading(true)
        setError(null)

        const [nextProducts, nextCategories] = await Promise.all([
          listPublicProducts(),
          listPublicCategories(),
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

  const selectedCategoryLabel =
    category === 'all'
      ? 'Todas'
      : categories.find((item) => item.slug === category)?.name ?? 'Categoria'

  const filterControls = (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <Input
        label="Buscar"
        placeholder="Nombre de la pieza"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <Select
        label="Categoria"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        options={[
          { value: 'all', label: 'Todas las categorias' },
          ...categories.map((item) => ({
            value: item.slug,
            label: item.name,
          })),
        ]}
      />
      <Select
        label="Orden"
        value={sort}
        onChange={(event) => setSort(event.target.value as SortOption)}
        options={[...sortOptions]}
      />
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
        description="Publica al menos un producto desde el panel admin para mostrarlo en el storefront."
      />
    )
  }

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-col gap-6 rounded-[var(--radius-xl)] border border-[var(--line)] bg-[var(--surface-strong)] p-8 shadow-[var(--shadow-card)] lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Badge variant="accent">Catalogo</Badge>
            <h1 className="max-w-4xl text-5xl text-[var(--foreground)] md:text-6xl">
              Una cuadrilla limpia para dejar que el producto respire.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--foreground-soft)]">
              Catalogo conectado a Supabase con busqueda por nombre, filtros por
              categoria y stock real para cada pieza publicada.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{filteredProducts.length} resultados</Badge>
            <Button
              variant="secondary"
              className="md:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              Abrir filtros
            </Button>
          </div>
        </div>

        <div className="hidden md:block">{filterControls}</div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Busqueda: {search || 'sin texto'}</Badge>
          <Badge variant="outline">Categoria: {selectedCategoryLabel}</Badge>
          <Badge variant="outline">
            Orden: {sortOptions.find((item) => item.value === sort)?.label}
          </Badge>
        </div>
      </section>

      <section className="mt-10">
        {filteredProducts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No encontramos piezas con esos filtros"
            description="Prueba otra busqueda o vuelve a una categoria mas amplia para seguir explorando el catalogo."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setSearch('')
                  setCategory('all')
                  setSort('featured')
                }}
              >
                Limpiar filtros
              </Button>
            }
          />
        )}
      </section>

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filtros de catalogo"
        description="Controles rapidos para ajustar la vista en pantallas pequenas."
        footer={
          <Button variant="secondary" onClick={() => setFiltersOpen(false)}>
            Aplicar
          </Button>
        }
      >
        {filterControls}
      </Modal>
    </>
  )
}
