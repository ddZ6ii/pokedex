import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { initialFilterState } from '@/features/filters/store'
import type { PokemonsPaginatedResponse } from '@/features/pokemons/schemas'
import { renderWithRouter } from '@/tests/utilities'

// Filtering/sorting/pagination integration tests (previously here) move to the
// follow-up plan that wires those controls to `navigate({ search })`. Until
// then they still write to Zustand, which this route no longer reads — see
// docs/superpowers/specs/2026-07-27-pokemons-route-loader-design.md.

const POKEMONS_URL = '*/pokemons'
const successResponse: PokemonsPaginatedResponse = {
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
      stage: 'base',
      evolves_from_id: null,
      evolves_from_name: null,
    },
  ],
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

describe('Pokedex', () => {
  it('shows Heading and PokedexControls immediately, with a skeleton for the list, while loading', async () => {
    let resolveFetch: (response: Response) => void
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          // Promise extraction: save the resolve function to call it later in the test
          resolveFetch = resolve
        }),
    )

    // Calls fetch within useSuspenseQuery -> returns a forever-pending promise -> component shows skeleton
    renderWithRouter()

    // Assertions happen here while fetch is still pending. `findByRole`
    // (rather than `getByRole`) tolerates the router's initial microtask-tick
    // match resolution (RouterProvider mounts before its first route match is
    // ready); the fetch mock never resolves on its own, so this wait doesn't
    // let the request settle underneath us.
    expect(
      await screen.findByRole('heading', { name: /pokédex/i }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('searchbox', { name: /search pokemon/i }),
    ).toBeInTheDocument()

    // `PokemonListSkeleton` still sizes itself from the Zustand `perPage`
    // default (it isn't wired to route search — out of scope for this task;
    // see docs/superpowers/specs/2026-07-27-pokemons-route-loader-design.md),
    // so it renders `initialFilterState.perPage` items regardless of the URL.
    const list = screen.getByRole('status')
    const listItems = within(list).getAllByRole('listitem')
    expect(listItems).toHaveLength(initialFilterState.perPage)

    // Cleanly resolve the fetch promise to avoid test leaks and allow any pending effects to finish
    await act(
      () =>
        new Promise<void>((resolve) => {
          resolveFetch(
            new Response(JSON.stringify(successResponse), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }),
          )
          resolve()
        }),
    )
  })

  it('shows empty state when no pokemons exist', async () => {
    server.use(
      http.get(POKEMONS_URL, () => new HttpResponse(null, { status: 404 })),
    )

    renderWithRouter()

    await waitFor(() =>
      expect(screen.getByText('No pokemons found.')).toBeInTheDocument(),
    )
  })

  it('shows error without retry button for non-recoverable errors', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    server.use(
      http.get(POKEMONS_URL, () => new HttpResponse(null, { status: 400 })),
    )

    renderWithRouter()

    await waitFor(() =>
      expect(screen.getByText('Failed to load pokemons')).toBeInTheDocument(),
    )
    expect(
      screen.queryByRole('button', { name: /retry/i }),
    ).not.toBeInTheDocument()
  })

  it('shows error fallback then recovers after retry', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    server.use(
      // First call: 500 → triggers error boundary
      http.get(POKEMONS_URL, () => new HttpResponse(null, { status: 500 }), {
        once: true,
      }),
      // Subsequent calls: success → recovery
      http.get(POKEMONS_URL, () => HttpResponse.json(successResponse)),
    )

    renderWithRouter()

    await waitFor(() =>
      expect(screen.getByText('Failed to load pokemons')).toBeInTheDocument(),
    )

    fireEvent.click(screen.getByRole('button', { name: /retry/i }))

    await waitFor(() =>
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument(),
    )
  })
})
