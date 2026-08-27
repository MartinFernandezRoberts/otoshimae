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
        <div className="rounded-[var(--radius-xl)] border border-[rgba(244,237,226,0.14)] bg-[rgba(5,5,5,0.88)] px-4 py-4 shadow-[0_24px_70px_rgba(0,0,0,0.48)] backdrop-blur-2xl md:px-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(209,178,138,0.22)] bg-[linear-gradient(135deg,rgba(209,178,138,0.16),rgba(255,255,255,0.02))] text-lg font-semibold text-[var(--accent-strong)] shadow-[0_18px_40px_rgba(209,178,138,0.12)]">
                O
              </span>
              <div className="space-y-1">
                <p className="text-[11px] uppercase tracking-[0.38em] text-[var(--muted)]">
                  Objetos decorativos de autor
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-2xl tracking-[0.22em] text-[var(--foreground)]">
                    {env.appName}
                  </p>
                  <span className="hidden rounded-full border border-[var(--line)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--foreground-soft)] md:inline-flex">
                    Series cortas
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
                        'inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition',
                        isActive
                          ? 'border-[var(--accent-glow)] bg-[var(--accent-soft)] text-[#ffe9cd]'
                          : 'border-transparent text-[var(--foreground-soft)] hover:border-[rgba(244,237,226,0.14)] hover:bg-[rgba(255,255,255,0.045)] hover:text-[var(--foreground)]',
                      )
                    }
                  >
                    <span>{item.label}</span>
                    {item.to === routes.cart && itemCount > 0 ? (
                      <span className="inline-flex min-w-6 items-center justify-center rounded-full border border-[rgba(213,176,139,0.24)] bg-[var(--accent-surface)] px-2 py-0.5 text-[10px] font-semibold text-[var(--accent-strong)]">
                        {itemCount}
                      </span>
                    ) : null}
                  </NavLink>
                ))}
              </nav>

              <div className="flex flex-wrap items-center gap-3">
                <p className="hidden text-right text-[11px] uppercase tracking-[0.32em] text-[var(--muted)] lg:block">
                  oni decorativo / pintura manual / presencia de exhibicion
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
