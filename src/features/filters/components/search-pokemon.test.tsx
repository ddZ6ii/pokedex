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
import { renderWithProviders, successPokemonsResponse } from '@/tests/utilities'

const DEBOUNCE_DELAY = 350
const POKEMONS_URL = '*/pokemons'

type MockSearch = { search?: string; page: number; perPage: 10 | 20 | 50 | 100 }

const mockNavigate =
  vi.fn<
    (opts: { search: (prev: MockSearch) => unknown; replace?: boolean }) => void
  >()
let mockSearch: MockSearch = {
  search: undefined,
  page: 1,
  perPage: 10,
}

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    getRouteApi: () => ({
      useSearch: () => mockSearch,
      useNavigate: () => mockNavigate,
    }),
  }
})

const server = setupServer(
  http.get(POKEMONS_URL, () => HttpResponse.json(successPokemonsResponse)),
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
beforeEach(() => {
  mockSearch = { search: undefined, page: 1, perPage: 10 }
})
afterEach(() => {
  server.resetHandlers()
  vi.clearAllMocks()
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

  describe('Initial value from URL', () => {
    it('seeds the input from the current search param on first render', () => {
      mockSearch = { search: 'Bulba', page: 1, perPage: 10 }

      renderSearch()

      expect(screen.getByRole('searchbox')).toHaveValue('Bulba')
    })
  })

  describe('Typing and debounce', () => {
    it('hides result count initially', () => {
      renderSearch()
      expect(screen.queryByText(/results/i)).not.toBeInTheDocument()
    })

    it('typing triggers navigate with the trimmed search and resets page to 1', async () => {
      renderSearch()
      await typeAndWait('Bulba')

      expect(mockNavigate).toHaveBeenCalledWith({
        search: expect.any(Function) as (prev: MockSearch) => unknown,
        replace: true,
      })
      const updater = mockNavigate.mock.calls[0]?.[0]?.search
      expect(updater?.(mockSearch)).toEqual({
        search: 'Bulba',
        page: 1,
        perPage: 10,
      })
    })

    it('rapid typing only fires one navigate call', async () => {
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

      expect(mockNavigate).toHaveBeenCalledOnce()
    })
  })

  describe('Clear button', () => {
    it('absent when input is empty', () => {
      renderSearch()
      expect(
        screen.queryByRole('button', { name: /clear search/i }),
      ).not.toBeInTheDocument()
    })

    it('appears after typing → click clears input and navigates with search removed', async () => {
      renderSearch()

      const input = screen.getByRole('searchbox')
      await typeAndWait('Bulba')
      mockNavigate.mockClear()

      fireEvent.click(screen.getByRole('button', { name: /clear search/i }))

      expect(input).toHaveValue('')
      expect(mockNavigate).toHaveBeenCalledWith({
        search: expect.any(Function) as (prev: MockSearch) => unknown,
        replace: true,
      })
      const updater = mockNavigate.mock.calls[0]?.[0]?.search
      expect(updater?.(mockSearch)).toEqual({
        search: undefined,
        page: 1,
        perPage: 10,
      })
    })

    it('cancels pending debounce so navigate is not called twice', async () => {
      renderSearch()
      const input = screen.getByRole('searchbox')

      fireEvent.change(input, { target: { value: 'Bu' } })
      fireEvent.click(screen.getByRole('button', { name: /clear search/i }))

      await act(async () => {
        await vi.advanceTimersByTimeAsync(DEBOUNCE_DELAY)
      })

      expect(mockNavigate).toHaveBeenCalledOnce()
    })
  })
})
