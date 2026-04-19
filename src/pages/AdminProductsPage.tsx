import { useEffect, useMemo, useState } from 'react'

import { PagePlaceholder } from '@/components/PagePlaceholder'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Loader } from '@/components/ui/Loader'
import { Modal } from '@/components/ui/Modal'
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
} from '@/features/admin/admin.utils'
import { formatCurrency } from '@/lib/formatCurrency'
import type { CategoryRow } from '@/types/database'
import type { AdminProductImage, AdminProductRecord } from '@/features/admin/admin.types'

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

  const loadData = async () => {
    try {
      setError(null)
      const [nextProducts, nextCategories] = await Promise.all([
        listAdminProducts(),
        listAdminCategories(),
      ])

      setProducts(nextProducts)
      setCategories(nextCategories)
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

  const handleDeleteProduct = async (product: AdminProductRecord) => {
    const confirmed = window.confirm(`¿Eliminar el producto "${product.name}"?`)

    if (!confirmed) {
      return
    }

    try {
      setError(null)
      setSuccess(null)
      await deleteProduct(product.id)
      setSuccess('Producto eliminado correctamente.')
      await loadData()
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar el producto.',
      )
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
    } finally {
      setImageDeletingId(null)
    }
  }

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
        <div className="grid gap-4 xl:grid-cols-2">
          {products.map((product) => {
            const activeImages =
              product.product_images?.filter((image) => !image.is_deleted).length ?? 0

            return (
              <Card key={product.id} tone="admin" className="space-y-5 p-5">
                <div className="space-y-2">
                  <h2 className="text-3xl text-white">{product.name}</h2>
                  <p className="text-sm text-slate-300">
                    /{product.slug} · {product.categories?.[0]?.name ?? 'Sin categoría'}
                  </p>
                  <p className="text-sm leading-7 text-slate-300/80">
                    {product.short_description || product.description || 'Sin descripción'}
                  </p>
                </div>

                <div className="grid gap-3 text-sm text-slate-200 md:grid-cols-2">
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
                  <Button variant="ghost" size="sm" onClick={() => void handleDeleteProduct(product)}>
                    Eliminar
                  </Button>
                </div>
              </Card>
            )
          })}
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
    </PagePlaceholder>
  )
}
