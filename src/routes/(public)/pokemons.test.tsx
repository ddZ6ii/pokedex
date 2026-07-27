import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import type { PokemonsPaginatedResponse } from '@/features/pokemons/schemas'
import { renderWithRouter } from '@/tests/utilities'

const POKEMONS_URL = '*/pokemons'
const emptyResponse: PokemonsPaginatedResponse = {
  first: 1,
  prev: null,
  next: null,
  last: 1,
  pages: 0,
  items: 0,
  data: [],
}
const server = setupServer()

beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

describe('/pokemons route loader', () => {
  it('prefetches pokemons using the search params from the URL', async () => {
    const requests: URL[] = []
    server.use(
      http.get(POKEMONS_URL, ({ request }) => {
        requests.push(new URL(request.url))
        return HttpResponse.json(emptyResponse)
      }),
    )

    renderWithRouter(['/pokemons?perPage=20'])

    await waitFor(() => {
      expect(
        requests.find((url) => url.searchParams.get('_per_page') === '20'),
      ).toBeDefined()
    })
  })
})
