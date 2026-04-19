import { PagePlaceholder } from '@/components/PagePlaceholder'
import { EmptyState } from '@/components/ui/EmptyState'

export function AdminCategoriesPage() {
  return (
    <PagePlaceholder
      eyebrow="Admin"
      title="Categorías"
      description="Espacio base para ordenar máscaras por línea, estilo o colección y mantener una navegación clara en catálogo."
    >
      <EmptyState
        title="Aún no hay categorías administrables"
        description="La capa visual ya está lista. Aquí luego podemos sumar alta, edición, estado e imagen de colección para cada familia de producto."
      />
    </PagePlaceholder>
  )
}
