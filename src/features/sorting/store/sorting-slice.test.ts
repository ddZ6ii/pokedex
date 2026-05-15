import { describe, expect, it } from 'vitest'
import { create } from 'zustand'

import {
  createSortingSlice,
  initialSortingState,
  type SortingSlice,
} from '@/features/sorting/store/sorting-slice'

function makeStore() {
  return create<SortingSlice>()((...a) => createSortingSlice(...a))
}

describe('initialSortingState', () => {
  it('has null sortBy and sortOrder', () => {
    expect(initialSortingState).toEqual({ sortBy: null, sortOrder: null })
  })
})

describe('sortingActions', () => {
  describe('setSorting', () => {
    it('updates sortBy and sortOrder', () => {
      const store = makeStore()
      store.getState().sortingActions.setSorting('name', 'asc')
      expect(store.getState().sortBy).toBe('name')
      expect(store.getState().sortOrder).toBe('asc')
    })

    it('overwrites previous values on successive calls', () => {
      const store = makeStore()
      store.getState().sortingActions.setSorting('name', 'asc')
      store.getState().sortingActions.setSorting('hp', 'desc')
      expect(store.getState().sortBy).toBe('hp')
      expect(store.getState().sortOrder).toBe('desc')
    })

    it('accepts null for both arguments', () => {
      const store = makeStore()
      store.getState().sortingActions.setSorting('name', 'asc')
      store.getState().sortingActions.setSorting(null, null)
      expect(store.getState().sortBy).toBeNull()
      expect(store.getState().sortOrder).toBeNull()
    })
  })

  describe('resetSorting', () => {
    it('resets sortBy and sortOrder to null', () => {
      const store = makeStore()
      store.getState().sortingActions.setSorting('name', 'desc')
      store.getState().sortingActions.resetSorting()
      expect(store.getState().sortBy).toBeNull()
      expect(store.getState().sortOrder).toBeNull()
    })

    it('is a no-op when already at initial state', () => {
      const store = makeStore()
      store.getState().sortingActions.resetSorting()
      expect(store.getState()).toMatchObject(initialSortingState)
    })
  })
})
