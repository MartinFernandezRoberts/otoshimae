import { NavLink, Outlet } from 'react-router-dom'

import { adminNavigation } from '@/features/admin/adminNavigation'
import { cn } from '@/lib/cn'

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[var(--admin)] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 px-6 py-8 lg:border-b-0 lg:border-r">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-100/60">
              Otoshimae
            </p>
            <h1 className="text-3xl font-semibold tracking-[-0.04em]">
              Admin
            </h1>
            <p className="max-w-xs text-sm leading-6 text-slate-300">
              Estructura inicial para gestionar catálogo, pedidos y ajustes del
              e-commerce.
            </p>
          </div>

          <nav className="mt-8 flex flex-col gap-2">
            {adminNavigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  cn(
                    'rounded-2xl px-4 py-3 text-sm font-medium transition',
                    isActive
                      ? 'bg-white text-[var(--admin)]'
                      : 'text-slate-200 hover:bg-white/10',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="px-6 py-8 md:px-8 lg:px-12">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
