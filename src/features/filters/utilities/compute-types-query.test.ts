import { describe, expect, it } from 'vitest'

import { computeTypesQuery } from './compute-types-query'

describe('computeTypesQuery', () => {
  it('returns null for null types', () => {
    expect(computeTypesQuery(null)).toBeNull()
  })

  it('returns null for empty set', () => {
    expect(computeTypesQuery(new Set())).toBeNull()
  })

  it('returns OR conditions for both primary and secondary type for a single type', () => {
    expect(computeTypesQuery(new Set(['fire']))).toEqual({
      or: [
        { primary_type: { eq: 'fire' } },
        { secondary_type: { eq: 'fire' } },
      ],
    })
  })

  it('returns OR conditions for all types when multiple types selected', () => {
    expect(computeTypesQuery(new Set(['fire', 'water']))).toEqual({
      or: [
        { primary_type: { eq: 'fire' } },
        { secondary_type: { eq: 'fire' } },
        { primary_type: { eq: 'water' } },
        { secondary_type: { eq: 'water' } },
      ],
    })
  })
})
