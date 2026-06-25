import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { SortingPanelContent } from '@/features/sorting/components/sorting-panel-content'
import {
  SORT_BY_OPTIONS,
  type SortingCriterion,
} from '@/features/sorting/schemas/sorting.schema'
import { renderWithProviders } from '@/tests/utilities'
import { nth } from '@/shared/utilities/nth'

const SELECT_SORTING_CRITERIA_LABEL = /select sorting criteria/i
const SELECT_SORTING_ORDER_LABEL = /select sorting order/i

const DEFAULT_CRITERIA: SortingCriterion[] = [[null, null]]

function Wrapper({
  initialCriteria = DEFAULT_CRITERIA,
  onChange,
}: {
  initialCriteria?: SortingCriterion[]
  onChange?: (criteria: SortingCriterion[]) => void
}) {
  const [selectedCriteria, setSelectedCriteria] =
    useState<SortingCriterion[]>(initialCriteria)

  const handleSet: React.Dispatch<React.SetStateAction<SortingCriterion[]>> = (
    value,
  ) => {
    setSelectedCriteria((prev) => {
      const next = typeof value === 'function' ? value(prev) : value
      onChange?.(next)
      return next
    })
  }

  return (
    <SortingPanelContent
      selectedCriteria={selectedCriteria}
      setSelectedCriteria={handleSet}
    />
  )
}

