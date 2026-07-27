import { create } from 'zustand'
import { persist, type StorageValue } from 'zustand/middleware'

import { StorageSchema, type PersistedStoreState } from '@/shared/schemas'
import { createModeSlice, type ModeSlice } from '@/shared/store/mode-slice'
import { toggleMode } from '@/shared/utilities'

type StoreState = ModeSlice

const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createModeSlice(...a),
    }),
    {
      name: 'pokedex-store',
      version: 4,
      // `perPage`/`sort` used to live here; they're sourced from the URL now
      // (see `/pokemons`'s route search). The old version-based migrations
      // only ever added defaults for those two fields, so there is nothing
      // left to migrate — a persisted payload from an older version still
      // parses fine below (`StorageSchema` silently drops unknown keys),
      // it just no longer restores the two fields that moved to the URL.
      migrate: (persistedState) => persistedState,
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
      // - `isDarkMode` is derived from mode + current system preference (-> not persisted)
      partialize: (state) => ({
        mode: state.mode,
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

export { useMode, useModeActions }
