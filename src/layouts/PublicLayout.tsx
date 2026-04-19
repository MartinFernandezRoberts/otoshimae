import { NavLink, Outlet } from 'react-router-dom'

import { env } from '@/lib/env'
import { cn } from '@/lib/cn'
import { publicNavigation } from '@/lib/routes'

export function PublicLayout() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-[rgba(255,248,240,0.78)] backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-4 md:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--accent-deep)]">
              Tienda estudio
            </p>
            <div className="mt-2 flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--foreground)] text-sm font-semibold text-white">
                O
              </span>
              <div>
                <p className="text-lg font-semibold tracking-[-0.04em] text-[var(--foreground)]">
                  {env.appName}
                </p>
                <p className="text-sm text-[var(--muted)]">
                  Máscaras artesanales y coleccionables
                </p>
              </div>
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
                      'rounded-full border px-4 py-2 text-sm font-medium transition',
                      isActive
                        ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                        : 'border-[var(--line)] bg-[var(--surface)] text-[var(--foreground)] hover:border-[var(--accent)]',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <NavLink
              to="/admin/login"
              className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Acceso admin
            </NavLink>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <Outlet />
      </main>

      <footer className="border-t border-[var(--line)] bg-[rgba(255,252,247,0.74)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-[var(--muted)] md:px-8 lg:flex-row lg:items-center lg:justify-between">
          <p>Base inicial del storefront de Otoshimae preparada para crecer por módulos.</p>
          <p>React Router + Tailwind + Vercel-ready</p>
        </div>
      </footer>
    </div>
  )
}
