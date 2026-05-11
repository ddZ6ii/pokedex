import { describe, expect, it } from 'vitest'

import { POKEMON_SKILLS } from '@/features/pokemons/schemas'
import {
  APIParamsSchema,
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

describe('APIParamsSchema', () => {
  it('returns default params when input is undefined', () => {
    expect(APIParamsSchema.parse(undefined)).toEqual({
      _page: '1',
      _per_page: '10',
    })
  })

  it('returns default params when input is empty object', () => {
    expect(APIParamsSchema.parse({})).toEqual({
      _page: '1',
      _per_page: '10',
    })
  })

  it('maps page and perPage to string params', () => {
    const result = APIParamsSchema.parse({ page: 3, perPage: 50 })
    expect(result._page).toBe('3')
    expect(result._per_page).toBe('50')
  })

  it('includes name:contains when search is provided', () => {
    const result = APIParamsSchema.parse({ search: 'char' })
    expect(result['name:contains']).toBe('char')
  })

  it('omits name:contains when search is empty string', () => {
    const result = APIParamsSchema.parse({ search: '' })
    expect(result).not.toHaveProperty('name:contains')
  })

  it('omits _sort when sortBy is null', () => {
    const result = APIParamsSchema.parse({ sortBy: null })
    expect(result).not.toHaveProperty('_sort')
  })

  it('sets _sort to field name when sortOrder is "asc"', () => {
    const result = APIParamsSchema.parse({ sortBy: 'name', sortOrder: 'asc' })
    expect(result._sort).toBe('name')
  })

  it('sets _sort to "-field" when sortOrder is "desc"', () => {
    const result = APIParamsSchema.parse({ sortBy: 'name', sortOrder: 'desc' })
    expect(result._sort).toBe('-name')
  })

  it.each(POKEMON_SKILLS)('sorts by skill "%s" ascending', (skill) => {
    const result = APIParamsSchema.parse({ sortBy: skill, sortOrder: 'asc' })
    expect(result._sort).toBe(skill)
  })

  it.each(POKEMON_SKILLS)('sorts by skill "%s" descending', (skill) => {
    const result = APIParamsSchema.parse({ sortBy: skill, sortOrder: 'desc' })
    expect(result._sort).toBe(`-${skill}`)
  })
})
