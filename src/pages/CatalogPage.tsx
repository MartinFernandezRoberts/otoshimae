import { useMemo, useState } from 'react'

import { ProductCard } from '@/components/ProductCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Loader } from '@/components/ui/Loader'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { mockCategories, publishedProducts } from '@/features/catalog/mockProducts'
import { usePageTitle } from '@/hooks/usePageTitle'
import type { Product } from '@/types/catalog'

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name'

const sortOptions = [
  { value: 'featured', label: 'Destacados primero' },
  { value: 'price-asc', label: 'Precio ascendente' },
  { value: 'price-desc', label: 'Precio descendente' },
  { value: 'name', label: 'Nombre A-Z' },
] as const

const availabilityOptions = [
  { value: 'all', label: 'Todas las disponibilidades' },
  { value: 'available', label: 'Disponible' },
  { value: 'limited', label: 'Serie limitada' },
  { value: 'sold-out', label: 'Agotada' },
]

function sortProducts(products: Product[], sort: SortOption) {
  const next = [...products]

  if (sort === 'price-asc') {
    next.sort((a, b) => a.price - b.price)
  } else if (sort === 'price-desc') {
    next.sort((a, b) => b.price - a.price)
  } else if (sort === 'name') {
    next.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    next.sort((a, b) => Number(b.featured) - Number(a.featured))
  }

  return next
}

export function CatalogPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [availability, setAvailability] = useState('all')
  const [sort, setSort] = useState<SortOption>('featured')
  const [filtersOpen, setFiltersOpen] = useState(false)

  usePageTitle('Catálogo')

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const result = publishedProducts.filter((product) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.description.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch)

      const matchesCategory =
        category === 'all' || product.categoryId === category

      const matchesAvailability =
        availability === 'all' || product.availability === availability

      return matchesSearch && matchesCategory && matchesAvailability
    })

    return sortProducts(result, sort)
  }, [availability, category, search, sort])

  const resetFilters = () => {
    setSearch('')
    setCategory('all')
    setAvailability('all')
    setSort('featured')
  }

  const filterControls = (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Input
        label="Buscar"
        placeholder="Nombre, material o categoría"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <Select
        label="Categoría"
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        options={[
          { value: 'all', label: 'Todas las colecciones' },
          ...mockCategories.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        ]}
      />
      <Select
        label="Disponibilidad"
        value={availability}
        onChange={(event) => setAvailability(event.target.value)}
        options={availabilityOptions}
      />
      <Select
        label="Orden"
        value={sort}
        onChange={(event) => setSort(event.target.value as SortOption)}
        options={[...sortOptions]}
      />
    </div>
  )

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-col gap-6 rounded-[var(--radius-xl)] border border-[var(--line)] bg-[var(--surface-strong)] p-8 shadow-[var(--shadow-card)] lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-4">
            <Badge variant="accent">Catálogo</Badge>
            <h1 className="max-w-4xl text-5xl text-[var(--foreground)] md:text-6xl">
              Una cuadrícula limpia para dejar que el producto respire.
            </h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--foreground-soft)]">
              Filtros visuales simples, tono editorial y foco en disponibilidad,
              material y lectura de pieza. Sin sobreingeniería para esta etapa.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>{filteredProducts.length} resultados</Badge>
            <Loader size="sm" label="Curaduría manual" />
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
          <Badge variant="outline">Búsqueda: {search || 'sin texto'}</Badge>
          <Badge variant="outline">
            Categoría:{' '}
            {category === 'all'
              ? 'todas'
              : mockCategories.find((item) => item.id === category)?.name}
          </Badge>
          <Badge variant="outline">
            Disponibilidad:{' '}
            {availabilityOptions.find((item) => item.value === availability)?.label}
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
            description="Prueba otra búsqueda o vuelve a una colección más amplia para seguir explorando el catálogo."
            action={
              <Button variant="secondary" onClick={resetFilters}>
                Limpiar navegación
              </Button>
            }
          />
        )}
      </section>

      <Modal
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filtros de catálogo"
        description="Controles rápidos para ajustar la vista en pantallas pequeñas."
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
