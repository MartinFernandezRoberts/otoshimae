import type { Product } from '@/types/catalog'

export const mockProducts: Product[] = [
  {
    id: 'kitsune-ember',
    name: 'Kitsune Ember',
    slug: 'kitsune-ember',
    category: 'Colección fuego',
    description: 'Máscara inspirada en el zorro espiritual con terminaciones cobrizo mate.',
    price: 64990,
    status: 'published',
    accent: '#b04e1f',
  },
  {
    id: 'oni-nocturna',
    name: 'Oni Nocturna',
    slug: 'oni-nocturna',
    category: 'Edición limitada',
    description: 'Pieza de presencia intensa con base oscura y detalles rojos satinados.',
    price: 78990,
    status: 'draft',
    accent: '#5a1024',
  },
  {
    id: 'koi-eclipse',
    name: 'Koi Eclipse',
    slug: 'koi-eclipse',
    category: 'Colección agua',
    description: 'Composición fluida para vitrinas, sesiones y coleccionistas.',
    price: 49990,
    status: 'published',
    accent: '#174b63',
  },
]
