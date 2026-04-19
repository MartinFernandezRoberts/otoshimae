import { lazy } from 'react'

export const HomePage = lazy(async () => ({
  default: (await import('@/pages/HomePage')).HomePage,
}))

export const CatalogPage = lazy(async () => ({
  default: (await import('@/pages/CatalogPage')).CatalogPage,
}))

export const ProductDetailPage = lazy(async () => ({
  default: (await import('@/pages/ProductDetailPage')).ProductDetailPage,
}))

export const CartPage = lazy(async () => ({
  default: (await import('@/pages/CartPage')).CartPage,
}))

export const CheckoutPage = lazy(async () => ({
  default: (await import('@/pages/CheckoutPage')).CheckoutPage,
}))

export const CheckoutSuccessPage = lazy(async () => ({
  default: (await import('@/pages/CheckoutSuccessPage')).CheckoutSuccessPage,
}))

export const NotFoundPage = lazy(async () => ({
  default: (await import('@/pages/NotFoundPage')).NotFoundPage,
}))

export const AdminLoginPage = lazy(async () => ({
  default: (await import('@/pages/AdminLoginPage')).AdminLoginPage,
}))

export const AdminDashboardPage = lazy(async () => ({
  default: (await import('@/pages/AdminDashboardPage')).AdminDashboardPage,
}))

export const AdminProductsPage = lazy(async () => ({
  default: (await import('@/pages/AdminProductsPage')).AdminProductsPage,
}))

export const AdminCategoriesPage = lazy(async () => ({
  default: (await import('@/pages/AdminCategoriesPage')).AdminCategoriesPage,
}))

export const AdminOrdersPage = lazy(async () => ({
  default: (await import('@/pages/AdminOrdersPage')).AdminOrdersPage,
}))

export const AdminSettingsPage = lazy(async () => ({
  default: (await import('@/pages/AdminSettingsPage')).AdminSettingsPage,
}))
