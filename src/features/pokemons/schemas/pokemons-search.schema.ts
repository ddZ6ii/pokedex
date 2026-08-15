import * as z from 'zod'

import { FilterSchema } from '@/features/filters/schemas'
import { POKEMON_TYPES } from '@/features/pokemons/schemas/pokemon.schema'
import { SortingSchema } from '@/features/sorting/schemas'

// Per-field `.catch()`: a malformed value (bad URL edit, stale link) resets only
// that field to its default, instead of throwing and losing the whole search state.
const PokemonsSearchSchema = z.object({
  page: FilterSchema.shape.page.catch(1),
  perPage: FilterSchema.shape.perPage.catch(10),
  search: FilterSchema.shape.search.catch(undefined),
  stats: FilterSchema.shape.stats.catch(undefined),
  types: z.array(z.enum(POKEMON_TYPES)).optional().catch(undefined),
  sort: SortingSchema.shape.sort.catch(undefined),
})

type PokemonsSearch = z.infer<typeof PokemonsSearchSchema>

export { PokemonsSearchSchema, type PokemonsSearch }
