import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useRef } from 'react'

import { createPokemonsQueryOptions } from '@/features/pokemons/api'
import { type PokemonsPaginatedResponse } from '@/features/pokemons/schemas'
import { toPokemonsQueryOptions } from '@/features/pokemons/utilities'
import { pokemonsRouteApi as routeApi } from '@/routes/(public)/-route-api'
import {
  Search,
  SearchInput,
  SearchInputGroup,
  SearchInputIcon,
  SearchLabel,
  SearchResetTrigger,
  SearchResults,
} from '@/shared/components/search'
import { cn } from '@/shared/lib/utils'
import { debounce } from '@/shared/utilities'

const selectItems = (data: PokemonsPaginatedResponse) => data.items

export function SearchPokemon({
  className,
  id = 'search-pokemon',
}: {
  className?: string
  id?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = routeApi.useNavigate()
  const search = routeApi.useSearch()

  const { data: results, isFetching } = useQuery({
    ...createPokemonsQueryOptions(toPokemonsQueryOptions(search)),
    select: selectItems,
    enabled: !!search.search,
  })

  const debouncedSetSearch = useMemo(
    () =>
      debounce(
        // eslint-disable-next-line react-hooks/refs
        (nextSearch: string) => {
          const trimmedSearch = nextSearch.trim()
          void navigate({
            search: (prev) => ({
              ...prev,
              search: trimmedSearch.length > 0 ? trimmedSearch : undefined,
              page: 1,
            }),
            replace: true,
          })
          requestAnimationFrame(() => {
            inputRef.current?.focus()
          })
        },
        { delay: 350 },
      ),
    [navigate],
  )

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel()
    }
  }, [debouncedSetSearch])

  const showResults =
    search.search !== undefined &&
    search.search.length > 0 &&
    results !== undefined

  return (
    <Search key={search.search} initialSearch={search.search}>
      <SearchLabel htmlFor={id}>Search pokemon</SearchLabel>
      <SearchInputGroup
        className={cn(
          'has-[[data-slot=input-group-control]:focus-visible]:ring-primary/80 has-disabled:bg-background has-disabled:opacity-100 lg:h-9',
          className,
        )}
      >
        <SearchInputIcon />
        <SearchInput
          id={id}
          ref={inputRef}
          onValueChange={debouncedSetSearch}
        />
        {showResults && (
          <SearchResults role="status" aria-live="polite">
            {results} results
          </SearchResults>
        )}
        <SearchResetTrigger
          aria-controls={id}
          aria-label={isFetching ? 'Loading' : 'Clear search'}
          disabled={isFetching}
          loading={isFetching}
          size="icon-xs"
          onSearchClear={() => {
            debouncedSetSearch.cancel()
            void navigate({
              search: (prev) => ({ ...prev, search: undefined, page: 1 }),
              replace: true,
            })
            requestAnimationFrame(() => {
              inputRef.current?.focus()
            })
          }}
        />
      </SearchInputGroup>
    </Search>
  )
}
