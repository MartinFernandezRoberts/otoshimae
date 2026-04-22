import { Outlet } from 'react-router-dom'

import { PublicFooter } from '@/components/navigation/PublicFooter'
import { PublicNavbar } from '@/components/navigation/PublicNavbar'

export function PublicLayout() {
  return (
    <div className="store-shell min-h-screen">
      <PublicNavbar />
      <main className="relative z-10 mx-auto w-full max-w-[92rem] px-4 pb-20 pt-8 md:px-8 md:pb-24 md:pt-10 xl:px-10">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}
