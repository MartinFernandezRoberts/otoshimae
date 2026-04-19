import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'

import type {
  AddToCartInput,
  CartContextValue,
  CartItem,
} from '@/features/cart/cart-context'
import { CartContext } from '@/features/cart/cart-context'
import type { PublicProductSummary } from '@/types/database'

const CART_STORAGE_KEY = 'otoshimae-cart'

function getProductImage(product: PublicProductSummary) {
  const primaryImage = product.images?.[0] ?? null

  return {
    imageUrl: primaryImage?.url ?? null,
    imageAlt: primaryImage?.alt ?? product.name,
  }
}

function toCartItem(product: PublicProductSummary, quantity: number): CartItem {
  const { imageAlt, imageUrl } = getProductImage(product)

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    quantity,
    stock: product.stock,
    imageUrl,
    imageAlt,
  }
}

function sanitizeStoredItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.flatMap((item) => {
    const record = item as Record<string, unknown>

    if (
      typeof record.productId !== 'string' ||
      typeof record.slug !== 'string' ||
      typeof record.name !== 'string' ||
      typeof record.price !== 'number' ||
      typeof record.quantity !== 'number' ||
      typeof record.stock !== 'number'
    ) {
      return []
    }

    return [
      {
        productId: record.productId,
        slug: record.slug,
        name: record.name,
        price: record.price,
        quantity: Math.max(1, Math.trunc(record.quantity)),
        stock: Math.max(0, Math.trunc(record.stock)),
        imageUrl: typeof record.imageUrl === 'string' ? record.imageUrl : null,
        imageAlt: typeof record.imageAlt === 'string' ? record.imageAlt : null,
      } satisfies CartItem,
    ]
  })
}

function readInitialCart() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY)
    return stored ? sanitizeStoredItems(JSON.parse(stored)) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>(readInitialCart)

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback(({ product, quantity = 1 }: AddToCartInput) => {
    const safeQuantity = Math.max(1, Math.trunc(quantity))

    if (product.stock <= 0) {
      return {
        success: false,
        message: 'Este producto esta agotado en este momento.',
      }
    }

    let didSucceed = true
    let responseMessage: string | undefined

    setItems((current) => {
      const existingItem = current.find((item) => item.productId === product.id)
      const currentQuantity = existingItem?.quantity ?? 0
      const nextQuantity = Math.min(product.stock, currentQuantity + safeQuantity)

      if (nextQuantity <= currentQuantity) {
        didSucceed = false
        responseMessage = 'Ya tienes el maximo disponible de esta pieza.'
        return current
      }

      const nextItem = toCartItem(product, nextQuantity)

      if (!existingItem) {
        return [...current, nextItem]
      }

      return current.map((item) =>
        item.productId === product.id ? nextItem : item,
      )
    })

    return {
      success: didSucceed,
      message: responseMessage,
    }
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const safeQuantity = Math.max(0, Math.trunc(quantity))

    setItems((current) =>
      current.flatMap((item) => {
        if (item.productId !== productId) {
          return [item]
        }

        if (safeQuantity <= 0) {
          return []
        }

        return [
          {
            ...item,
            quantity: Math.min(item.stock, safeQuantity),
          },
        ]
      }),
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const reconcileWithProducts = useCallback((products: PublicProductSummary[]) => {
    const productsById = new Map(products.map((product) => [product.id, product]))

    setItems((current) =>
      current.flatMap((item) => {
        const product = productsById.get(item.productId)

        if (!product || product.stock <= 0) {
          return []
        }

        return [toCartItem(product, Math.min(item.quantity, product.stock))].filter(
          (nextItem) => nextItem.quantity > 0,
        )
      }),
    )
  }, [])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0)
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    )

    return {
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      reconcileWithProducts,
    }
  }, [addItem, clearCart, items, reconcileWithProducts, removeItem, updateQuantity])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
