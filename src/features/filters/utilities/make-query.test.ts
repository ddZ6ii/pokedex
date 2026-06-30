import { describe, expect, it } from 'vitest'

import { makeQuery } from './make-query'
import type { Filters } from '@/features/filters/schemas'
import type { Sorting } from '@/features/sorting/schemas'

// makeQuery accepts Filters but reads `sort` via SortingSchema.parse internally
type TestInput = Filters & Partial<Sorting>

const base: TestInput = { page: 1, perPage: 10, stats: null, types: null }

describe('makeQuery', () => {
  describe('pagination', () => {
    it('includes _page and _per_page from defaults', () => {
      const result = makeQuery({ ...base })
      expect(result).toMatchObject({ _page: '1', _per_page: '10' })
    })

    it('forwards explicit page and perPage values', () => {
      const result = makeQuery({ ...base, page: 3, perPage: 50 })
      expect(result).toMatchObject({ _page: '3', _per_page: '50' })
    })
  })

  describe('sorting', () => {
    it('omits _sort when sort is undefined', () => {
      const result = makeQuery({ ...base })
      expect(result).not.toHaveProperty('_sort')
    })

    it('includes _sort when a complete sort criterion is provided', () => {
      const result = makeQuery({
        ...base,
        sort: [['name', 'asc']],
      } as TestInput)
      expect(result).toHaveProperty('_sort', 'name')
    })

    it('omits _sort when sort criterion is incomplete', () => {
      const result = makeQuery({ ...base, sort: [[null, 'asc']] } as TestInput)
      expect(result).not.toHaveProperty('_sort')
    })
  })

  describe('without types (inline params path)', () => {
    it('omits name:contains when search is absent', () => {
      const result = makeQuery({ ...base })
      expect(result).not.toHaveProperty('name:contains')
    })

    it('includes name:contains when search is provided', () => {
      const result = makeQuery({ ...base, search: 'bulba' })
      expect(result).toHaveProperty('name:contains', 'bulba')
    })

    it('includes inline stat params', () => {
      const result = makeQuery({ ...base, stats: { hp: [20, 80] } })
      expect(result).toMatchObject({ 'hp:gte': '20', 'hp:lte': '80' })
    })

    it('does not include _where', () => {
      const result = makeQuery({
        ...base,
        search: 'bulba',
        stats: { hp: [20, 80] },
      })
      expect(result).not.toHaveProperty('_where')
    })
  })

  describe('with types (_where path)', () => {
    const types = new Set(['fire'] as const)

    it('includes _where when types are provided', () => {
      const result = makeQuery({ ...base, types })
      expect(result).toHaveProperty('_where')
    })

    it('omits inline search and stat params when _where is used', () => {
      const result = makeQuery({
        ...base,
        types,
        search: 'char',
        stats: { hp: [10, 90] },
      })
      expect(result).not.toHaveProperty('name:contains')
      expect(result).not.toHaveProperty('hp:gte')
      expect(result).not.toHaveProperty('hp:lte')
    })

    it('_where encodes types as or-conditions', () => {
      const result = makeQuery({ ...base, types })
      const where: unknown = JSON.parse(
        (result as Record<string, unknown>)._where as string,
      )
      expect(where).toMatchObject({
        or: expect.arrayContaining([
          { primary_type: { eq: 'fire' } },
          { secondary_type: { eq: 'fire' } },
        ]) as unknown,
      })
    })

    it('_where includes search and stats alongside types', () => {
      const result = makeQuery({
        ...base,
        types,
        search: 'char',
        stats: { hp: [10, 90] },
      })
      const where: unknown = JSON.parse(
        (result as Record<string, unknown>)._where as string,
      )
      expect(where).toMatchObject({
        name: { contains: 'char' },
        hp: { gte: 10, lte: 90 },
      })
    })
  })

  describe('full combination', () => {
    it('combines sort, types, search, and stats correctly', () => {
      const result = makeQuery({
        page: 2,
        perPage: 20,
        sort: [['name', 'desc']],
        types: new Set(['water'] as const),
        search: 'squirt',
        stats: { speed: [30, 100] },
      } as TestInput)

      expect(result).toMatchObject({
        _page: '2',
        _per_page: '20',
        _sort: '-name',
      })
      expect(result).toHaveProperty('_where')
      expect(result).not.toHaveProperty('name:contains')

      const where: unknown = JSON.parse(
        (result as Record<string, unknown>)._where as string,
      )
      expect(where).toMatchObject({
        name: { contains: 'squirt' },
        speed: { gte: 30 },
        or: expect.arrayContaining([
          { primary_type: { eq: 'water' } },
        ]) as unknown,
      })
    })
  })
})
