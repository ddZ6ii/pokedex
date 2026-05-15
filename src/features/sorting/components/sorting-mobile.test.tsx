import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SortingMobile } from '@/features/sorting/components/sorting-mobile'
import type {
  SelectSortByOptions,
  SelectSortOrderOptions,
} from '@/features/sorting/schemas'
import { useSorting, useSortingActions } from '@/shared/store'
import { renderWithProviders } from '@/tests/utilities'

const SELECT_SORTING_CRITERIA_LABEL = /select sorting criteria/i
const SHOW_SORTING_OPTIONS_LABEL = /show sorting options/i

const setSorting = vi.fn()
const resetSorting = vi.fn()

vi.mock('@/shared/store', () => ({
  useSorting: vi.fn(),
  useSortingActions: vi.fn(),
}))

function mockStore(
  sortBy: SelectSortByOptions | null = null,
  sortOrder: SelectSortOrderOptions | null = null,
) {
  vi.mocked(useSorting).mockReturnValue({ sortBy, sortOrder })
  vi.mocked(useSortingActions).mockReturnValue({
    setSorting,
    resetSorting,
  })
}

beforeEach(() => {
  setSorting.mockClear()
  resetSorting.mockClear()
})

describe('SortingMobile', () => {
  beforeEach(() => {
    mockStore()
  })

  it('renders a trigger button with accessible label', () => {
    renderWithProviders(<SortingMobile />)
    expect(
      screen.getByRole('button', { name: SHOW_SORTING_OPTIONS_LABEL }),
    ).toBeInTheDocument()
  })

  it('triggers button has no primary style when no sort is active', () => {
    renderWithProviders(<SortingMobile />)
    expect(
      screen.getByRole('button', { name: SHOW_SORTING_OPTIONS_LABEL }),
    ).not.toHaveClass('bg-primary!')
  })

  it('triggers button has primary style when a sort is active', () => {
    mockStore('name', 'asc')
    renderWithProviders(<SortingMobile />)
    expect(
      screen.getByRole('button', { name: SHOW_SORTING_OPTIONS_LABEL }),
    ).toHaveClass('bg-primary!')
  })

  it('commits draft sort to the store when Apply is clicked', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SortingMobile />)

    await user.click(
      screen.getByRole('button', { name: SHOW_SORTING_OPTIONS_LABEL }),
    )
    const drawer = await screen.findByRole('dialog')

    await user.click(
      within(drawer).getByRole('combobox', {
        name: SELECT_SORTING_CRITERIA_LABEL,
      }),
    )
    await user.click(await screen.findByRole('option', { name: /^name$/i }))

    await user.click(within(drawer).getByRole('button', { name: /apply/i }))

    expect(setSorting).toHaveBeenCalledWith('name', 'asc')
  })

  it('calls resetSorting when Reset button is clicked', async () => {
    mockStore('name', 'asc')
    const user = userEvent.setup()
    renderWithProviders(<SortingMobile />)

    await user.click(
      screen.getByRole('button', { name: SHOW_SORTING_OPTIONS_LABEL }),
    )
    const drawer = await screen.findByRole('dialog')
    await user.click(within(drawer).getByRole('button', { name: /reset/i }))

    expect(resetSorting).toHaveBeenCalled()
  })

  it('discards the draft without applying when closing the drawer', async () => {
    const user = userEvent.setup()
    renderWithProviders(<SortingMobile />)

    await user.click(
      screen.getByRole('button', { name: SHOW_SORTING_OPTIONS_LABEL }),
    )
    const drawer = await screen.findByRole('dialog')

    await user.click(
      within(drawer).getByRole('combobox', {
        name: SELECT_SORTING_CRITERIA_LABEL,
      }),
    )
    await user.click(await screen.findByRole('option', { name: /^name$/i }))

    await user.keyboard('{Escape}')
    // Vaul keeps the dialog mounted for exit animations; wait for closed state
    await waitFor(() =>
      expect(screen.getByRole('dialog')).toHaveAttribute(
        'data-state',
        'closed',
      ),
    )

    // Draft was not committed — closing without Apply must not call setSorting
    expect(setSorting).not.toHaveBeenCalled()
  })
})
