import { Outlet } from 'react-router-dom'

import { AdminSidebar } from '@/components/navigation/AdminSidebar'

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[var(--admin)] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[280px_1fr]">
        <AdminSidebar />
        <main className="px-6 py-8 md:px-8 lg:px-12">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
