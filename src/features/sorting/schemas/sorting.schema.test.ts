import { describe, expect, it } from 'vitest'

import { POKEMON_SKILLS } from '@/features/pokemons/schemas'
import {
  SortingSchema,
  type Sorting,
} from '@/features/sorting/schemas/sorting.schema'

const validSortingInput: Sorting = {
  sortBy: 'name',
  sortOrder: 'desc',
}

describe('SortingSchema', () => {
  it('parses a full valid input', () => {
    expect(SortingSchema.parse(validSortingInput)).toEqual({
      sortBy: 'name',
      sortOrder: 'desc',
    })
  })

  it('defaults sortBy to null', () => {
    expect(SortingSchema.parse({}).sortBy).toBeNull()
  })

  it('defaults sortOrder to null', () => {
    expect(SortingSchema.parse({}).sortOrder).toBeNull()
  })

  it('accepts sortBy "name"', () => {
    expect(() => SortingSchema.parse({ sortBy: 'name' })).not.toThrow()
  })

  it.each(POKEMON_SKILLS)('accepts sortBy skill "%s"', (skill) => {
    expect(() => SortingSchema.parse({ sortBy: skill })).not.toThrow()
  })

  it('rejects invalid sortBy', () => {
    expect(() => SortingSchema.parse({ sortBy: 'weight' })).toThrow()
  })

  it('rejects invalid sortOrder', () => {
    expect(() => SortingSchema.parse({ sortOrder: 'random' })).toThrow()
  })
})
