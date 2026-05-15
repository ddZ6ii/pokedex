import { describe, expect, it } from 'vitest'

import { POKEMON_SKILLS } from '@/features/pokemons/schemas'
import {
  FilterSchema,
  PER_PAGE_OPTIONS,
  type Filters,
} from '@/features/filters/schemas/filter.schema'

const validFilterInput: Filters = {
  page: 2,
  perPage: 20,
  search: 'bulba',
  sortBy: 'name',
  sortOrder: 'desc',
}

describe('FilterSchema', () => {
  it('parses a full valid input', () => {
    expect(FilterSchema.parse(validFilterInput)).toEqual({
      page: 2,
      perPage: 20,
      search: 'bulba',
      sortBy: 'name',
      sortOrder: 'desc',
    })
  })

  it('defaults page to 1', () => {
    expect(FilterSchema.parse({}).page).toBe(1)
  })

  it('defaults perPage to 10', () => {
    expect(FilterSchema.parse({}).perPage).toBe(10)
  })

  it('defaults sortBy to null', () => {
    expect(FilterSchema.parse({}).sortBy).toBeNull()
  })

  it('defaults sortOrder to null', () => {
    expect(FilterSchema.parse({}).sortOrder).toBeNull()
  })

  it('omits search when not provided', () => {
    expect(FilterSchema.parse({}).search).toBeUndefined()
  })

  it.each(PER_PAGE_OPTIONS)('accepts perPage %s', (perPage) => {
    expect(() =>
      FilterSchema.parse({ perPage: Number(perPage.value) }),
    ).not.toThrow()
  })

  it('rejects invalid perPage', () => {
    expect(() => FilterSchema.parse({ perPage: 37 })).toThrow()
  })

  it('accepts sortBy "name"', () => {
    expect(() => FilterSchema.parse({ sortBy: 'name' })).not.toThrow()
  })

  it.each(POKEMON_SKILLS)('accepts sortBy skill "%s"', (skill) => {
    expect(() => FilterSchema.parse({ sortBy: skill })).not.toThrow()
  })

  it('rejects invalid sortBy', () => {
    expect(() => FilterSchema.parse({ sortBy: 'weight' })).toThrow()
  })

  it('rejects invalid sortOrder', () => {
    expect(() => FilterSchema.parse({ sortOrder: 'random' })).toThrow()
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
