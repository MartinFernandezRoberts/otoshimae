export type ProductStatus = 'draft' | 'published'

export type Product = {
  id: string
  name: string
  slug: string
  category: string
  description: string
  price: number
  status: ProductStatus
  accent: string
}
