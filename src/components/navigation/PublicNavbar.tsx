import { NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { env } from '@/lib/env'
import { useCart } from '@/features/cart/useCart'
import { publicNavigation, routes } from '@/lib/routes'

export function PublicNavbar() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 md:px-6">
      <div className="mx-auto max-w-[92rem]">
        <div className="rounded-[var(--radius-xl)] border border-[var(--line)] bg-[rgba(6,6,6,0.8)] px-5 py-4 shadow-[var(--shadow-soft)] backdrop-blur-2xl">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(209,178,138,0.22)] bg-[linear-gradient(135deg,rgba(209,178,138,0.16),rgba(255,255,255,0.02))] text-lg font-semibold text-[var(--accent-strong)] shadow-[0_18px_40px_rgba(209,178,138,0.12)]">
                O
              </span>
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.38em] text-[var(--muted)]">
                  Japanese artisan objects
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-2xl tracking-[0.22em] text-[var(--foreground)]">
                    {env.appName}
                  </p>
                  <span className="hidden rounded-full border border-[var(--line)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--foreground-soft)] md:inline-flex">
                    Pintado a mano
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 xl:items-end">
              <nav className="flex flex-wrap gap-2">
                {publicNavigation.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition',
                        isActive
                          ? 'border-[rgba(209,178,138,0.24)] bg-[rgba(209,178,138,0.1)] text-[var(--accent-strong)]'
                          : 'border-transparent text-[var(--foreground-soft)] hover:border-[var(--line)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--foreground)]',
                      )
                    }
                  >
                    <span>{item.label}</span>
                    {item.to === routes.cart && itemCount > 0 ? (
                      <span className="inline-flex min-w-6 items-center justify-center rounded-full border border-[rgba(209,178,138,0.24)] bg-[rgba(209,178,138,0.12)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent-strong)]">
                        {itemCount}
                      </span>
                    ) : null}
                  </NavLink>
                ))}
              </nav>

              <div className="flex flex-wrap items-center gap-3">
                <p className="hidden text-right text-[11px] uppercase tracking-[0.32em] text-[var(--muted)] lg:block">
                  Series cortas / oscuridad elegante / detalle manual
                </p>
                <Button to={routes.adminLogin} variant="ghost" size="sm">
                  Acceso admin
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
