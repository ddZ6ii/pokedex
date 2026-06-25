import { create } from 'zustand'
import { persist, type StorageValue } from 'zustand/middleware'
import { useShallow } from 'zustand/shallow'

import {
  createFilterSlice,
  initialFilterState,
  type FilterSlice,
} from '@/features/filters/store'
import {
  createSortingSlice,
  initialSortingState,
  type SortingSlice,
} from '@/features/sorting/store'
import { StorageSchema, type PersistedStoreState } from '@/shared/schemas'
import { createModeSlice, type ModeSlice } from '@/shared/store/mode-slice'
import { toggleMode } from '@/shared/utilities'

type StoreState = ModeSlice & FilterSlice & SortingSlice

const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createModeSlice(...a),
      ...createFilterSlice(...a),
      ...createSortingSlice(...a),
    }),
    {
      name: 'pokedex-store',
      version: 3,
      migrate: (persistedState, version) => {
        if (version === 0) {
          return {
            ...(persistedState as object),
            perPage: initialFilterState.perPage,
            sort: initialSortingState.sort,
          }
        }
        if (version === 1 || version === 2) {
          return {
            ...(persistedState as object),
            sort: initialSortingState.sort,
          }
        }
        return persistedState
      },
      // Custom storage adapter to extend base implementation with runtime validation (null → falls back to initialState)
      storage: {
        getItem: (name): StorageValue<PersistedStoreState['state']> | null => {
          const stored = localStorage.getItem(name)
          if (!stored) return null
          try {
            const parsed: unknown = JSON.parse(stored)
            const result = StorageSchema.safeParse(parsed)
            return result.success ? result.data : null
          } catch {
            return null
          }
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value))
        },
        removeItem: (name) => {
          localStorage.removeItem(name)
        },
      },
      // Only persist a subset of the store state:
      // - `page`, `search` and `stats` are transient (-> not persisted)
      // - `isDarkMode` is derived from mode + current system preference (-> not persisted)
      partialize: (state) => ({
        mode: state.mode,
        perPage: state.perPage,
        sort: state.sort,
      }),
      // Recompute `isDarkMode` on rehydration (sync, before first paint) to avoid a flash of the wrong theme on load.
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const isDarkMode =
          state.mode === 'dark' ||
          (state.mode === 'system' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
        state.isDarkMode = isDarkMode
        toggleMode(state.mode)
      },
    },
  ),
)

// Mode slice selectors
const useMode = () => useStore((state) => state.mode)
const useModeActions = () => useStore((state) => state.modeActions)

// Filter slice selectors
const usePage = () => useStore((state) => state.page)
const usePerPage = () => useStore((state) => state.perPage)
const usePaginationFilters = () =>
  useStore(
    useShallow((state) => ({ page: state.page, perPage: state.perPage })),
  )
const useStatsFilters = () =>
  useStore(useShallow((state) => ({ stats: state.stats })))
const useFiltersActions = () => useStore((state) => state.filterActions)

// Sorting slice selectors
const useSorting = () => useStore((state) => state.sort)
const useSortingActions = () => useStore((state) => state.sortingActions)

// Query params (mixed slices) selectors
const useQueryParams = () =>
  useStore(
    useShallow((state) => ({
      page: state.page,
      perPage: state.perPage,
      search: state.search,
      sort: state.sort,
      stats: state.stats,
    })),
  )

export {
  useFiltersActions,
  useMode,
  useModeActions,
  usePage,
  usePaginationFilters,
  usePerPage,
  useQueryParams,
  useSorting,
  useSortingActions,
  useStatsFilters,
}
