import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import type { AdminCategoryFormValues } from '@/features/admin/admin.types'

type CategoryFormProps = {
  values: AdminCategoryFormValues
  errors: Partial<Record<keyof AdminCategoryFormValues, string>>
  onChange: <Key extends keyof AdminCategoryFormValues>(
    key: Key,
    value: AdminCategoryFormValues[Key],
  ) => void
}

export function CategoryForm({ values, errors, onChange }: CategoryFormProps) {
  return (
    <div className="space-y-4">
      <Input
        label="Nombre"
        value={values.name}
        onChange={(event) => onChange('name', event.target.value)}
        error={errors.name}
        placeholder="Coleccion Ritual"
      />
      <Input
        label="Slug"
        value={values.slug}
        onChange={(event) => onChange('slug', event.target.value)}
        error={errors.slug}
        placeholder="coleccion-ritual"
      />
      <Textarea
        label="Descripcion"
        value={values.description}
        onChange={(event) => onChange('description', event.target.value)}
        error={errors.description}
        placeholder="Describe el tono o proposito de la categoria."
      />
      <label className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--background-soft)] px-4 py-3 text-sm text-[var(--foreground)]">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(event) => onChange('isActive', event.target.checked)}
        />
        Categoria activa
      </label>
    </div>
  )
}
