import { mockProducts } from '@/features/catalog/mockProducts'
import { formatCurrency } from '@/lib/formatCurrency'
import { buildProductPath } from '@/lib/routes'

type ProductGridPlaceholderProps = {
  limit?: number
}

export function ProductGridPlaceholder({
  limit = mockProducts.length,
}: ProductGridPlaceholderProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {mockProducts.slice(0, limit).map((product) => (
        <article
          key={product.id}
          className="group overflow-hidden rounded-[30px] border border-[var(--line)] bg-[var(--surface-strong)] shadow-[0_24px_80px_rgba(65,39,22,0.09)] transition hover:-translate-y-1"
        >
          <div
            className="h-48 border-b border-[var(--line)]"
            style={{
              background: `linear-gradient(135deg, ${product.accent} 0%, #24160f 100%)`,
            }}
          />
          <div className="space-y-4 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-[var(--muted)]">
                  {product.category}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                  {product.name}
                </h3>
              </div>
              <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-deep)]">
                {product.status}
              </span>
            </div>
            <p className="text-sm leading-6 text-[var(--muted)]">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <strong className="text-lg text-[var(--accent-deep)]">
                {formatCurrency(product.price)}
              </strong>
              <span className="text-sm font-medium text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
                {buildProductPath(product.slug)}
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
