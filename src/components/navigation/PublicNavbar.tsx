import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { env } from '@/lib/env'
import { useCart } from '@/features/cart/useCart'
import { publicNavigation, routes } from '@/lib/routes'

export function PublicNavbar() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[rgba(8,9,11,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-4 md:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--surface)] text-sm font-semibold text-[var(--accent)]">
            O
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              Mascaras contemporaneas
            </p>
            <p className="mt-1 text-lg font-medium tracking-[0.08em] text-[var(--foreground)]">
              {env.appName}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:items-end">
          <nav className="flex flex-wrap gap-2">
            {publicNavigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition',
                    isActive
                      ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                      : 'text-[var(--foreground-soft)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--foreground)]',
                  )
                }
              >
                <span>{item.label}</span>
                {item.to === routes.cart && itemCount > 0 ? (
                  <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[var(--foreground)] px-2 py-0.5 text-[10px] font-semibold text-[var(--background)]">
                    {itemCount}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </nav>

          <Button to={routes.adminLogin} variant="secondary" size="sm">
            Acceso admin
          </Button>
        </div>
      </div>
    </header>
  )
}
