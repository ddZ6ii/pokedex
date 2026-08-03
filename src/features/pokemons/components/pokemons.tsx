import {
  QueryErrorResetBoundary,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { Suspense, useDeferredValue } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'

import { PaginationBar } from '@/features/pagination/components'
import { createPokemonsQueryOptions } from '@/features/pokemons/api'
import {
  PokemonList,
  PokemonListSkeleton,
} from '@/features/pokemons/components/pokemon-list'
import { toPokemonsQueryOptions } from '@/features/pokemons/utilities'
import { pokemonsRouteApi as routeApi } from '@/routes/(public)/-route-api'
import { ErrorFallback } from '@/shared/components'
import { cn } from '@/shared/lib/utils'

function WidgetFallback(props: FallbackProps) {
  return (
    <ErrorFallback
      {...props}
      title="Failed to load pokemons"
      className="h-full"
      variant="destructive"
    />
  )
}

function PokemonsFetcher() {
  const searchParams = routeApi.useSearch()

  // ℹ️ Why `useDeferredValue` here
  //
  // `useSuspenseQuery` has no `placeholderData`/`keepPreviousData` escape
  // hatch (that's a `useQuery`-only feature), so a query-key change with
  // nothing cached for it suspends immediately, replacing the list with
  // the Suspense fallback (UI flickers with skeletons).
  // `useDeferredValue(searchParams)` keeps returning the *previous* searchParams while
  // React re-renders this component in the background with the new ones.
  // If that background render suspends, React doesn't show the fallback —
  // it keeps the current list mounted (rendered with the stale searchParams)
  // until the new data is ready, then swaps in the fresh list.
  const deferredSearchParams = useDeferredValue(searchParams)

  // ℹ️ How `useSuspenseQuery` works
  //
  // `useSuspenseQuery` throws synchronously on error.
  // The component never reaches the return statement.
  // -> `error`, `isError` and related component's branching logic are unreachable.
  // React bubbles the error up to the closest error boundary.
  const {
    data: { data: pokemons, pages: maxPage, items: totalItems },
  } = useSuspenseQuery(
    createPokemonsQueryOptions(toPokemonsQueryOptions(deferredSearchParams)),
  )

  const isStale = deferredSearchParams !== searchParams

  return (
    <>
      <PokemonList
        pokemons={pokemons}
        aria-busy={isStale}
        className={cn(
          'transition-opacity duration-300',
          isStale && 'opacity-60',
        )}
      />
      <PaginationBar maxPage={maxPage} totalItems={totalItems} />
    </>
  )
}

export function Pokemons() {
  // ℹ️ How QueryErrorResetBoundary works
  // 1. resetErrorBoundary calls reset (from QueryErrorResetBoundary). This tells TanStack Query to clear the error state for queries inside the boundary.
  // 2. ErrorBoundary then re-renders its children. useSuspenseQuery runs again, sees the query is no longer in error state, and triggers a fresh fetch (suspending while it loads).
  // Without QueryErrorResetBoundary, clicking retry would re-render the component but useSuspenseQuery would immediately re-throw the cached error — no network request would be made.
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary FallbackComponent={WidgetFallback} onReset={reset}>
          <Suspense fallback={<PokemonListSkeleton />}>
            <PokemonsFetcher />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
