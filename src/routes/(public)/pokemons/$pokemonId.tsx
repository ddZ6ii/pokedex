import { createFileRoute } from '@tanstack/react-router'

import {
  createPokemonQueryOptions,
  InvalidPokemonIdError,
} from '@/features/pokemons/api'
import {
  PokemonDetailModal,
  PokemonDetailRouteError,
} from '@/features/pokemons/components'
import { PokemonSchema } from '@/features/pokemons/schemas'

export const Route = createFileRoute('/(public)/pokemons/$pokemonId')({
  params: {
    parse: (params) => {
      const result = PokemonSchema.shape.id.safeParse(params.pokemonId)
      if (!result.success) {
        throw new InvalidPokemonIdError(params.pokemonId)
      }
      return { pokemonId: result.data }
    },
  },
  loader: ({ context, params }) => {
    context.queryClient
      .ensureQueryData(createPokemonQueryOptions(params.pokemonId))
      .catch(() => {
        // Swallow: PokemonDetailFetcher's `useSuspenseQuery` re-reads this same
        // (now-settled) query and throws to the nearest error boundary.
        // This prefetch is fire-and-forget, not the source of truth.
      })
  },
  component: PokemonDetailModal,
  errorComponent: PokemonDetailRouteError,
})
