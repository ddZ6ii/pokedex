import { queryOptions } from '@tanstack/react-query'

import { pokemonService } from '@/features/pokemons/api'
import { type PokemonsPaginatedResponse } from '@/features/pokemons/schemas'
import { HttpError, ValidationError } from '@/shared/api'
import { ApiQueryParamsSchema, type QueryOptions } from '@/shared/schemas'

const createPokemonsQueryOptions = (options?: QueryOptions) => {
  const parsedOptions = ApiQueryParamsSchema.safeParse(options)
  if (!parsedOptions.success) {
    throw new ValidationError(parsedOptions.error)
  }
  const queryParams = parsedOptions.data

  return queryOptions({
    queryKey: ['pokemons', queryParams],
    queryFn: ({ signal }) =>
      pokemonService.getPokemons(queryParams, signal).catch((err: unknown) => {
        // 404 no pokemons exist yet (expected error) -> treat inline as empty list so useSuspenseQuery never throws.
        // All other errors bubble up to the nearest error boundary.
        if (err instanceof HttpError && err.status === 404)
          return {
            first: 1,
            prev: null,
            next: null,
            last: 1,
            pages: 0,
            items: 0,
            data: [],
          } satisfies PokemonsPaginatedResponse
        throw err
      }),
  })
}

export { createPokemonsQueryOptions }
