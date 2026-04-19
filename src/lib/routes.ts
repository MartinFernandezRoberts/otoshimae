import type { NavItem } from '@/types/navigation'

export const routes = {
  home: '/',
  catalog: '/catalogo',
  cart: '/carrito',
  checkout: '/checkout',
  checkoutSuccess: '/checkout/confirmacion',
  adminLogin: '/admin/login',
  admin: '/admin',
  adminProducts: '/admin/productos',
  adminCategories: '/admin/categorias',
  adminOrders: '/admin/pedidos',
  adminSettings: '/admin/configuracion',
} as const

export function buildProductPath(slug: string) {
  return `/producto/${slug}`
}

export const publicNavigation: NavItem[] = [
  { label: 'Inicio', to: routes.home },
  { label: 'Catalogo', to: routes.catalog },
  { label: 'Carrito', to: routes.cart },
  { label: 'Checkout', to: routes.checkout },
]
