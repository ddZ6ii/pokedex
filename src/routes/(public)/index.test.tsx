import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import {
  emptyPokemonsResponse,
  POKEMONS_URL,
  renderWithRouter,
} from '@/tests/utilities'

const server = setupServer(
  http.get(POKEMONS_URL, () => HttpResponse.json(emptyPokemonsResponse)),
)

beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

describe('/ (landing page)', () => {
  it('navigates to /pokemons when "Get Started" is activated', async () => {
    const user = userEvent.setup()
    const { router } = renderWithRouter(['/'])

    await user.click(await screen.findByRole('link', { name: /get started/i }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/pokemons')
    })
  })
})
