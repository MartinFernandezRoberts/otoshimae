import { useDeferredValue, useEffect, useMemo, useState } from 'react'

import { PagePlaceholder } from '@/components/PagePlaceholder'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Loader } from '@/components/ui/Loader'
import { Modal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { StatusMessage } from '@/components/ui/StatusMessage'
import {
  adjustProductStock,
  createProduct,
  deleteProduct,
  listAdminCategories,
  listAdminProducts,
  markProductImageAsDeleted,
  updateProduct,
  uploadProductImage,
} from '@/features/admin/admin.api'
import { ProductForm } from '@/features/admin/ProductForm'
import { ProductImageManager } from '@/features/admin/ProductImageManager'
import { StockAdjustmentForm } from '@/features/admin/StockAdjustmentForm'
import type {
  AdminProductFormValues,
  StockAdjustmentValues,
} from '@/features/admin/admin.types'
import {
  createProductDefaults,
  createStockDefaults,
  normalizeSlugFromName,
  sortRows,
} from '@/features/admin/admin.utils'
import type { SortDirection } from '@/features/admin/admin.utils'
import { formatCurrency } from '@/lib/formatCurrency'
import type { CategoryRow } from '@/types/database'
import type { AdminProductImage, AdminProductRecord } from '@/features/admin/admin.types'

type ProductSortKey = 'name' | 'category' | 'price' | 'stock'
type StockFilter = 'all' | 'in-stock' | 'out-of-stock'

const productSortAccessors: Record<ProductSortKey, (product: AdminProductRecord) => string | number> = {
  name: (product) => product.name.toLowerCase(),
  category: (product) => (product.categories?.[0]?.name ?? '').toLowerCase(),
  price: (product) => Number(product.price),
  stock: (product) => product.stock,
}

function matchesProductQuery(product: AdminProductRecord, query: string) {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return true
  }

  return [product.name, product.slug, product.sku ?? '']
    .join(' ')
    .toLowerCase()
    .includes(normalized)
}

function toProductFormValues(product?: AdminProductRecord): AdminProductFormValues {
  if (!product) {
    return createProductDefaults()
  }

  return {
    name: product.name,
    slug: product.slug,
    description: product.description ?? '',
    shortDescription: product.short_description ?? '',
    price: String(product.price ?? ''),
    comparePrice: product.compare_price ? String(product.compare_price) : '',
    stock: String(product.stock),
    sku: product.sku ?? '',
    categoryId: product.category_id ?? '',
    isActive: product.is_active,
    isFeatured: product.is_featured,
  }
}

function validateProduct(values: AdminProductFormValues) {
  const errors: Partial<Record<keyof AdminProductFormValues, string>> = {}

  if (values.name.trim().length < 2) {
    errors.name = 'Ingresa un nombre válido.'
  }

  if (values.slug.trim().length < 2) {
    errors.slug = 'El slug debe tener al menos 2 caracteres.'
  }

  if (!values.price.trim() || Number(values.price) < 0) {
    errors.price = 'Ingresa un precio válido.'
  }

  if (!values.stock.trim() || Number(values.stock) < 0) {
    errors.stock = 'El stock no puede ser negativo.'
  }

  return errors
}

