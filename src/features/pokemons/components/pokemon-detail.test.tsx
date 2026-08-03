import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { delay, http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import {
  makePaginatedResponse,
  makePokemon,
  POKEMON_URL,
  POKEMONS_URL,
  pokemonFixture,
  renderWithRouter,
} from '@/tests/utilities'

const validResponse = makePaginatedResponse([makePokemon()])

const server = setupServer(
  http.get(POKEMONS_URL, () => HttpResponse.json(validResponse)),
  http.get(POKEMON_URL, () => HttpResponse.json(pokemonFixture)),
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

describe('PokemonDetailModal', () => {
  it('shows a friendly error inside the modal for a malformed pokemonId, keeping the list visible', async () => {
    renderWithRouter(['/pokemons/not-a-number'])

    const dialog = await screen.findByRole('dialog')
    // The dialog heading and the alert title are two distinct pieces of copy.
    expect(
      within(dialog).getByText('Unable to load Pokémon...'),
    ).toBeInTheDocument()
    expect(within(dialog).getByText('Pokémon not found')).toBeInTheDocument()

    // The list layout underneath is still mounted and visible.
    expect(await screen.findByText('Bulbasaur')).toBeInTheDocument()

    // Retry can never succeed against the same malformed URL, so it must not appear.
    expect(
      within(dialog).queryByRole('button', { name: /retry/i }),
    ).not.toBeInTheDocument()
  })

  it('prefetches the pokemon by id via the route loader', async () => {
    const requests: URL[] = []
    server.use(
      http.get(POKEMON_URL, ({ request }) => {
        requests.push(new URL(request.url))
        return HttpResponse.json(pokemonFixture)
      }),
    )

    renderWithRouter(['/pokemons/1'])

    await waitFor(() => {
      expect(requests).toHaveLength(1)
    })
    expect(requests[0]?.pathname).toBe('/pokemons/1')
  })

  it('shows a skeleton while the pokemon is loading', async () => {
    server.use(
      http.get(POKEMON_URL, async () => {
        await delay('infinite')
      }),
    )

    renderWithRouter(['/pokemons/1'])

    const dialog = await screen.findByRole('dialog')
    expect(
      dialog.querySelectorAll('[data-slot="skeleton"]').length,
    ).toBeGreaterThan(0)
    expect(
      within(dialog).queryByText(pokemonFixture.name),
    ).not.toBeInTheDocument()
  })

  it('shows "Pokémon not found" without a retry button for a valid id the API does not have', async () => {
    server.use(
      http.get(POKEMON_URL, () => new HttpResponse(null, { status: 404 })),
    )

    renderWithRouter(['/pokemons/98989'])

    const dialog = await screen.findByRole('dialog')
    // The dialog heading and the alert title are two distinct pieces of copy.
    await waitFor(() => {
      expect(
        within(dialog).getByText('Unable to load Pokémon'),
      ).toBeInTheDocument()
    })
    expect(within(dialog).getByText('Pokémon not found')).toBeInTheDocument()
    expect(
      within(dialog).getByText('No Pokémon found with id 98989.'),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /retry/i }),
    ).not.toBeInTheDocument()
  })

  it('shows "Failed to load pokemon details" with a retry button for a genuine server error', async () => {
    server.use(
      http.get(POKEMON_URL, () => new HttpResponse(null, { status: 500 })),
    )

    renderWithRouter(['/pokemons/1'])

    const dialog = await screen.findByRole('dialog')
    // The dialog heading and the alert title are two distinct pieces of copy.
    await waitFor(() => {
      expect(
        within(dialog).getByText('Failed to load pokemon details'),
      ).toBeInTheDocument()
    })
    expect(
      within(dialog).getByText('Unable to load Pokémon'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()

    // The raw HTTP status/URL text must never leak to the user.
    expect(within(dialog).queryByText(/http:\/\//)).not.toBeInTheDocument()
    expect(
      within(dialog).queryByText(/500 Internal Server Error/),
    ).not.toBeInTheDocument()
    expect(
      within(dialog).getByText(
        'Something went wrong while loading Pokémon data. Please try again later.',
      ),
    ).toBeInTheDocument()
  })

  it('shows the pokemon name, description, types, and stats once loaded', async () => {
    renderWithRouter(['/pokemons/1'])

    const dialog = await screen.findByRole('dialog')
    expect(
      await within(dialog).findByText(pokemonFixture.name),
    ).toBeInTheDocument()
    expect(
      within(dialog).getByText(pokemonFixture.description ?? ''),
    ).toBeInTheDocument()
    expect(within(dialog).getByText('Grass')).toBeInTheDocument()
    expect(within(dialog).getByText('Poison')).toBeInTheDocument()
    expect(within(dialog).getAllByText('45')).toHaveLength(2) // hp and speed both 45
    expect(within(dialog).getAllByText('49')).toHaveLength(2) // attack and defense both 49
  })

  it('falls back to a placeholder when the pokemon has no description', async () => {
    server.use(
      http.get(POKEMON_URL, () =>
        HttpResponse.json({ ...pokemonFixture, description: undefined }),
      ),
    )

    renderWithRouter(['/pokemons/1'])

    const dialog = await screen.findByRole('dialog')
    expect(
      await within(dialog).findByText('No description available.'),
    ).toBeInTheDocument()
  })

  it('shows an evolution note when the pokemon evolved from another', async () => {
    server.use(
      http.get(POKEMON_URL, () =>
        HttpResponse.json({
          ...pokemonFixture,
          id: 2,
          stage: '2',
          evolves_from_id: 1,
          evolves_from_name: 'Bulbasaur',
        }),
      ),
    )

    renderWithRouter(['/pokemons/2'])

    const dialog = await screen.findByRole('dialog')
    expect(await within(dialog).findByText(/evolves from/i)).toBeInTheDocument()
    expect(
      within(dialog).getByRole('link', { name: /bulbasaur/i }),
    ).toBeInTheDocument()
  })

  it('shows no evolution note for a base-stage pokemon', async () => {
    renderWithRouter(['/pokemons/1']) // pokemonFixture is base stage, evolves_from_name: null

    await screen.findByRole('dialog')
    expect(screen.queryByText(/evolves from/i)).not.toBeInTheDocument()
  })

  it('opens the modal from a card click and closes back to /pokemons preserving search params', async () => {
    const user = userEvent.setup()
    const { router } = renderWithRouter(['/pokemons?perPage=10'])

    await screen.findByText('Bulbasaur') // list rendered
    const searchBeforeOpen = router.state.location.search

    await user.click(screen.getByRole('link', { name: /bulbasaur/i }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/pokemons/1')
    })
    expect(router.state.location.search).toEqual(searchBeforeOpen)
    await screen.findByRole('dialog')

    await user.click(screen.getByRole('button', { name: /close/i }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/pokemons')
    })
    expect(router.state.location.search).toEqual(searchBeforeOpen)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument() // list still there
  })
})
