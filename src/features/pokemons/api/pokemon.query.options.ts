import { queryOptions } from '@tanstack/react-query'

import { PokemonNotFoundError } from '@/features/pokemons/api/not-found-error'
import { pokemonService } from '@/features/pokemons/api/pokemon.service'
import {
  type Pokemon,
  type PokemonsPaginatedResponse,
} from '@/features/pokemons/schemas'
import { HttpError, ServerError, ValidationError } from '@/shared/api'
import { ApiQueryParamsSchema, type QueryOptions } from '@/shared/schemas'

const createPokemonsQueryOptions = (options?: QueryOptions) => {
  const parsedOptions = ApiQueryParamsSchema.safeParse(options)
  if (!parsedOptions.success) {
    throw new ValidationError(parsedOptions.error)
  }
  const searchParams = parsedOptions.data

  return queryOptions({
    queryKey: ['pokemons', searchParams],
    queryFn: ({ signal }) =>
      pokemonService.getPokemons(searchParams, signal).catch((err: unknown) => {
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

const createPokemonQueryOptions = (id: Pokemon['id']) => {
  return queryOptions({
    queryKey: ['pokemon', id],
    queryFn: ({ signal }) =>
      pokemonService.getPokemon(id, signal).catch((err: unknown) => {
        if (err instanceof HttpError && err.status === 404) {
          throw new PokemonNotFoundError(id)
        }
        if (err instanceof HttpError) {
          throw new ServerError(
            'Something went wrong while loading Pokémon data. Please try again later.',
            err,
          )
        }
        throw err
      }),
  })
}

export { createPokemonsQueryOptions, createPokemonQueryOptions }
