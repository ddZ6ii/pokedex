import z from 'zod'

import { FilterSchema } from '@/features/filters/schemas'
import { POKEMON_TYPES } from '@/features/pokemons/schemas/pokemon.schema'
import { SortingSchema } from '@/features/sorting/schemas'
import type { QueryOptions } from '@/shared/schemas'

const PokemonsSearchSchema = z.object({
  page: FilterSchema.shape.page.catch(1),
  perPage: FilterSchema.shape.perPage.catch(10),
  search: FilterSchema.shape.search.catch(undefined),
  stats: FilterSchema.shape.stats.catch(null),
  types: z.array(z.enum(POKEMON_TYPES)).nullable().default(null).catch(null),
  sort: SortingSchema.shape.sort.catch([]),
})

type PokemonsSearch = z.infer<typeof PokemonsSearchSchema>

const toPokemonsQueryOptions = (
  search: PokemonsSearch,
): NonNullable<QueryOptions> => ({
  page: search.page,
  perPage: search.perPage,
  search: search.search,
  stats: search.stats,
  types: search.types ? new Set(search.types) : null,
  sort: search.sort,
})

export { PokemonsSearchSchema, toPokemonsQueryOptions, type PokemonsSearch }
