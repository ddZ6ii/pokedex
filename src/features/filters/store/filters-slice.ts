import type { StateCreator } from 'zustand'

import type { Filters } from '@/features/filters/schemas'

type FilterActions = {
  filterActions: {
    setPage: (nextPage: Filters['page']) => void
    setPerPage: (nextPerPage: Filters['perPage']) => void
    setSearch: (nextSearch: Filters['search']) => void
    setStats: (nextStats: Filters['stats']) => void
    resetStats: () => void
  }
}
type FilterSlice = Filters & FilterActions

const initialFilterState: Filters = {
  page: 1,
  perPage: 10,
  search: '',
}

const createFilterSlice: StateCreator<FilterSlice, [], [], FilterSlice> = (
  set,
) => ({
  // Initial default values (overriden by persisted values if any)
  ...initialFilterState,
  filterActions: {
    setPage: (nextPage) => {
      set({ page: nextPage })
    },
    setPerPage: (nextPerPage) => {
      set({ perPage: nextPerPage, page: initialFilterState.page })
    },
    setSearch: (nextSearch) => {
      set({ search: nextSearch, page: initialFilterState.page })
    },
    setStats: (nextStats) => {
      if (!nextStats || Object.keys(nextStats).length === 0) return
      set({ stats: nextStats, page: initialFilterState.page })
    },
    resetStats: () => {
      set({ stats: undefined, page: initialFilterState.page })
    },
  },
})

export { createFilterSlice, initialFilterState, type FilterSlice }
