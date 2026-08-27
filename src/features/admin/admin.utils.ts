import { slugify } from '@/lib/slug'
import type {
  AdminCategoryFormValues,
  AdminProductFormValues,
  StockAdjustmentValues,
  StoreSettingsFormValues,
} from '@/features/admin/admin.types'

export function createCategoryDefaults(): AdminCategoryFormValues {
  return {
    name: '',
    slug: '',
    description: '',
    isActive: true,
  }
}

export function createProductDefaults(): AdminProductFormValues {
  return {
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: '',
    comparePrice: '',
    stock: '0',
    sku: '',
    categoryId: '',
    isActive: true,
    isFeatured: false,
  }
}

export function createStockDefaults(): StockAdjustmentValues {
  return {
    quantity: '0',
    notes: '',
  }
}

export function createSettingsDefaults(): StoreSettingsFormValues {
  return {
    storeName: '',
    storeEmail: '',
    storeCurrency: 'CLP',
    whatsapp: '',
    shippingNote: '',
    pickupAddress: '',
  }
}

export function normalizeSlugFromName(name: string) {
  return slugify(name)
}

export type SortDirection = 'asc' | 'desc'

export function sortRows<Row, Value extends string | number>(
  rows: Row[],
  accessor: (row: Row) => Value,
  direction: SortDirection,
) {
  const sorted = [...rows].sort((left, right) => {
    const leftValue = accessor(left)
    const rightValue = accessor(right)

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      return leftValue - rightValue
    }

    return String(leftValue).localeCompare(String(rightValue))
  })

  return direction === 'asc' ? sorted : sorted.reverse()
}
