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

import {
  makePaginatedResponse,
  makePokemon,
  POKEMONS_URL,
  renderWithRouter,
} from '@/tests/utilities'

// Filtering/sorting/pagination integration tests (previously here) move to the
// follow-up plan that wires those controls to `navigate({ search })`. Until
// then they still write to Zustand, which this route no longer reads — see
// docs/superpowers/specs/2026-07-27-pokemons-route-loader-design.md.

const validResponse = makePaginatedResponse([makePokemon()])

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
  it('shows Heading and PokedexControls immediately, with a skeleton sized to the URL perPage, while loading', async () => {
    let resolveFetch: (response: Response) => void
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      () =>
        new Promise<Response>((resolve) => {
          // Promise extraction: save the resolve function to call it later in the test
          resolveFetch = resolve
        }),
    )

    // Calls fetch within useSuspenseQuery -> returns a forever-pending promise -> component shows skeleton
    renderWithRouter(['/pokemons?perPage=20'])

    // Assertions happen here while fetch is still pending
    expect(
      await screen.findByRole('heading', { name: /pokédex/i }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('searchbox', { name: /search pokemon/i }),
    ).toBeInTheDocument()

    const list = screen.getByRole('status')
    const listItems = within(list).getAllByRole('listitem')
    expect(listItems).toHaveLength(20)

    // Cleanly resolve the fetch promise to avoid test leaks and allow any pending effects to finish
    await act(
      () =>
        new Promise<void>((resolve) => {
          resolveFetch(
            new Response(JSON.stringify(validResponse), {
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
    expect(screen.getByText('No pokemons found.')).toHaveAttribute(
      'aria-live',
      'polite',
    )
  })

  it('announces the result count in a screen-reader-only live region once pokemons load', async () => {
    server.use(http.get(POKEMONS_URL, () => HttpResponse.json(validResponse)))

    renderWithRouter()

    await waitFor(() =>
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument(),
    )

    const statusRegions = screen.getAllByRole('status')
    const countRegion = statusRegions.find((region) =>
      /pokemon(s)? found\.$/.test(region.textContent),
    )
    expect(countRegion).toHaveTextContent('1 pokemon found.')
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
      http.get(POKEMONS_URL, () => HttpResponse.json(validResponse)),
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

  it('clamps the URL page back to the last valid page when it is out of range', async () => {
    // Mimics the real API (json-server): an out-of-range `_page` is served
    // as the last valid page's data instead of erroring.
    server.use(
      http.get(POKEMONS_URL, () =>
        HttpResponse.json(
          makePaginatedResponse([makePokemon()], {
            prev: 8,
            next: null,
            last: 9,
            pages: 9,
            items: 809,
          }),
        ),
      ),
    )

    const { router } = renderWithRouter(['/pokemons?page=999&perPage=100'])

    // The default 1000ms `waitFor` timeout is too tight on slower/loaded CI
    // runners for a real fetch-through-Suspense render cycle (other,
    // single-fetch tests in this file have been observed taking 800ms+ in
    // CI), so give this assertion more headroom.
    const timeout = 5000

    await waitFor(
      () => expect(screen.getByText('Bulbasaur')).toBeInTheDocument(),
      { timeout },
    )

    await waitFor(
      () => {
        expect(router.state.location.search).toEqual({
          page: 9,
          perPage: 100,
        })
      },
      { timeout },
    )

    const statusRegions = screen.getAllByRole('status')
    const rangeRegion = statusRegions.find((region) =>
      region.textContent.includes('of 809'),
    )
    expect(rangeRegion).toHaveTextContent('801 - 809 of 809')
  })
})
