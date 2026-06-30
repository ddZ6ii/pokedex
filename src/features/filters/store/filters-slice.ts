import type { StateCreator } from 'zustand'

import type { Filters } from '@/features/filters/schemas'

type FilterActions = {
  filterActions: {
    setPage: (nextPage: Filters['page']) => void
    setPerPage: (nextPerPage: Filters['perPage']) => void
    setSearch: (nextSearch: Filters['search']) => void
    setStats: (nextStats: Filters['stats']) => void
    setTypes: (nextTypes: Filters['types']) => void
    resetStats: () => void
    resetTypes: () => void
  }
}
type FilterSlice = Filters & FilterActions

const initialFilterState: Filters = {
  page: 1,
  perPage: 10,
  search: '',
  stats: null,
  types: null,
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
      set({ stats: nextStats, page: initialFilterState.page })
    },
    setTypes: (nextTypes) => {
      set({ types: nextTypes, page: initialFilterState.page })
    },
    resetStats: () => {
      set({ stats: initialFilterState.stats, page: initialFilterState.page })
    },
    resetTypes: () => {
      set({ types: initialFilterState.types, page: initialFilterState.page })
    },
  },
})

export { createFilterSlice, initialFilterState, type FilterSlice }
