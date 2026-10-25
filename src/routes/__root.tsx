import { createRootRoute, Outlet } from '@tanstack/react-router'
import { BottomNav } from '@/components/BottomNav'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="md:pl-56">
      <BottomNav />
      <main className="mx-auto min-h-dvh max-w-md px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-28 md:max-w-3xl md:px-8 md:pt-8 md:pb-10">
        <Outlet />
      </main>
    </div>
  )
}
