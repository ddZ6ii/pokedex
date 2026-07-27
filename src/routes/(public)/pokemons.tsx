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
    // Not awaited (intentional): letting the loader block here would skip
    // the route transition's pending state, so the PokemonList skeleton
    // never shows. PokemonsFetcher's useSuspenseQuery shares this query key,
    // so it reads the cache (or suspends on this same pending promise)
    // instead of firing a duplicate request.
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
