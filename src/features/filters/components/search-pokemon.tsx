import { useQuery } from '@tanstack/react-query'
import { useMemo, useRef } from 'react'

import { createPokemonsQueryOptions } from '@/features/pokemons/api'
import type { PokemonsPaginatedResponse } from '@/features/pokemons/schemas'

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
import { useFiltersActions, useQueryParams } from '@/shared/store'
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

  const { search, ...queryParams } = useQueryParams()
  const { setSearch } = useFiltersActions()

  const { data: results, isFetching } = useQuery({
    ...createPokemonsQueryOptions({ search, ...queryParams }),
    select: selectItems,
    enabled: !!search,
  })

  const debouncedSetSearch = useMemo(
    () =>
      debounce(
        (nextSearch: string) => {
          setSearch(nextSearch.trim())
        },
        { delay: 350 },
      ),
    [setSearch],
  )

  const showResults =
    search !== undefined && search.length > 0 && results !== undefined

  return (
    <Search>
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
        {showResults && <SearchResults>{results} results</SearchResults>}
        <SearchResetTrigger
          aria-controls={id}
          aria-label={isFetching ? 'Loading' : 'Clear search'}
          disabled={isFetching}
          loading={isFetching}
          size="icon-xs"
          onSearchClear={() => {
            debouncedSetSearch.cancel()
            setSearch('')
            inputRef.current?.focus()
          }}
        />
      </SearchInputGroup>
    </Search>
  )
}
