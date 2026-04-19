import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import type { AdminProductFormValues } from '@/features/admin/admin.types'
import type { CategoryRow } from '@/types/database'

type ProductFormProps = {
  values: AdminProductFormValues
  errors: Partial<Record<keyof AdminProductFormValues, string>>
  categories: CategoryRow[]
  onChange: <Key extends keyof AdminProductFormValues>(
    key: Key,
    value: AdminProductFormValues[Key],
  ) => void
}

export function ProductForm({
  values,
  errors,
  categories,
  onChange,
}: ProductFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Nombre"
          value={values.name}
          onChange={(event) => onChange('name', event.target.value)}
          error={errors.name}
          placeholder="Kitsune Ember"
        />
        <Input
          label="Slug"
          value={values.slug}
          onChange={(event) => onChange('slug', event.target.value)}
          error={errors.slug}
          placeholder="kitsune-ember"
        />
      </div>

      <Textarea
        label="Descripcion"
        value={values.description}
        onChange={(event) => onChange('description', event.target.value)}
        error={errors.description}
        placeholder="Descripcion completa del producto."
      />

      <Textarea
        label="Descripcion corta"
        value={values.shortDescription}
        onChange={(event) => onChange('shortDescription', event.target.value)}
        error={errors.shortDescription}
        placeholder="Texto breve para cards o previews."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Input
          label="Precio"
          type="number"
          min={0}
          step="0.01"
          value={values.price}
          onChange={(event) => onChange('price', event.target.value)}
          error={errors.price}
          placeholder="64990"
        />
        <Input
          label="Precio comparativo"
          type="number"
          min={0}
          step="0.01"
          value={values.comparePrice}
          onChange={(event) => onChange('comparePrice', event.target.value)}
          error={errors.comparePrice}
          placeholder="74990"
        />
        <Input
          label="Stock"
          type="number"
          min={0}
          step="1"
          value={values.stock}
          onChange={(event) => onChange('stock', event.target.value)}
          error={errors.stock}
          placeholder="10"
        />
        <Input
          label="SKU"
          value={values.sku}
          onChange={(event) => onChange('sku', event.target.value)}
          error={errors.sku}
          placeholder="OTO-KIT-001"
        />
      </div>

      <Select
        label="Categoria"
        value={values.categoryId}
        onChange={(event) => onChange('categoryId', event.target.value)}
        error={errors.categoryId}
        options={[
          { value: '', label: 'Sin categoria' },
          ...categories.map((category) => ({
            value: category.id,
            label: category.name,
          })),
        ]}
      />

      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--background-soft)] px-4 py-3 text-sm text-[var(--foreground)]">
          <input
            type="checkbox"
            checked={values.isActive}
            onChange={(event) => onChange('isActive', event.target.checked)}
          />
          Producto activo
        </label>
        <label className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--background-soft)] px-4 py-3 text-sm text-[var(--foreground)]">
          <input
            type="checkbox"
            checked={values.isFeatured}
            onChange={(event) => onChange('isFeatured', event.target.checked)}
          />
          Producto destacado
        </label>
      </div>
    </div>
  )
}
