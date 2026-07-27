import { describe, expect, it } from 'vitest'

import { POKEMON_SKILLS } from '@/features/pokemons/schemas'
import {
  SortingSchema,
  type Sorting,
} from '@/features/sorting/schemas/sorting.schema'

const validSortingInput: Sorting = {
  sort: [['name', 'desc']],
}

describe('SortingSchema', () => {
  it('parses a valid single criterion', () => {
    expect(SortingSchema.parse(validSortingInput)).toEqual({
      sort: [['name', 'desc']],
    })
  })

  it('parses multiple criteria', () => {
    const input: Sorting = {
      sort: [
        ['name', 'asc'],
        ['hp', 'desc'],
      ],
    }
    expect(SortingSchema.parse(input)).toEqual({
      sort: [
        ['name', 'asc'],
        ['hp', 'desc'],
      ],
    })
  })

  it('defaults sort to undefined', () => {
    expect(SortingSchema.parse({}).sort).toBeUndefined()
  })

  it('accepts null sortBy in a criterion', () => {
    expect(() => SortingSchema.parse({ sort: [[null, 'asc']] })).not.toThrow()
  })

  it('accepts null sortOrder in a criterion', () => {
    expect(() => SortingSchema.parse({ sort: [['name', null]] })).not.toThrow()
  })

  it('accepts sortBy "name"', () => {
    expect(() => SortingSchema.parse({ sort: [['name', 'asc']] })).not.toThrow()
  })

  it.each(POKEMON_SKILLS)('accepts sortBy skill "%s"', (skill) => {
    expect(() => SortingSchema.parse({ sort: [[skill, 'asc']] })).not.toThrow()
  })

  it('rejects invalid sortBy', () => {
    expect(() => SortingSchema.parse({ sort: [['weight', 'asc']] })).toThrow()
  })

  it('rejects invalid sortOrder', () => {
    expect(() => SortingSchema.parse({ sort: [['name', 'random']] })).toThrow()
  })

  it('parses an empty sort array', () => {
    expect(SortingSchema.parse({ sort: [] })).toEqual({ sort: [] })
  })
})
