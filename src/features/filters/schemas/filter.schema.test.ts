import { describe, expect, it } from 'vitest'

import {
  FilterSchema,
  MAX_STAT_VALUE,
  MIN_STAT_VALUE,
  PER_PAGE_OPTIONS,
  type Filters,
} from '@/features/filters/schemas/filter.schema'

const validFilterInput: Filters = {
  page: 2,
  perPage: 20,
  search: 'bulba',
}

describe('FilterSchema', () => {
  it('parses a full valid input', () => {
    expect(FilterSchema.parse(validFilterInput)).toEqual({
      page: 2,
      perPage: 20,
      search: 'bulba',
    })
  })

  describe('pagination', () => {
    it('defaults page to 1', () => {
      expect(FilterSchema.parse({}).page).toBe(1)
    })

    it('defaults perPage to 10', () => {
      expect(FilterSchema.parse({}).perPage).toBe(10)
    })

    it.each(PER_PAGE_OPTIONS)('accepts perPage %s', (perPage) => {
      expect(() =>
        FilterSchema.parse({ perPage: Number(perPage.value) }),
      ).not.toThrow()
    })

    it('rejects invalid perPage', () => {
      expect(() => FilterSchema.parse({ perPage: 37 })).toThrow()
    })

    it('rejects page 0', () => {
      expect(() => FilterSchema.parse({ page: 0 })).toThrow()
    })

    it('rejects negative page', () => {
      expect(() => FilterSchema.parse({ page: -1 })).toThrow()
    })

    it('rejects non-integer page', () => {
      expect(() => FilterSchema.parse({ page: 1.5 })).toThrow()
    })
  })

  describe('search', () => {
    it('omits search when not provided', () => {
      expect(FilterSchema.parse({}).search).toBeUndefined()
    })
  })

  describe('stats', () => {
    it('omits stats when not provided', () => {
      expect(FilterSchema.parse({}).stats).toBeUndefined()
    })

    it('accepts a partial stats object', () => {
      expect(() => FilterSchema.parse({ stats: { hp: [0, 50] } })).not.toThrow()
    })

    it('accepts a full stats object', () => {
      expect(() =>
        FilterSchema.parse({
          stats: {
            hp: [0, 100],
            attack: [10, 90],
            defense: [20, 80],
            speed: [30, 70],
          },
        }),
      ).not.toThrow()
    })

    it('defaults stat range min to MIN_STAT_VALUE', () => {
      const result = FilterSchema.parse({
        stats: { hp: [undefined, 50] as unknown as [number, number] },
      })
      expect(result.stats?.hp?.[0]).toBe(MIN_STAT_VALUE)
    })

    it('defaults stat range max to MAX_STAT_VALUE', () => {
      const result = FilterSchema.parse({
        stats: { hp: [0, undefined] as unknown as [number, number] },
      })
      expect(result.stats?.hp?.[1]).toBe(MAX_STAT_VALUE)
    })

    it('rejects stat value below MIN_STAT_VALUE', () => {
      expect(() => FilterSchema.parse({ stats: { hp: [-1, 100] } })).toThrow()
    })

    it('rejects stat value above MAX_STAT_VALUE', () => {
      expect(() => FilterSchema.parse({ stats: { hp: [0, 101] } })).toThrow()
    })
  })
})
