import { Suspense } from 'react'
import type { ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import {
  AdminCategoriesPage,
  AdminDashboardPage,
  AdminLoginPage,
  AdminOrdersPage,
  AdminProductsPage,
  AdminSettingsPage,
  CartPage,
  CatalogPage,
  CheckoutPage,
  CheckoutSuccessPage,
  HomePage,
  NotFoundPage,
  ProductDetailPage,
} from '@/app/lazy-pages'
import { RouteLoader } from '@/components/RouteLoader'
import { RedirectIfAuthenticated } from '@/features/auth/RedirectIfAuthenticated'
import { RequireAdmin } from '@/features/auth/RequireAdmin'
import { AdminLayout } from '@/layouts/AdminLayout'
import { PublicLayout } from '@/layouts/PublicLayout'

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<RouteLoader />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'catalogo', element: withSuspense(<CatalogPage />) },
      { path: 'producto/:slug', element: withSuspense(<ProductDetailPage />) },
      { path: 'carrito', element: withSuspense(<CartPage />) },
      { path: 'checkout', element: withSuspense(<CheckoutPage />) },
      {
        path: 'checkout/confirmacion',
        element: withSuspense(<CheckoutSuccessPage />),
      },
      { path: '*', element: withSuspense(<NotFoundPage />) },
    ],
  },
  {
    element: <RedirectIfAuthenticated />,
    children: [
      {
        path: '/admin/login',
        element: withSuspense(<AdminLoginPage />),
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
          { index: true, element: withSuspense(<AdminDashboardPage />) },
          { path: 'productos', element: withSuspense(<AdminProductsPage />) },
          { path: 'categorias', element: withSuspense(<AdminCategoriesPage />) },
          { path: 'pedidos', element: withSuspense(<AdminOrdersPage />) },
          { path: 'configuracion', element: withSuspense(<AdminSettingsPage />) },
        ],
      },
    ],
  },
])
