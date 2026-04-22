import { useEffect, useState } from 'react'

import { PagePlaceholder } from '@/components/PagePlaceholder'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { Loader } from '@/components/ui/Loader'
import { Modal } from '@/components/ui/Modal'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { listAdminCategories, createCategory, deleteCategory, updateCategory } from '@/features/admin/admin.api'
import { CategoryForm } from '@/features/admin/CategoryForm'
import type { AdminCategoryFormValues } from '@/features/admin/admin.types'
import { createCategoryDefaults, normalizeSlugFromName } from '@/features/admin/admin.utils'
import type { CategoryRow } from '@/types/database'

function toFormValues(category?: CategoryRow): AdminCategoryFormValues {
  if (!category) {
    return createCategoryDefaults()
  }

  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? '',
    isActive: category.is_active,
  }
}

function validate(values: AdminCategoryFormValues) {
  const errors: Partial<Record<keyof AdminCategoryFormValues, string>> = {}

  if (values.name.trim().length < 2) {
    errors.name = 'Ingresa un nombre más claro.'
  }

  if (values.slug.trim().length < 2) {
    errors.slug = 'El slug debe tener al menos 2 caracteres.'
  }

  return errors
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryRow | null>(null)
  const [formValues, setFormValues] = useState<AdminCategoryFormValues>(
    createCategoryDefaults(),
  )
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof AdminCategoryFormValues, string>>
  >({})

  const loadCategories = async () => {
    try {
      setError(null)
      const nextCategories = await listAdminCategories()
      setCategories(nextCategories)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'No se pudieron cargar las categorías.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadCategories()
    })
  }, [])

  const handleChange = <Key extends keyof AdminCategoryFormValues>(
    key: Key,
    value: AdminCategoryFormValues[Key],
  ) => {
    setFormValues((current) => {
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
    setEditingCategory(null)
    setFormValues(createCategoryDefaults())
    setFormErrors({})
    setModalOpen(true)
  }

  const openEditModal = (category: CategoryRow) => {
    setEditingCategory(category)
    setFormValues(toFormValues(category))
    setFormErrors({})
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const nextErrors = validate(formValues)
    setFormErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      setSuccess(null)

      if (editingCategory) {
        await updateCategory(editingCategory.id, formValues)
        setSuccess('Categoría actualizada correctamente.')
      } else {
        await createCategory(formValues)
        setSuccess('Categoría creada correctamente.')
      }

      setModalOpen(false)
      await loadCategories()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No se pudo guardar la categoría.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (category: CategoryRow) => {
    const confirmed = window.confirm(
      `¿Eliminar la categoría "${category.name}"? Los productos quedarán sin categoría.`,
    )

    if (!confirmed) {
      return
    }

    try {
      setError(null)
      setSuccess(null)
      await deleteCategory(category.id)
      setSuccess('Categoría eliminada correctamente.')
      await loadCategories()
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar la categoría.',
      )
    }
  }

  return (
    <PagePlaceholder
      eyebrow="Admin"
      title="Categorías"
      description="CRUD básico para estructurar el catálogo y mantener una navegación ordenada."
      actions={<Button onClick={openCreateModal}>Nueva categoría</Button>}
    >
      {error ? <StatusMessage tone="error" message={error} /> : null}
      {success ? <StatusMessage tone="success" message={success} /> : null}

      {loading ? (
        <Card tone="admin" className="p-8">
          <Loader label="Cargando categorías..." />
        </Card>
      ) : categories.length === 0 ? (
        <EmptyState
          title="Todavía no hay categorías"
          description="Crea la primera categoría para empezar a ordenar el catálogo."
          action={<Button onClick={openCreateModal}>Crear categoría</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <Card key={category.id} as="article" tone="admin" className="space-y-4 p-5">
              <div className="space-y-2">
                <h2 className="text-3xl text-[var(--foreground)]">{category.name}</h2>
                <p className="text-sm text-[var(--foreground-soft)]">/{category.slug}</p>
                <p className="text-sm leading-7 text-[var(--muted)]">
                  {category.description || 'Sin descripción'}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" onClick={() => openEditModal(category)}>
                  Editar
                </Button>
                <Button variant="ghost" size="sm" onClick={() => void handleDelete(category)}>
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Editar categoría' : 'Nueva categoría'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => void handleSubmit()} loading={submitting}>
              Guardar categoría
            </Button>
          </div>
        }
      >
        <CategoryForm
          values={formValues}
          errors={formErrors}
          onChange={handleChange}
        />
      </Modal>
    </PagePlaceholder>
  )
}
