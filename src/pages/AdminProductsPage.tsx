import { PagePlaceholder } from '@/components/PagePlaceholder'
import { ProductGridPlaceholder } from '@/features/catalog/ProductGridPlaceholder'

export function AdminProductsPage() {
  return (
    <PagePlaceholder
      eyebrow="Admin"
      title="Productos"
      description="Vista inicial para administrar fichas de producto, precios, slugs y publicación del catálogo."
    >
      <ProductGridPlaceholder />
    </PagePlaceholder>
  )
}
