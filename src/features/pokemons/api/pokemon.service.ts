import { ZodError, type ZodType } from 'zod'

import {
  PokemonsPaginatedResponseSchema,
  type PokemonsPaginatedResponse,
} from '@/features/pokemons/schemas/pokemon.schema'
import { HttpError, ServerError, ValidationError } from '@/shared/api'
import { envSchema, type ApiQueryParams } from '@/shared/schemas'
import { isAbortError } from '@/shared/utilities'

class PokemonService {
  #baseUrl: string

  constructor() {
    const port = envSchema.parse(import.meta.env.VITE_API_PORT ?? '3000')
    this.#baseUrl = `http://localhost:${port.toString()}`
  }

  async #fetch<TData>(
    url: string,
    schema: ZodType<TData>,
    signal?: AbortSignal,
  ): Promise<TData> {
    try {
      const response = await fetch(url, { signal })
      if (!response.ok) throw new HttpError(response)
      return schema.parse(await response.json())
    } catch (error) {
      // Let the query runner know the fetch was cancelled.
      // TanStack Query manages query cancellation internally.
      // It recognizes abort errors and does not propagte them to the Error Boundary.
      if (isAbortError(error)) throw error
      if (error instanceof HttpError) throw error
      if (error instanceof ZodError) throw new ValidationError(error)
      throw new ServerError(
        'Something went wrong while loading Pokémon data. Please try again later.',
        error,
      )
    }
  }

  async getPokemons(
    options: ApiQueryParams,
    signal?: AbortSignal,
  ): Promise<PokemonsPaginatedResponse> {
    const searchParams = new URLSearchParams(options).toString()

    return this.#fetch(
      `${this.#baseUrl}/pokemons?${searchParams}`,
      PokemonsPaginatedResponseSchema,
      signal,
    )
  }
}

export const pokemonService = new PokemonService()
