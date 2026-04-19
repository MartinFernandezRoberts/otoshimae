export type ProductStatus = 'draft' | 'published'

export type ProductAvailability = 'available' | 'limited' | 'sold-out'

export type ProductCategory = {
  id: string
  name: string
  description: string
  note: string
  accent: string
  productCount: number
}

export type Product = {
  id: string
  name: string
  slug: string
  category: string
  categoryId: string
  description: string
  price: number
  status: ProductStatus
  availability: ProductAvailability
  accent: string
  material: string
  edition: string
  featured: boolean
}
