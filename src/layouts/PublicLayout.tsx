import { Outlet } from 'react-router-dom'

import { PublicFooter } from '@/components/navigation/PublicFooter'
import { PublicNavbar } from '@/components/navigation/PublicNavbar'

export function PublicLayout() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <main className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}
