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
