import { PagePlaceholder } from '@/components/PagePlaceholder'
import { ProductGridPlaceholder } from '@/features/catalog/ProductGridPlaceholder'

export function CatalogPage() {
  return (
    <PagePlaceholder
      eyebrow="Colección"
      title="Catálogo"
      description="Base del catálogo público para publicar máscaras por colección, estilo y disponibilidad con una estructura fácil de escalar."
    >
      <ProductGridPlaceholder />
    </PagePlaceholder>
  )
}
