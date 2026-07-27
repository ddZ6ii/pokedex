import { createFileRoute } from '@tanstack/react-router'

import { createPokemonsQueryOptions } from '@/features/pokemons/api'
import { Pokedex } from '@/features/pokemons/components'
import {
  PokemonsSearchSchema,
  toPokemonsQueryOptions,
} from '@/features/pokemons/schemas'

export const Route = createFileRoute('/(public)/pokemons')({
  validateSearch: PokemonsSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    context.queryClient
      .ensureQueryData(createPokemonsQueryOptions(toPokemonsQueryOptions(deps)))
      .catch(() => {
        // Swallow: PokemonsFetcher's useSuspenseQuery re-reads this same
        // (now-settled) query and throws to the nearest error boundary.
        // This prefetch is fire-and-forget, not the source of truth.
      })
  },
  component: Pokedex,
})
