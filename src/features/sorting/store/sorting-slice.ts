import type { StateCreator } from 'zustand'

import type { Sorting } from '@/features/sorting/schemas'

type SortingActions = {
  sortingActions: {
    setSorting: (
      nextSortBy: Sorting['sortBy'],
      nextSortOrder: Sorting['sortOrder'],
    ) => void
    resetSorting: () => void
  }
}
type SortingSlice = Sorting & SortingActions

const initialSortingState: Sorting = {
  sortOrder: null,
  sortBy: null,
}

const createSortingSlice: StateCreator<SortingSlice, [], [], SortingSlice> = (
  set,
) => ({
  // Initial default values (overriden by persisted values if any)
  ...initialSortingState,
  sortingActions: {
    setSorting: (nextSortBy, nextSortOrder) => {
      set({ sortBy: nextSortBy, sortOrder: nextSortOrder })
    },
    resetSorting: () => {
      set({
        sortBy: initialSortingState.sortBy,
        sortOrder: initialSortingState.sortOrder,
      })
    },
  },
})

export { createSortingSlice, initialSortingState, type SortingSlice }
