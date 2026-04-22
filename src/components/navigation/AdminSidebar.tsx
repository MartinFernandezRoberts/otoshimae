import { NavLink } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { adminNavigation } from '@/features/admin/adminNavigation'
import { useAuth } from '@/features/auth/useAuth'

export function AdminSidebar() {
  const { adminUser, signOut } = useAuth()

  return (
    <aside className="border-b border-[var(--border)] bg-[rgba(7,7,7,0.72)] px-6 py-8 backdrop-blur-xl lg:border-b-0 lg:border-r">
      <div className="space-y-4">
        <Badge variant="accent">Panel Otoshimae</Badge>
        <div className="space-y-2">
          <h1 className="text-4xl text-[var(--foreground)]">Admin</h1>
          <p className="max-w-xs text-sm leading-8 text-[var(--foreground-soft)]">
            Acceso protegido con Supabase Auth y validacion sobre la tabla
            admin_users.
          </p>
          {adminUser?.email ? (
            <p className="text-sm text-[var(--muted)]">{adminUser.email}</p>
          ) : null}
        </div>
      </div>

      <nav className="mt-8 flex flex-col gap-2">
        {adminNavigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) =>
              cn(
                'rounded-[var(--radius-sm)] border px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'border-[rgba(184,138,95,0.24)] bg-[rgba(184,138,95,0.12)] text-[var(--accent-strong)]'
                  : 'border-transparent text-[var(--foreground-soft)] hover:border-[var(--border)] hover:bg-[rgba(255,255,255,0.03)] hover:text-[var(--foreground)]',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="ui-surface-inset mt-8 rounded-[var(--radius-lg)] p-5">
        <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--muted)]">
          Sesion actual
        </p>
        <p className="mt-3 text-2xl text-[var(--foreground)]">
          {adminUser?.role ?? 'admin'}
        </p>
        <p className="mt-2 text-sm leading-7 text-[var(--foreground-soft)]">
          La autorizacion depende de Supabase Auth mas la tabla publica de
          administradores.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-4 w-full"
          onClick={() => {
            void signOut()
          }}
        >
          Cerrar sesion
        </Button>
      </div>
    </aside>
  )
}
