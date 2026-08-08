import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import type { PokemonsPaginatedResponse } from '@/features/pokemons/schemas'
import {
  makePaginatedResponse,
  makePokemon,
  POKEMONS_URL,
  renderWithRouter,
} from '@/tests/utilities'

function makePage(page: number): PokemonsPaginatedResponse {
  return makePaginatedResponse(
    [makePokemon({ id: page, name: `Pokemon${String(page)}` })],
    {
      prev: page > 1 ? page - 1 : null,
      next: page < 3 ? page + 1 : null,
      last: 3,
      pages: 3,
      items: 3,
    },
  )
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

describe('Pagination', () => {
  it('renders page links as real anchors and navigates on click', async () => {
    server.use(
      http.get(POKEMONS_URL, ({ request }) => {
        const url = new URL(request.url)
        const page = Number(url.searchParams.get('_page') ?? '1')
        return HttpResponse.json(makePage(page))
      }),
    )

    renderWithRouter(['/pokemons?perPage=1'])
    await screen.findByText('Pokemon1')

    const pageTwoLink = screen.getByRole('link', { name: '2' })
    expect(pageTwoLink).toHaveAttribute(
      'href',
      expect.stringContaining('page=2'),
    )

    const user = userEvent.setup()
    await user.click(pageTwoLink)

    await waitFor(() => {
      expect(screen.getByText('Pokemon2')).toBeInTheDocument()
    })
  })

  it('renders Previous as a disabled, non-link button on the first page', async () => {
    server.use(http.get(POKEMONS_URL, () => HttpResponse.json(makePage(1))))

    renderWithRouter(['/pokemons?perPage=1'])
    await screen.findByText('Pokemon1')

    expect(
      screen.queryByRole('link', { name: /go to previous page/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /go to previous page/i }),
    ).toBeDisabled()
  })
})
