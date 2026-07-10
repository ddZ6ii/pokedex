import { act, fireEvent, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { SearchPokemon } from '@/features/filters/components/search-pokemon'
import type { PokemonsPaginatedResponse } from '@/features/pokemons/schemas'
import { renderWithProviders } from '@/tests/utilities'

const DEBOUNCE_DELAY = 350
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
    },
  ],
}

const server = setupServer(
  http.get(POKEMONS_URL, () => HttpResponse.json(successResponse)),
)

function renderSearch() {
  return renderWithProviders(<SearchPokemon id="search-test" />)
}

async function typeAndWait(value: string) {
  act(() => {
    fireEvent.change(screen.getByRole('searchbox'), { target: { value } })
  })
  await act(async () => {
    await vi.advanceTimersByTimeAsync(DEBOUNCE_DELAY)
  })
  await act(async () => {
    await vi.runAllTimersAsync()
  })
}

beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

describe('Search', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Typing and debounce', () => {
    it('hides result count initially', () => {
      renderSearch()
      expect(screen.queryByText(/results/i)).not.toBeInTheDocument()
    })

    it('typing triggers API request after debounce → result count appears', async () => {
      renderSearch()
      await typeAndWait('Bulba')
      expect(screen.getByText('1 results')).toBeInTheDocument()
    })

    it('rapid typing only fires one request', async () => {
      const handler = vi.fn(() => HttpResponse.json(successResponse))
      server.use(http.get(POKEMONS_URL, handler))

      renderSearch()
      const input = screen.getByRole('searchbox')

      act(() => {
        fireEvent.change(input, { target: { value: 'B' } })
        fireEvent.change(input, { target: { value: 'Bu' } })
        fireEvent.change(input, { target: { value: 'Bul' } })
        fireEvent.change(input, { target: { value: 'Bulb' } })
        fireEvent.change(input, { target: { value: 'Bulba' } })
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(DEBOUNCE_DELAY)
      })

      expect(handler).toHaveBeenCalledOnce()
    })
  })

  describe('Clear button', () => {
    it('absent when input is empty', () => {
      renderSearch()
      expect(
        screen.queryByRole('button', { name: /clear search/i }),
      ).not.toBeInTheDocument()
    })

    it('appears after typing → click clears input and hides result count', async () => {
      renderSearch()

      const input = screen.getByRole('searchbox')
      await typeAndWait('Bulba')

      expect(screen.getByText('1 results')).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button', { name: /clear search/i }))

      expect(input).toHaveValue('')
      expect(screen.queryByText(/results/i)).not.toBeInTheDocument()
    })

    it('cancels pending debounce so no API call fires', async () => {
      const handler = vi.fn(() => HttpResponse.json(successResponse))
      server.use(http.get(POKEMONS_URL, handler))

      renderSearch()
      const input = screen.getByRole('searchbox')

      fireEvent.change(input, { target: { value: 'Bu' } })
      fireEvent.click(screen.getByRole('button', { name: /clear search/i }))

      await act(async () => {
        await vi.advanceTimersByTimeAsync(DEBOUNCE_DELAY)
      })

      expect(handler).not.toHaveBeenCalled()
    })
  })
})
