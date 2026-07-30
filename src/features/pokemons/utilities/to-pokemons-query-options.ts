import type { PokemonsSearch } from '@/features/pokemons/schemas/pokemons-search.schema'
import type { QueryOptions } from '@/shared/schemas'

// URL search state uses arrays (serializable); query layer expects a Set for O(1) lookups.
export function toPokemonsQueryOptions(
  search: PokemonsSearch,
): NonNullable<QueryOptions> {
  const { types: _, ...restSearch } = search
  return {
    ...restSearch,
    types: search.types ? new Set(search.types) : null,
  }
}
