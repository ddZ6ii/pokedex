import { describe, expect, it } from 'vitest'
import { create } from 'zustand'

import {
  createFilterSlice,
  initialFilterState,
  type FilterSlice,
} from '@/features/filters/store/filters-slice'

function makeStore() {
  return create<FilterSlice>()((...a) => createFilterSlice(...a))
}

describe('initialFilterState', () => {
  it('has page 1, perPage 10, and empty search', () => {
    expect(initialFilterState).toEqual({ page: 1, perPage: 10, search: '' })
  })
})

describe('filterActions', () => {
  describe('setPage', () => {
    it('updates page', () => {
      const store = makeStore()
      store.getState().filterActions.setPage(3)
      expect(store.getState().page).toBe(3)
    })

    it('does not reset perPage or search', () => {
      const store = makeStore()
      store.getState().filterActions.setPerPage(20)
      store.getState().filterActions.setSearch('pikachu')
      store.getState().filterActions.setPage(2)
      expect(store.getState().perPage).toBe(20)
      expect(store.getState().search).toBe('pikachu')
    })
  })

  describe('setPerPage', () => {
    it('updates perPage', () => {
      const store = makeStore()
      store.getState().filterActions.setPerPage(50)
      expect(store.getState().perPage).toBe(50)
    })

    it('resets page to 1', () => {
      const store = makeStore()
      store.getState().filterActions.setPage(5)
      store.getState().filterActions.setPerPage(20)
      expect(store.getState().page).toBe(1)
    })
  })

  describe('setSearch', () => {
    it('updates search', () => {
      const store = makeStore()
      store.getState().filterActions.setSearch('bulbasaur')
      expect(store.getState().search).toBe('bulbasaur')
    })

    it('resets page to 1', () => {
      const store = makeStore()
      store.getState().filterActions.setPage(4)
      store.getState().filterActions.setSearch('charmander')
      expect(store.getState().page).toBe(1)
    })
  })
})
