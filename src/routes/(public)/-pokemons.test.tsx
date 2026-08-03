import { waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import {
  emptyPokemonsResponse,
  POKEMONS_URL,
  renderWithRouter,
} from '@/tests/utilities'

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
    const path = '/pokemons'
    const search = '?page=2&perPage=20'
    const requests: URL[] = []

    server.use(
      http.get(POKEMONS_URL, ({ request }) => {
        requests.push(new URL(request.url))
        return HttpResponse.json(emptyPokemonsResponse)
      }),
    )

    const { router } = renderWithRouter([`${path}${search}`])

    await waitFor(() => {
      expect(requests).toHaveLength(1)
    })

    const [request] = requests
    expect(request?.searchParams.get('_page')).toBe('2')
    expect(request?.searchParams.get('_per_page')).toBe('20')

    expect(router.state.location.pathname).toBe(path)
    expect(router.state.location.search).toEqual({ page: 2, perPage: 20 })
  })
})