function validateStock(values: StockAdjustmentValues) {
  const errors: Partial<Record<keyof StockAdjustmentValues, string>> = {}

  if (!values.quantity.trim() || Number.isNaN(Number(values.quantity))) {
    errors.quantity = 'Ingresa un ajuste numérico.'
  }

  return errors
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductRecord[]>([])
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [productModalOpen, setProductModalOpen] = useState(false)
  const [productSubmitting, setProductSubmitting] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProductRecord | null>(null)
  const [productFormValues, setProductFormValues] = useState<AdminProductFormValues>(
    createProductDefaults(),
  )
  const [productFormErrors, setProductFormErrors] = useState<
    Partial<Record<keyof AdminProductFormValues, string>>
  >({})
  const [imageUploading, setImageUploading] = useState(false)
  const [imageDeletingId, setImageDeletingId] = useState<string | null>(null)

  const [stockModalOpen, setStockModalOpen] = useState(false)
  const [stockSubmitting, setStockSubmitting] = useState(false)
  const [stockProduct, setStockProduct] = useState<AdminProductRecord | null>(null)
  const [stockValues, setStockValues] = useState<StockAdjustmentValues>(
    createStockDefaults(),
  )
  const [stockErrors, setStockErrors] = useState<
    Partial<Record<keyof StockAdjustmentValues, string>>
  >({})

  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState<StockFilter>('all')
  const [sortKey, setSortKey] = useState<ProductSortKey>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const [deleteTarget, setDeleteTarget] = useState<AdminProductRecord | null>(null)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)

  const loadData = async () => {
    try {
      setError(null)
      const [nextProducts, nextCategories] = await Promise.all([
        listAdminProducts(),
        listAdminCategories(),
      ])

      setProducts(nextProducts)
      setCategories(nextCategories)
      setEditingProduct((current) =>
        current ? nextProducts.find((product) => product.id === current.id) ?? null : null,
      )
      setStockProduct((current) =>
        current ? nextProducts.find((product) => product.id === current.id) ?? null : null,
      )
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No se pudieron cargar los productos.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadData()
    })
  }, [])

  const visibleImageCount = useMemo(
    () =>
      products.reduce(
        (accumulator, product) =>
          accumulator +
          (product.product_images?.filter((image) => !image.is_deleted).length ?? 0),
        0,
      ),
    [products],
  )

  const handleProductChange = <Key extends keyof AdminProductFormValues>(
    key: Key,
    value: AdminProductFormValues[Key],
  ) => {
    setProductFormValues((current) => {
      if (key === 'name') {
        const currentAutoSlug = normalizeSlugFromName(current.name)
        const shouldSyncSlug = current.slug === '' || current.slug === currentAutoSlug

        return {
          ...current,
          name: String(value),
          slug: shouldSyncSlug ? normalizeSlugFromName(String(value)) : current.slug,
        }
      }

      return {
        ...current,
        [key]: value,
      }
    })
  }

  const openCreateModal = () => {
    setEditingProduct(null)
    setProductFormValues(createProductDefaults())
    setProductFormErrors({})
    setProductModalOpen(true)
  }

  const openEditModal = (product: AdminProductRecord) => {
    setEditingProduct(product)
    setProductFormValues(toProductFormValues(product))
    setProductFormErrors({})
    setProductModalOpen(true)
  }

  const openStockModal = (product: AdminProductRecord) => {
    setStockProduct(product)
    setStockValues(createStockDefaults())
    setStockErrors({})
    setStockModalOpen(true)
  }

  const handleProductSubmit = async () => {
    const nextErrors = validateProduct(productFormValues)
    setProductFormErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    try {
      setProductSubmitting(true)
      setError(null)
      setSuccess(null)

      if (editingProduct) {
        await updateProduct(editingProduct.id, productFormValues)
        setSuccess('Producto actualizado correctamente.')
      } else {
        await createProduct(productFormValues)
        setSuccess('Producto creado correctamente.')
      }

      setProductModalOpen(false)
      await loadData()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No se pudo guardar el producto.',
      )
    } finally {
      setProductSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      setDeleteSubmitting(true)
      setError(null)
      setSuccess(null)
      await deleteProduct(deleteTarget.id)
      setSuccess('Producto eliminado correctamente.')
      setDeleteTarget(null)
      await loadData()
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar el producto.',
      )
    } finally {
      setDeleteSubmitting(false)
    }
  }

  const handleStockSubmit = async () => {
    if (!stockProduct) {
      return
    }

    const nextErrors = validateStock(stockValues)
    setStockErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    try {
      setStockSubmitting(true)
      setError(null)
      setSuccess(null)
      await adjustProductStock(stockProduct.id, stockProduct.stock, stockValues)
      setSuccess('Stock actualizado correctamente.')
      setStockModalOpen(false)
      await loadData()
    } catch (stockError) {
      setError(
        stockError instanceof Error
          ? stockError.message
          : 'No se pudo ajustar el stock.',
      )
    } finally {
      setStockSubmitting(false)
    }
  }

  const handleImageUpload = async (file: File, alt: string, sortOrder: number) => {
    if (!editingProduct) {
      return
    }

    try {
      setImageUploading(true)
      setError(null)
      setSuccess(null)
      await uploadProductImage(editingProduct.id, file, alt, sortOrder)
      setSuccess('Imagen agregada correctamente.')
      await loadData()
    } finally {
      setImageUploading(false)
    }
  }

  const handleImageDelete = async (image: AdminProductImage) => {
    try {
      setImageDeletingId(image.id)
      setError(null)
      setSuccess(null)
      await markProductImageAsDeleted(image)
      setSuccess('Imagen marcada como eliminada.')
      await loadData()
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar la imagen.',
      )
    } finally {
      setImageDeletingId(null)
    }
  }

  const categoryOptions = useMemo(
    () => [
      { value: 'all', label: 'Todas las categorías' },
      ...categories.map((category) => ({ value: category.id, label: category.name })),
    ],
    [categories],
  )

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const matchesQuery = matchesProductQuery(product, deferredSearch)
      const matchesCategory =
        categoryFilter === 'all' || product.category_id === categoryFilter
      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'in-stock' && product.stock > 0) ||
        (stockFilter === 'out-of-stock' && product.stock <= 0)

      return matchesQuery && matchesCategory && matchesStock
    })

    return sortRows(filtered, productSortAccessors[sortKey], sortDirection)
  }, [categoryFilter, deferredSearch, products, sortDirection, sortKey, stockFilter])

  const toggleSort = (key: ProductSortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortKey(key)
    setSortDirection('asc')
  }

  const hasActiveFilters =
    search.trim().length > 0 || categoryFilter !== 'all' || stockFilter !== 'all'

  const clearFilters = () => {
    setSearch('')
    setCategoryFilter('all')
    setStockFilter('all')
  }

  const sortHeader = (key: ProductSortKey, label: string) => (
    <button
      type="button"
      className="ui-sort-button"
      data-active={sortKey === key}
      onClick={() => toggleSort(key)}
    >
      {label}
      <span className="ui-sort-icon" aria-hidden="true">
        {sortKey === key ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'}
      </span>
    </button>
  )

  return (
    <PagePlaceholder
      eyebrow="Admin"
      title="Productos"
      description={`CRUD de productos con edición de stock e imágenes. Actualmente hay ${visibleImageCount} imágenes activas.`}
      actions={<Button onClick={openCreateModal}>Nuevo producto</Button>}
    >
      {error ? <StatusMessage tone="error" message={error} /> : null}
      {success ? <StatusMessage tone="success" message={success} /> : null}

      {loading ? (
        <Card tone="admin" className="p-8">
          <Loader label="Cargando productos..." />
        </Card>
      ) : products.length === 0 ? (
        <EmptyState
          title="No hay productos todavía"
          description="Crea el primer producto para empezar a poblar el catálogo administrable."
          action={<Button onClick={openCreateModal}>Crear producto</Button>}
        />
      ) : (
        <div className="space-y-5">
          <Card tone="admin" className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_220px_auto]">
            <Input
              label="Buscar"
              placeholder="Nombre, slug o SKU"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Select
              label="Categoría"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              options={categoryOptions}
            />
            <div className="flex items-end gap-2">
              {(
                [
                  { value: 'all', label: 'Todos' },
                  { value: 'in-stock', label: 'Con stock' },
                  { value: 'out-of-stock', label: 'Agotados' },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="ui-chip"
                  data-active={stockFilter === option.value}
                  onClick={() => setStockFilter(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Card>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--foreground-soft)]">
              {filteredProducts.length} de {products.length} productos
            </p>
            {hasActiveFilters ? (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            ) : null}
          </div>

          {filteredProducts.length === 0 ? (
            <EmptyState
              title="No hay productos para esos filtros"
              description="Ajusta la búsqueda, la categoría o el estado de stock para ver resultados."
              action={
                <Button variant="secondary" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              }
            />
          ) : (
            <>
              <div className="ui-table-wrap hidden lg:block">
                <table className="ui-table">
                  <thead>
                    <tr className="ui-table-head-row">
                      <th className="ui-table-head-cell">Imagen</th>
                      <th className="ui-table-head-cell">{sortHeader('name', 'Nombre')}</th>
                      <th className="ui-table-head-cell">{sortHeader('category', 'Categoría')}</th>
                      <th className="ui-table-head-cell">{sortHeader('price', 'Precio')}</th>
                      <th className="ui-table-head-cell">{sortHeader('stock', 'Stock')}</th>
                      <th className="ui-table-head-cell">Estado</th>
                      <th className="ui-table-head-cell">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const activeImages =
                        product.product_images?.filter((image) => !image.is_deleted) ?? []
                      const thumbnail = activeImages[0]?.url

                      return (
                        <tr key={product.id} className="ui-table-row">
                          <td className="ui-table-cell">
                            <div className="ui-image-placeholder h-12 w-12 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--line)]">
                              {thumbnail ? (
                                <img
                                  src={thumbnail}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                />
                              ) : null}
                            </div>
                          </td>
                          <td className="ui-table-cell">
                            <p className="text-base font-medium text-[var(--foreground)]">
                              {product.name}
                            </p>
                            <p className="text-xs text-[var(--muted)]">/{product.slug}</p>
                          </td>
                          <td className="ui-table-cell">
                            {product.categories?.[0]?.name ?? 'Sin categoría'}
                          </td>
                          <td className="ui-table-cell">{formatCurrency(Number(product.price))}</td>
                          <td className="ui-table-cell">
                            <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
                              {product.stock}
                            </Badge>
                          </td>
                          <td className="ui-table-cell">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant={product.is_active ? 'success' : 'outline'}>
                                {product.is_active ? 'Activo' : 'Inactivo'}
                              </Badge>
                              {product.is_featured ? <Badge variant="accent">Destacado</Badge> : null}
                            </div>
                          </td>
                          <td className="ui-table-cell">
                            <div className="flex flex-wrap gap-2">
                              <Button variant="secondary" size="sm" onClick={() => openEditModal(product)}>
                                Editar
                              </Button>
                              <Button variant="secondary" size="sm" onClick={() => openStockModal(product)}>
                                Stock
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteTarget(product)}
                              >
                                Eliminar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 lg:hidden">
                {filteredProducts.map((product) => {
                  const activeImages =
                    product.product_images?.filter((image) => !image.is_deleted).length ?? 0

                  return (
                    <Card key={product.id} tone="admin" className="space-y-5 p-5">
                      <div className="space-y-2">
                        <h2 className="text-3xl text-[var(--foreground)]">{product.name}</h2>
                        <p className="text-sm text-[var(--foreground-soft)]">
                          /{product.slug} · {product.categories?.[0]?.name ?? 'Sin categoría'}
                        </p>
                        <p className="text-sm leading-7 text-[var(--muted)]">
                          {product.short_description || product.description || 'Sin descripción'}
                        </p>
                      </div>

                      <div className="grid gap-3 text-sm text-[var(--foreground-soft)] md:grid-cols-2">
                        <p>Precio: {formatCurrency(Number(product.price))}</p>
                        <p>Stock: {product.stock}</p>
                        <p>SKU: {product.sku || 'Sin SKU'}</p>
                        <p>Imágenes activas: {activeImages}</p>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button variant="secondary" size="sm" onClick={() => openEditModal(product)}>
                          Editar
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => openStockModal(product)}>
                          Ajustar stock
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(product)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      <Modal
        open={productModalOpen}
        onClose={() => setProductModalOpen(false)}
        title={editingProduct ? 'Editar producto' : 'Nuevo producto'}
        description={
          editingProduct
            ? 'Actualiza contenido, disponibilidad y material visual del producto.'
            : 'Crea un producto y luego podrás cargar imágenes desde esta misma ficha.'
        }
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setProductModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => void handleProductSubmit()} loading={productSubmitting}>
              Guardar producto
            </Button>
          </div>
        }
      >
        <div className="space-y-6">
          <ProductForm
            values={productFormValues}
            errors={productFormErrors}
            categories={categories}
            onChange={handleProductChange}
          />

          {editingProduct ? (
            <ProductImageManager
              images={editingProduct.product_images ?? []}
              uploading={imageUploading}
              deletingId={imageDeletingId}
              onUpload={handleImageUpload}
              onDelete={handleImageDelete}
            />
          ) : null}
        </div>
      </Modal>

      <Modal
        open={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        title={stockProduct ? `Ajustar stock: ${stockProduct.name}` : 'Ajustar stock'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setStockModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => void handleStockSubmit()} loading={stockSubmitting}>
              Guardar ajuste
            </Button>
          </div>
        }
      >
        <StockAdjustmentForm
          values={stockValues}
          errors={stockErrors}
          onChange={(key, value) =>
            setStockValues((current) => ({
              ...current,
              [key]: value,
            }))
          }
        />
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title={deleteTarget ? `¿Eliminar "${deleteTarget.name}"?` : 'Eliminar producto'}
        description="El producto se eliminará del catálogo administrable de forma permanente."
        confirmLabel="Eliminar producto"
        tone="destructive"
        loading={deleteSubmitting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </PagePlaceholder>
  )
}
