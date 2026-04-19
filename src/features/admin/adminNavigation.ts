import type { NavItem } from '@/types/navigation'

export const adminNavigation: NavItem[] = [
  { label: 'Resumen', to: '/admin' },
  { label: 'Productos', to: '/admin/productos' },
  { label: 'Categorías', to: '/admin/categorias' },
  { label: 'Pedidos', to: '/admin/pedidos' },
  { label: 'Configuración', to: '/admin/configuracion' },
]
