import type { PublicProductSummary } from '@/types/database'

export function getPrimaryProductImage(product: PublicProductSummary) {
  return product.images?.[0] ?? null
}

export function matchesProductSearch(
  product: PublicProductSummary,
  searchTerm: string,
) {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  if (!normalizedSearch) {
    return true
  }

  return [product.name, product.short_description, product.description, product.category?.name]
    .filter(Boolean)
    .some((value) => value?.toLowerCase().includes(normalizedSearch))
}
