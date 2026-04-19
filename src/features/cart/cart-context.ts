import { createContext } from 'react'

import type { PublicProductSummary } from '@/types/database'

export type CartItem = {
  productId: string
  slug: string
  name: string
  price: number
  quantity: number
  stock: number
  imageUrl: string | null
  imageAlt: string | null
}

export type AddToCartInput = {
  product: PublicProductSummary
  quantity?: number
}

export type CartContextValue = {
  items: CartItem[]
  itemCount: number
  subtotal: number
  addItem: (input: AddToCartInput) => { success: boolean; message?: string }
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  reconcileWithProducts: (products: PublicProductSummary[]) => void
}

export const CartContext = createContext<CartContextValue | null>(null)
