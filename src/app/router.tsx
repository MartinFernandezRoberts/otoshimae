import { createBrowserRouter } from 'react-router-dom'

import { RedirectIfAuthenticated } from '@/features/auth/RedirectIfAuthenticated'
import { RequireAdmin } from '@/features/auth/RequireAdmin'
import { AdminLayout } from '@/layouts/AdminLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AdminCategoriesPage } from '@/pages/AdminCategoriesPage'
import { AdminDashboardPage } from '@/pages/AdminDashboardPage'
import { AdminLoginPage } from '@/pages/AdminLoginPage'
import { AdminOrdersPage } from '@/pages/AdminOrdersPage'
import { AdminProductsPage } from '@/pages/AdminProductsPage'
import { AdminSettingsPage } from '@/pages/AdminSettingsPage'
import { CartPage } from '@/pages/CartPage'
import { CatalogPage } from '@/pages/CatalogPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { CheckoutSuccessPage } from '@/pages/CheckoutSuccessPage'
import { HomePage } from '@/pages/HomePage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalogo', element: <CatalogPage /> },
      { path: 'producto/:slug', element: <ProductDetailPage /> },
      { path: 'carrito', element: <CartPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'checkout/confirmacion', element: <CheckoutSuccessPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    element: <RedirectIfAuthenticated />,
    children: [
      {
        path: '/admin/login',
        element: <AdminLoginPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <RequireAdmin />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'productos', element: <AdminProductsPage /> },
          { path: 'categorias', element: <AdminCategoriesPage /> },
          { path: 'pedidos', element: <AdminOrdersPage /> },
          { path: 'configuracion', element: <AdminSettingsPage /> },
        ],
      },
    ],
  },
])