describe('SortingPanelContent', () => {
  describe('initial rendering', () => {
    it('renders "Sort by" and "Order by" comboboxes', () => {
      renderWithProviders(<Wrapper />)

      expect(
        screen.getByRole('combobox', { name: SELECT_SORTING_CRITERIA_LABEL }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('combobox', { name: SELECT_SORTING_ORDER_LABEL }),
      ).toBeInTheDocument()
    })

    it('shows one empty "Sort by" row', () => {
      renderWithProviders(<Wrapper />)

      expect(
        screen.getAllByRole('combobox', {
          name: SELECT_SORTING_CRITERIA_LABEL,
        }),
      ).toHaveLength(1)
    })

    it('"Order by" is disabled when no sort criterion is selected', () => {
      renderWithProviders(<Wrapper />)

      expect(
        screen.getByRole('combobox', { name: SELECT_SORTING_ORDER_LABEL }),
      ).toBeDisabled()
    })

    it('renders "Add criteria" button', () => {
      renderWithProviders(<Wrapper />)

      expect(
        screen.getByRole('button', { name: /add new criteria/i }),
      ).toBeInTheDocument()
    })

    it('"Remove criteria" button on the first row has the "hidden" class', () => {
      renderWithProviders(<Wrapper />)

      const removeButtons = screen.getAllByRole('button', {
        name: /remove criteria/i,
      })
      expect(removeButtons[0]).toHaveClass('hidden')
    })
  })

  describe('Sort by select', () => {
    it('selecting a criterion defaults order to "asc"', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      renderWithProviders(<Wrapper onChange={onChange} />)

      await user.click(
        screen.getByRole('combobox', { name: SELECT_SORTING_CRITERIA_LABEL }),
      )
      await user.click(await screen.findByRole('option', { name: /^name$/i }))

      expect(onChange).toHaveBeenCalledWith([['name', 'asc']])
    })

    it('preserves "Order by" when changing sort-by on a filled row', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      renderWithProviders(
        <Wrapper initialCriteria={[['name', 'desc']]} onChange={onChange} />,
      )

      await user.click(
        screen.getByRole('combobox', { name: SELECT_SORTING_CRITERIA_LABEL }),
      )
      await user.click(await screen.findByRole('option', { name: /^hp$/i }))

      expect(onChange).toHaveBeenCalledWith([['hp', 'desc']])
    })

    it('clearing sort-by on the first row resets it to empty', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      renderWithProviders(
        <Wrapper initialCriteria={[['name', 'asc']]} onChange={onChange} />,
      )

      await user.click(screen.getByRole('button', { name: /clear selection/i }))

      expect(onChange).toHaveBeenCalledWith([[null, null]])
    })

    it('clearing sort-by on a non-first row removes that row', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      renderWithProviders(
        <Wrapper
          initialCriteria={[
            ['name', 'asc'],
            ['hp', 'desc'],
          ]}
          onChange={onChange}
        />,
      )

      const clearButtons = screen.getAllByRole('button', {
        name: /clear selection/i,
      })
      await user.click(nth(clearButtons, 1))

      expect(onChange).toHaveBeenCalledWith([['name', 'asc']])
    })

    it('excludes options already selected in other rows', async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <Wrapper
          initialCriteria={[
            ['name', 'asc'],
            [null, null],
          ]}
        />,
      )

      const comboboxes = screen.getAllByRole('combobox', {
        name: SELECT_SORTING_CRITERIA_LABEL,
      })
      await user.click(nth(comboboxes, 1))

      expect(
        screen.queryByRole('option', { name: /^name$/i }),
      ).not.toBeInTheDocument()
    })

    it("includes the row's own current value in its options", async () => {
      const user = userEvent.setup()
      renderWithProviders(
        <Wrapper
          initialCriteria={[
            ['name', 'asc'],
            ['hp', 'desc'],
          ]}
        />,
      )

      const comboboxes = screen.getAllByRole('combobox', {
        name: SELECT_SORTING_CRITERIA_LABEL,
      })
      await user.click(nth(comboboxes, 0))

      expect(
        await screen.findByRole('option', { name: /^name$/i }),
      ).toBeInTheDocument()
    })
  })

  describe('Order by select', () => {
    it('is enabled after selecting a sort criterion', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Wrapper />)

      await user.click(
        screen.getByRole('combobox', { name: SELECT_SORTING_CRITERIA_LABEL }),
      )
      await user.click(await screen.findByRole('option', { name: /^name$/i }))

      expect(
        screen.getByRole('combobox', { name: SELECT_SORTING_ORDER_LABEL }),
      ).not.toBeDisabled()
    })

    it('changing order updates the criterion', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      renderWithProviders(
        <Wrapper initialCriteria={[['name', 'asc']]} onChange={onChange} />,
      )

      await user.click(
        screen.getByRole('combobox', { name: SELECT_SORTING_ORDER_LABEL }),
      )
      await user.click(
        await screen.findByRole('option', { name: /descending/i }),
      )

      expect(onChange).toHaveBeenCalledWith([['name', 'desc']])
    })
  })

  describe('Add criteria button', () => {
    it('is disabled when criteria has an empty row', () => {
      renderWithProviders(<Wrapper />)

      expect(
        screen.getByRole('button', { name: /add new criteria/i }),
      ).toBeDisabled()
    })

    it('is enabled when all existing rows are filled', () => {
      renderWithProviders(<Wrapper initialCriteria={[['name', 'asc']]} />)

      expect(
        screen.getByRole('button', { name: /add new criteria/i }),
      ).not.toBeDisabled()
    })

    it('appends a new empty row', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Wrapper initialCriteria={[['name', 'asc']]} />)

      await user.click(
        screen.getByRole('button', { name: /add new criteria/i }),
      )

      expect(
        screen.getAllByRole('combobox', {
          name: SELECT_SORTING_CRITERIA_LABEL,
        }),
      ).toHaveLength(2)
    })

    it('is disabled when all sort options are used', () => {
      const fullCriteria = SORT_BY_OPTIONS.map(
        (opt) => [opt.value, 'asc'] as SortingCriterion,
      )
      renderWithProviders(<Wrapper initialCriteria={fullCriteria} />)

      expect(
        screen.getByRole('button', { name: /add new criteria/i }),
      ).toBeDisabled()
    })
  })

  describe('Remove criteria button', () => {
    it('is not shown on the first row', () => {
      renderWithProviders(<Wrapper />)

      const removeButtons = screen.getAllByRole('button', {
        name: /remove criteria/i,
      })
      expect(removeButtons[0]).toHaveClass('hidden')
    })

    it('clicking removes the correct row', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      renderWithProviders(
        <Wrapper
          initialCriteria={[
            ['name', 'asc'],
            ['hp', 'desc'],
          ]}
          onChange={onChange}
        />,
      )

      const removeButtons = screen.getAllByRole('button', {
        name: /remove criteria/i,
      })
      await user.click(nth(removeButtons, 1))

      expect(onChange).toHaveBeenCalledWith([['name', 'asc']])
    })
  })
})
