import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/formatCurrency'
import { buildProductPath } from '@/lib/routes'
import type { Product } from '@/types/catalog'

type ProductCardProps = {
  product: Product
}

const availabilityConfig = {
  available: { label: 'Disponible', variant: 'success' },
  limited: { label: 'Serie limitada', variant: 'accent' },
  'sold-out': { label: 'Agotada', variant: 'danger' },
} as const

export function ProductCard({ product }: ProductCardProps) {
  const availability = availabilityConfig[product.availability]

  return (
    <Card as="article" className="group overflow-hidden p-0">
      <div
        className="relative h-72 border-b border-[var(--line)]"
        style={{
          background: `radial-gradient(circle at top, ${product.accent} 0%, rgba(255,255,255,0) 42%), linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(0,0,0,0.28) 100%), linear-gradient(135deg, #111317 0%, #050608 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.08),transparent_22%)]" />
        <div className="absolute left-6 top-6 flex flex-wrap gap-2">
          <Badge variant={availability.variant}>{availability.label}</Badge>
          <Badge>{product.category}</Badge>
        </div>
        <div className="absolute inset-x-6 bottom-6 rounded-[var(--radius-md)] border border-white/10 bg-[rgba(7,8,10,0.5)] p-4 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
            {product.edition}
          </p>
          <p className="mt-2 text-sm text-[var(--foreground-soft)]">{product.material}</p>
        </div>
      </div>

      <div className="space-y-4 p-6">
        <div className="space-y-2">
          <h3 className="text-3xl text-[var(--foreground)]">{product.name}</h3>
          <p className="text-sm leading-7 text-[var(--foreground-soft)]">
            {product.description}
          </p>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
              Precio referencial
            </p>
            <p className="mt-2 text-2xl text-[var(--accent)]">
              {formatCurrency(product.price)}
            </p>
          </div>
          <Button to={buildProductPath(product.slug)} variant="secondary" size="sm">
            Ver pieza
          </Button>
        </div>
      </div>
    </Card>
  )
}
