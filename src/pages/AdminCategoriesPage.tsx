import { useDeferredValue, useMemo, useEffect, useState } from 'react'

import { PagePlaceholder } from '@/components/PagePlaceholder'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { EmptyState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { Loader } from '@/components/ui/Loader'
import { Modal } from '@/components/ui/Modal'
import { StatusMessage } from '@/components/ui/StatusMessage'
import { listAdminCategories, createCategory, deleteCategory, updateCategory } from '@/features/admin/admin.api'
import { CategoryForm } from '@/features/admin/CategoryForm'
import type { AdminCategoryFormValues } from '@/features/admin/admin.types'
import {
  createCategoryDefaults,
  normalizeSlugFromName,
  sortRows,
} from '@/features/admin/admin.utils'
import type { SortDirection } from '@/features/admin/admin.utils'
import type { CategoryRow } from '@/types/database'

function matchesCategoryQuery(category: CategoryRow, query: string) {
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return true
  }

  return `${category.name} ${category.slug}`.toLowerCase().includes(normalized)
}

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

  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const [deleteTarget, setDeleteTarget] = useState<CategoryRow | null>(null)
  const [deleteSubmitting, setDeleteSubmitting] = useState(false)

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

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      setDeleteSubmitting(true)
      setError(null)
      setSuccess(null)
      await deleteCategory(deleteTarget.id)
      setSuccess('Categoría eliminada correctamente.')
      setDeleteTarget(null)
      await loadCategories()
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar la categoría.',
      )
    } finally {
      setDeleteSubmitting(false)
    }
  }

  const filteredCategories = useMemo(() => {
    const filtered = categories.filter((category) =>
      matchesCategoryQuery(category, deferredSearch),
    )

    return sortRows(filtered, (category) => category.name.toLowerCase(), sortDirection)
  }, [categories, deferredSearch, sortDirection])

  const hasActiveFilters = search.trim().length > 0

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
        <div className="space-y-5">
          <Card tone="admin" className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <Input
              label="Buscar"
              placeholder="Nombre o slug"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            {hasActiveFilters ? (
              <Button variant="ghost" size="sm" onClick={() => setSearch('')}>
                Limpiar búsqueda
              </Button>
            ) : null}
          </Card>

          <p className="text-sm text-[var(--foreground-soft)]">
            {filteredCategories.length} de {categories.length} categorías
          </p>

          {filteredCategories.length === 0 ? (
            <EmptyState
              title="No hay categorías para esa búsqueda"
              description="Prueba con otro nombre o slug."
              action={
                <Button variant="secondary" onClick={() => setSearch('')}>
                  Limpiar búsqueda
                </Button>
              }
            />
          ) : (
            <>
              <div className="ui-table-wrap hidden md:block">
                <table className="ui-table">
                  <thead>
                    <tr className="ui-table-head-row">
                      <th className="ui-table-head-cell">
                        <button
                          type="button"
                          className="ui-sort-button"
                          data-active
                          onClick={() =>
                            setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
                          }
                        >
                          Nombre
                          <span className="ui-sort-icon" aria-hidden="true">
                            {sortDirection === 'asc' ? '▲' : '▼'}
                          </span>
                        </button>
                      </th>
                      <th className="ui-table-head-cell">Slug</th>
                      <th className="ui-table-head-cell">Descripción</th>
                      <th className="ui-table-head-cell">Estado</th>
                      <th className="ui-table-head-cell">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr key={category.id} className="ui-table-row">
                        <td className="ui-table-cell">
                          <p className="text-base font-medium text-[var(--foreground)]">
                            {category.name}
                          </p>
                        </td>
                        <td className="ui-table-cell">/{category.slug}</td>
                        <td className="ui-table-cell max-w-xs truncate">
                          {category.description || 'Sin descripción'}
                        </td>
                        <td className="ui-table-cell">
                          <Badge variant={category.is_active ? 'success' : 'outline'}>
                            {category.is_active ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </td>
                        <td className="ui-table-cell">
                          <div className="flex flex-wrap gap-2">
                            <Button variant="secondary" size="sm" onClick={() => openEditModal(category)}>
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteTarget(category)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-4 md:hidden">
                {filteredCategories.map((category) => (
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(category)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
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

      <ConfirmDialog
        open={deleteTarget !== null}
        title={deleteTarget ? `¿Eliminar "${deleteTarget.name}"?` : 'Eliminar categoría'}
        description="Los productos asociados quedarán sin categoría."
        confirmLabel="Eliminar categoría"
        tone="destructive"
        loading={deleteSubmitting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setDeleteTarget(null)}
      />
    </PagePlaceholder>
  )
}
