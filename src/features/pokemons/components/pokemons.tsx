import {
  QueryErrorResetBoundary,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { Suspense } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'

import { createPokemonsQueryOptions } from '@/features/pokemons/api'
import {
  PokemonList,
  PokemonListSkeleton,
} from '@/features/pokemons/components/pokemon-list'
import { PaginationBar } from '@/features/pagination/components'
import { ErrorFallback } from '@/shared/components'
import { useQueryParams } from '@/shared/store'

function WidgetFallback(props: FallbackProps) {
  return (
    <ErrorFallback
      {...props}
      title="Failed to load pokemons"
      className="h-full"
    />
  )
}

function PokemonsFetcher() {
  const queryParams = useQueryParams()

  // ℹ️ How useSuspenseQuery works
  //
  // useSuspenseQuery throws synchronously on error.
  // The component never reaches the return statement.
  // -> `error`, `isError` and related component's branching logic are unreachable.
  // React bubbles the error up to the closest error boundary.
  const {
    data: { data: pokemons, pages: maxPage, items: totalItems },
  } = useSuspenseQuery(createPokemonsQueryOptions(queryParams))

  return (
    <>
      <PokemonList pokemons={pokemons} />
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
