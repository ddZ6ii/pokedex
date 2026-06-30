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
  it('has page 1, perPage 10, empty search, and null stats/types', () => {
    expect(initialFilterState).toEqual({
      page: 1,
      perPage: 10,
      search: '',
      stats: null,
      types: null,
    })
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

  describe('setStats', () => {
    it('updates stats', () => {
      const store = makeStore()
      store.getState().filterActions.setStats({ hp: [10, 90] })
      expect(store.getState().stats).toEqual({ hp: [10, 90] })
    })

    it('resets page to 1', () => {
      const store = makeStore()
      store.getState().filterActions.setPage(3)
      store.getState().filterActions.setStats({ hp: [10, 90] })
      expect(store.getState().page).toBe(1)
    })
  })

  describe('resetStats', () => {
    it('clears stats to null', () => {
      const store = makeStore()
      store.getState().filterActions.setStats({ hp: [10, 90] })
      store.getState().filterActions.resetStats()
      expect(store.getState().stats).toBeNull()
    })

    it('resets page to 1', () => {
      const store = makeStore()
      store.getState().filterActions.setPage(3)
      store.getState().filterActions.resetStats()
      expect(store.getState().page).toBe(1)
    })
  })

  describe('setTypes', () => {
    it('updates types', () => {
      const store = makeStore()
      store.getState().filterActions.setTypes(new Set(['Fire', 'Water']))
      expect(store.getState().types).toEqual(new Set(['Fire', 'Water']))
    })

    it('resets page to 1', () => {
      const store = makeStore()
      store.getState().filterActions.setPage(3)
      store.getState().filterActions.setTypes(new Set(['Grass']))
      expect(store.getState().page).toBe(1)
    })
  })

  describe('resetTypes', () => {
    it('clears types to null', () => {
      const store = makeStore()
      store.getState().filterActions.setTypes(new Set(['Fire']))
      store.getState().filterActions.resetTypes()
      expect(store.getState().types).toBeNull()
    })

    it('resets page to 1', () => {
      const store = makeStore()
      store.getState().filterActions.setPage(3)
      store.getState().filterActions.resetTypes()
      expect(store.getState().page).toBe(1)
    })
  })
})
