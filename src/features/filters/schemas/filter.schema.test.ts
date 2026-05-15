import { describe, expect, it } from 'vitest'

import {
  FilterSchema,
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
})
