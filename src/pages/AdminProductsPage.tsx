import { ProductCard } from '@/components/ProductCard'
import { PagePlaceholder } from '@/components/PagePlaceholder'
import { publishedProducts } from '@/features/catalog/mockProducts'

export function AdminProductsPage() {
  return (
    <PagePlaceholder
      eyebrow="Admin"
      title="Productos"
      description="Vista inicial para administrar fichas de producto, precios, slugs y publicación del catálogo."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {publishedProducts.slice(0, 3).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </PagePlaceholder>
  )
}
