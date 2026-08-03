import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Header } from '@/routes/-components/header'
import { RootErrorComponent } from '@/shared/components'
import { TooltipProvider } from '@/shared/components/ui/tooltip'
import { useSystemModeSync } from '@/shared/hooks/use-system-mode-sync'

function RootLayout() {
  useSystemModeSync()

  return (
    <>
      <TooltipProvider>
        <div className="relative container mx-auto flex min-h-screen flex-col p-3">
          <Header />

          <main className="flex flex-1 flex-col">
            <Outlet />
          </main>
        </div>
      </TooltipProvider>

      <TanStackRouterDevtools />
    </>
  )
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootLayout,
  errorComponent: RootErrorComponent,
})
