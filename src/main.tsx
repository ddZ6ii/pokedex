import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'

import { routeTree } from '@/routeTree.gen'
import { ValidationError } from '@/shared/api'
import {
  DefaultErrorComponent,
  DefaultNotFoundComponent,
  DefaultPendingComponent,
  ErrorFallback,
} from '@/shared/components'
import './index.css'

const rootEl = document.getElementById('root')

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent staleness-based refetches since data is not expected to change (no mutations)
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      // Global error handling (only valid for useQuery) that should trigger the closest error boundary (e.g.: ValidationError → API contract broken → Re-throw → error boundary).
      // useSuspensQuery throws all errors unconditionally and synchronously, so it doesn't use this global error handling and always triggers the closest error boundary.
      throwOnError: (error) => {
        return error instanceof ValidationError
      },
    },
  },
})

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  defaultStructuralSharing: true,
  defaultErrorComponent: DefaultErrorComponent,
  defaultNotFoundComponent: DefaultNotFoundComponent,
  defaultPendingComponent: DefaultPendingComponent,
  scrollRestoration: true,
  scrollRestorationBehavior: 'smooth',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <ErrorBoundary
        FallbackComponent={(props: FallbackProps) => (
          <ErrorFallback {...props} className="min-h-screen" />
        )}
      >
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools buttonPosition="bottom-right" />
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>,
  )
}
