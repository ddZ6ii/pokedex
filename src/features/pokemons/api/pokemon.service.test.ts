import { describe, expect, it, vi } from 'vitest'

import { pokemonService } from '@/features/pokemons/api/pokemon.service'
import { type PokemonsPaginatedResponse } from '@/features/pokemons/schemas'
import { HttpError, ServerError, ValidationError } from '@/shared/api'
import { type ApiQueryParams } from '@/shared/schemas'

const defaultParams: ApiQueryParams = {
  _page: '1',
  _per_page: '10',
  _sort: 'id',
}

const validResponse: PokemonsPaginatedResponse = {
  first: 1,
  prev: null,
  next: null,
  last: 1,
  pages: 1,
  items: 1,
  data: [
    {
      id: 1,
      name: 'Bulbasaur',
      primary_type: 'grass',
      secondary_type: 'poison',
      hp: 45,
      attack: 49,
      defense: 49,
      special_attack: 65,
      special_defense: 65,
      speed: 45,
    },
  ],
}

function mockFetch(body: unknown, status = 200) {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status }),
  )
}

describe('pokemonService.getPokemons', () => {
  it('returns parsed pokemon array on 200 with valid body', async () => {
    mockFetch(validResponse)
    await expect(pokemonService.getPokemons(defaultParams)).resolves.toEqual(
      validResponse,
    )
  })

  it('throws HttpError on 404', async () => {
    mockFetch(null, 404)
    const err = await pokemonService
      .getPokemons(defaultParams)
      .catch((e: unknown) => e)
    expect(err).toBeInstanceOf(HttpError)
    expect((err as HttpError).status).toBe(404)
  })

  it('throws HttpError on 500', async () => {
    mockFetch(null, 500)
    const err = await pokemonService
      .getPokemons(defaultParams)
      .catch((e: unknown) => e)
    expect(err).toBeInstanceOf(HttpError)
    expect((err as HttpError).status).toBe(500)
  })

  it('throws ValidationError on invalid response shape', async () => {
    mockFetch({ not: 'an array' })
    await expect(
      pokemonService.getPokemons(defaultParams),
    ).rejects.toBeInstanceOf(ValidationError)
  })

  it('re-throws abort error without wrapping', async () => {
    const abortError = new DOMException('Aborted', 'AbortError')
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(abortError)
    const err = await pokemonService
      .getPokemons(defaultParams)
      .catch((e: unknown) => e)
    expect(err).toBeInstanceOf(DOMException)
    expect((err as DOMException).name).toBe('AbortError')
  })

  it('throws ServerError on network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
      new TypeError('Failed to fetch'),
    )
    await expect(
      pokemonService.getPokemons(defaultParams),
    ).rejects.toBeInstanceOf(ServerError)
  })

  it('forwards the abort signal to fetch', async () => {
    const controller = new AbortController()
    const spy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify(validResponse), { status: 200 }),
      )
    await pokemonService.getPokemons(defaultParams, controller.signal)
    expect(spy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ signal: controller.signal }),
    )
  })
})
