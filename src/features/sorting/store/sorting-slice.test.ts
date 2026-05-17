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
    expect(initialSortingState).toEqual({ sort: [[null, null]] })
  })
})

describe('sortingActions', () => {
  describe('setSorting', () => {
    it('updates sort', () => {
      const store = makeStore()
      store.getState().sortingActions.setSorting([['name', 'asc']])
      expect(store.getState().sort).toEqual([['name', 'asc']])
    })

    it('overwrites previous values on successive calls', () => {
      const store = makeStore()
      store.getState().sortingActions.setSorting([['name', 'asc']])
      store.getState().sortingActions.setSorting([['hp', 'desc']])
      expect(store.getState().sort).toEqual([['hp', 'desc']])
    })

    it('accepts null for both arguments', () => {
      const store = makeStore()
      store.getState().sortingActions.setSorting([['name', 'asc']])
      store.getState().sortingActions.setSorting([[null, null]])
      expect(store.getState().sort).toEqual([[null, null]])
    })
  })

  describe('resetSorting', () => {
    it('resets sort to initial state', () => {
      const store = makeStore()
      store.getState().sortingActions.setSorting([['name', 'desc']])
      store.getState().sortingActions.resetSorting()
      expect(store.getState().sort).toEqual([[null, null]])
    })

    it('is a no-op when already at initial state', () => {
      const store = makeStore()
      store.getState().sortingActions.resetSorting()
      expect(store.getState()).toMatchObject(initialSortingState)
    })
  })
})
