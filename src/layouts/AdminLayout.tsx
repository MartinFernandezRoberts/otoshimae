import { Outlet } from 'react-router-dom'

import { AdminSidebar } from '@/components/navigation/AdminSidebar'

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#080706_0%,#0d0b0a_100%)] text-[var(--foreground)]">
      <div className="mx-auto grid min-h-screen max-w-[92rem] lg:grid-cols-[300px_minmax(0,1fr)]">
        <AdminSidebar />
        <main className="min-w-0 px-6 py-8 md:px-8 lg:px-12">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
