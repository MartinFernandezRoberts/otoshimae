import { NavLink } from 'react-router-dom'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { adminNavigation } from '@/features/admin/adminNavigation'
import { useAuth } from '@/features/auth/useAuth'

export function AdminSidebar() {
  const { adminUser, signOut } = useAuth()

  return (
    <aside className="border-b border-white/10 px-6 py-8 lg:border-b-0 lg:border-r">
      <div className="space-y-4">
        <Badge variant="outline" className="text-cyan-50/80">
          Panel Otoshimae
        </Badge>
        <div className="space-y-2">
          <h1 className="text-4xl text-white">Admin</h1>
          <p className="max-w-xs text-sm leading-7 text-slate-300">
            Acceso protegido con Supabase Auth y validación sobre la tabla admin_users.
          </p>
          {adminUser?.email ? (
            <p className="text-sm text-slate-400">{adminUser.email}</p>
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
                'rounded-[var(--radius-sm)] px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'bg-white text-[var(--admin)]'
                  : 'text-slate-200 hover:bg-white/8',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-[var(--radius-lg)] border border-white/10 bg-white/5 p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
          Sesión actual
        </p>
        <p className="mt-3 text-2xl text-white">{adminUser?.role ?? 'admin'}</p>
        <p className="mt-2 text-sm leading-7 text-slate-300">
          La autorización depende de Supabase Auth más la tabla pública de administradores.
        </p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-4 w-full"
          onClick={() => {
            void signOut()
          }}
        >
          Cerrar sesión
        </Button>
      </div>
    </aside>
  )
}
