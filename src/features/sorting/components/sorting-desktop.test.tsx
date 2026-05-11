import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type {
  SelectSortByOptions,
  SelectSortOrderOptions,
} from '@/features/filters/schemas'
import { SortingDesktop } from '@/features/sorting/components/sorting-desktop'
import { useFiltersActions, useSortFilters } from '@/shared/store'
import { renderWithProviders } from '@/tests/utilities'

const SELECT_SORTING_CRITERIA_LABEL = /select sorting criteria/i
const SELECT_SORTING_ORDER_LABEL = /select sorting order/i

const setSorting = vi.fn()
const resetSorting = vi.fn()

vi.mock('@/shared/store', () => ({
  useSortFilters: vi.fn(),
  useFiltersActions: vi.fn(),
}))

function mockStore(
  sortBy: SelectSortByOptions | null = null,
  sortOrder: SelectSortOrderOptions | null = null,
) {
  vi.mocked(useSortFilters).mockReturnValue({ sortBy, sortOrder })
  vi.mocked(useFiltersActions).mockReturnValue({
    setSorting,
    resetSorting,
    setPage: vi.fn(),
    setPerPage: vi.fn(),
    setSearch: vi.fn(),
  })
}

beforeEach(() => {
  setSorting.mockClear()
  resetSorting.mockClear()
})

describe('SortingDesktop', () => {
  beforeEach(() => {
    mockStore()
  })

  it('renders "Sort by" and "Order by" selects', () => {
    renderWithProviders(<SortingDesktop />)

    expect(
      screen.getByRole('combobox', { name: SELECT_SORTING_CRITERIA_LABEL }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('combobox', { name: SELECT_SORTING_ORDER_LABEL }),
    ).toBeInTheDocument()
  })

  it('calls setSorting with "asc" when no sortOrder is set', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SortingDesktop />)

    await user.click(
      screen.getByRole('combobox', { name: SELECT_SORTING_CRITERIA_LABEL }),
    )
    await user.click(await screen.findByRole('option', { name: /^name$/i }))

    expect(setSorting).toHaveBeenCalledWith('name', 'asc')
  })

  it('clears sort-by calls setSorting(null, null)', async () => {
    mockStore('name', 'desc')
    const user = userEvent.setup()
    renderWithProviders(<SortingDesktop />)

    await user.click(screen.getByRole('button', { name: /clear selection/i }))

    expect(setSorting).toHaveBeenCalledWith(null, null)
  })

  it('calls setSorting with current sortBy and new order when selecting sort-order', async () => {
    mockStore('name', 'asc')
    const user = userEvent.setup()
    renderWithProviders(<SortingDesktop />)

    await user.click(
      screen.getByRole('combobox', { name: SELECT_SORTING_ORDER_LABEL }),
    )
    await user.click(await screen.findByRole('option', { name: /descending/i }))

    expect(setSorting).toHaveBeenCalledWith('name', 'desc')
  })
})
