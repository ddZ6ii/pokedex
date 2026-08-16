import {
  QueryErrorResetBoundary,
  useIsFetching,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { Suspense, useDeferredValue, useEffect } from 'react'
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
  const navigate = routeApi.useNavigate()
  const queryClient = useQueryClient()

  // ℹ️ Why `useDeferredValue` here
  //
  // `useSuspenseQuery` has no `placeholderData`/`keepPreviousData` escape
  // hatch (that's a `useQuery`-only feature), so a query-key change with
  // nothing cached for it suspends immediately, replacing the list with
  // the Suspense fallback (UI flickers with skeletons).
  // `useDeferredValue(searchParams)` keeps returning the *previous*
  // searchParams while React re-renders this component in the background
  // with the new ones. If that background render suspends, React doesn't
  // show the fallback — it keeps the current list mounted (rendered with
  // the stale searchParams) until the new data is ready, then swaps in
  // the fresh list.
  const deferredSearchParams = useDeferredValue(searchParams)

  const queryOptions = createPokemonsQueryOptions(
    toPokemonsQueryOptions(deferredSearchParams),
  )

  // ℹ️ How `useSuspenseQuery` works
  //
  // `useSuspenseQuery` throws synchronously on error.
  // The component never reaches the return statement.
  // -> `error`, `isError` and related component's branching logic are unreachable.
  // React bubbles the error up to the closest error boundary.
  const { data: response } = useSuspenseQuery(queryOptions)
  const { data: pokemons, pages: maxPage, items: totalItems } = response

  // ℹ️ Why `useIsFetching`, not `deferredSearchParams !== searchParams`
  //
  // The reference-comparison version was unreliable in practice. This reads
  // React Query's own fetch state instead — true whenever a pokemons-list
  // fetch is actually in flight (prefix-matches the query key, so it
  // doesn't care which exact params), tracking the real request duration.
  const isStale = useIsFetching({ queryKey: ['pokemons'] }) > 0

  // The API silently clamps an out-of-range `_page` to the last valid page
  // and returns that page's data, so a stale/hand-edited URL `page` beyond
  // `maxPage` would otherwise desync the pagination UI (range text, active
  // page) from what's actually displayed. Clamp the URL back in sync once
  // the fetch for the current params has settled.
  //
  // The response we already have *is* the corrected page's data (the API
  // clamped it server-side), so seed the cache entry for the corrected
  // `page` before navigating — otherwise the URL change would compute a new
  // query key with nothing cached for it, forcing a second, redundant fetch
  // for data we already hold.
  useEffect(() => {
    if (isStale) return
    if (maxPage > 0 && searchParams.page > maxPage) {
      const correctedQueryOptions = createPokemonsQueryOptions(
        toPokemonsQueryOptions({ ...deferredSearchParams, page: maxPage }),
      )
      queryClient.setQueryData(correctedQueryOptions.queryKey, response)
      void navigate({
        search: (prev) => ({ ...prev, page: maxPage }),
        replace: true,
      })
    }
  }, [
    isStale,
    maxPage,
    searchParams.page,
    navigate,
    queryClient,
    deferredSearchParams,
    response,
  ])

  return (
    <>
      {/*
        Wrapper to dim the pokemons list while a new fetch is in flight. This is a UX pattern to indicate that the list is stale and a new version is loading. The dimming is applied to this wrapper instead of `PokemonList` itself because `PokemonList` uses Framer Motion's `motion.ul` with `animate="visible"`, which sets `opacity` as an inline style. Inline styles take precedence over Tailwind's opacity classes, so applying the dimming class directly to `PokemonList` would be overridden by Framer Motion's inline styles, resulting in no visible effect. By wrapping `PokemonList` in a div and applying the dimming class to that div, we ensure that the opacity change is effective and visible during fetches.
      */}
      <div
        className={cn(
          'w-full transition-opacity duration-300',
          isStale && 'opacity-60',
        )}
      >
        <PokemonList pokemons={pokemons} aria-busy={isStale} />
      </div>
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
