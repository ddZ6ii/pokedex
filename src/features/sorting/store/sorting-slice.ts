import type { StateCreator } from 'zustand'

import type {
  Sorting,
  SortingCriterion,
} from '@/features/sorting/schemas/sorting.schema'

type SortingActions = {
  sortingActions: {
    setSorting: (criteria: SortingCriterion[]) => void
    resetSorting: () => void
  }
}
type SortingSlice = Sorting & SortingActions

const initialSortingState: Sorting = {
  sort: [[null, null]], // no current sorting applied
}

const createSortingSlice: StateCreator<SortingSlice, [], [], SortingSlice> = (
  set,
) => ({
  // Initial default values (overriden by persisted values if any)
  ...initialSortingState,
  sortingActions: {
    setSorting: (criteria) => {
      set({ sort: criteria })
    },
    resetSorting: () => {
      set({
        sort: initialSortingState.sort,
      })
    },
  },
})

export { createSortingSlice, initialSortingState, type SortingSlice }
