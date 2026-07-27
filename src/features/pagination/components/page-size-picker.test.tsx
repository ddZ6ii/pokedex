import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { PageSizePicker } from '@/features/pagination/components/page-size-picker'
import { renderWithProviders } from '@/tests/utilities'

type MockSearch = { perPage: 10 | 20 | 50 | 100 }
type MockSearchResult = { perPage: number; page: number }

const mockNavigate =
  vi.fn<(opts: { search: (prev: MockSearch) => MockSearchResult }) => void>()
const mockSearch: MockSearch = { perPage: 10 }

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

describe('PageSizePicker', () => {
  it('shows the current perPage from route search', () => {
    renderWithProviders(<PageSizePicker />)
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('navigates with the selected perPage and resets page to 1', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PageSizePicker />)

    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: '20' }))

    expect(mockNavigate).toHaveBeenCalledWith({
      search: expect.any(Function) as (prev: MockSearch) => MockSearchResult,
    })
    const updater = mockNavigate.mock.calls[0]?.[0].search
    expect(updater?.(mockSearch)).toEqual({ perPage: 20, page: 1 })
  })
})
