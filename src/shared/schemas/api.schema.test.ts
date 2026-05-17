import { describe, expect, it } from 'vitest'

import { POKEMON_SKILLS } from '@/features/pokemons/schemas'
import { ApiQueryParamsSchema } from '@/shared/schemas/api.schema'

describe('ApiQueryParamsSchema', () => {
  it('returns default params when input is undefined', () => {
    expect(ApiQueryParamsSchema.parse(undefined)).toEqual({
      _page: '1',
      _per_page: '10',
    })
  })

  it('returns default params when input is empty object', () => {
    expect(ApiQueryParamsSchema.parse({})).toEqual({
      _page: '1',
      _per_page: '10',
    })
  })

  it('maps page and perPage to string params', () => {
    const result = ApiQueryParamsSchema.parse({ page: 3, perPage: 50 })
    expect(result._page).toBe('3')
    expect(result._per_page).toBe('50')
  })

  it('includes name:contains when search is provided', () => {
    const result = ApiQueryParamsSchema.parse({ search: 'char' })
    expect(result['name:contains']).toBe('char')
  })

  it('omits name:contains when search is empty string', () => {
    const result = ApiQueryParamsSchema.parse({ search: '' })
    expect(result).not.toHaveProperty('name:contains')
  })

  it('omits _sort when sort is empty', () => {
    const result = ApiQueryParamsSchema.parse({ sort: [] })
    expect(result).not.toHaveProperty('_sort')
  })

  it('sets _sort to field name when sortOrder is "asc"', () => {
    const result = ApiQueryParamsSchema.parse({
      sort: [['name', 'asc']],
    })
    expect(result._sort).toBe('name')
  })

  it('sets _sort to "-field" when sortOrder is "desc"', () => {
    const result = ApiQueryParamsSchema.parse({
      sort: [['name', 'desc']],
    })
    expect(result._sort).toBe('-name')
  })

  it.each(POKEMON_SKILLS)('sorts by skill "%s" ascending', (skill) => {
    const result = ApiQueryParamsSchema.parse({
      sort: [[skill, 'asc']],
    })
    expect(result._sort).toBe(skill)
  })

  it.each(POKEMON_SKILLS)('sorts by skill "%s" descending', (skill) => {
    const result = ApiQueryParamsSchema.parse({
      sort: [[skill, 'desc']],
    })
    expect(result._sort).toBe(`-${skill}`)
  })
})
