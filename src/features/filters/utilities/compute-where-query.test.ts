import { describe, expect, it } from 'vitest'

import type { StatsQuery } from './compute-stats-query'
import { type TypesQuery } from './compute-types-query'
import { computeWhereQuery } from './compute-where-query'

const fireTypes: TypesQuery = {
  or: [{ primary_type: { eq: 'fire' } }, { secondary_type: { eq: 'fire' } }],
}

describe('computeWhereQuery', () => {
  it('includes type OR conditions', () => {
    expect(JSON.parse(computeWhereQuery(undefined, {}, fireTypes))).toEqual({
      or: [
        { primary_type: { eq: 'fire' } },
        { secondary_type: { eq: 'fire' } },
      ],
    })
  })

  it('includes name filter when search is provided', () => {
    expect(JSON.parse(computeWhereQuery('bulba', {}, fireTypes))).toEqual({
      name: { contains: 'bulba' },
      or: [
        { primary_type: { eq: 'fire' } },
        { secondary_type: { eq: 'fire' } },
      ],
    })
  })

  it('omits name filter when search is empty string', () => {
    expect(JSON.parse(computeWhereQuery('', {}, fireTypes))).toEqual({
      or: [
        { primary_type: { eq: 'fire' } },
        { secondary_type: { eq: 'fire' } },
      ],
    })
  })

  it('includes a single stat condition', () => {
    const stats: StatsQuery = { hp: { gte: 50 } }
    expect(JSON.parse(computeWhereQuery(undefined, stats, fireTypes))).toEqual({
      hp: { gte: 50 },
      or: [
        { primary_type: { eq: 'fire' } },
        { secondary_type: { eq: 'fire' } },
      ],
    })
  })

  it('includes multiple operators for the same stat field', () => {
    const stats: StatsQuery = { hp: { gte: 50, lte: 100 } }
    expect(JSON.parse(computeWhereQuery(undefined, stats, fireTypes))).toEqual({
      hp: { gte: 50, lte: 100 },
      or: [
        { primary_type: { eq: 'fire' } },
        { secondary_type: { eq: 'fire' } },
      ],
    })
  })

  it('handles multiple distinct stat fields', () => {
    const stats: StatsQuery = { hp: { gte: 40 }, attack: { lte: 80 } }
    expect(JSON.parse(computeWhereQuery(undefined, stats, fireTypes))).toEqual({
      hp: { gte: 40 },
      attack: { lte: 80 },
      or: [
        { primary_type: { eq: 'fire' } },
        { secondary_type: { eq: 'fire' } },
      ],
    })
  })

  it('combines search, stats, and types together', () => {
    const waterTypes: TypesQuery = {
      or: [
        { primary_type: { eq: 'water' } },
        { secondary_type: { eq: 'water' } },
      ],
    }
    const stats: StatsQuery = { speed: { gte: 30 } }
    expect(JSON.parse(computeWhereQuery('squirt', stats, waterTypes))).toEqual({
      name: { contains: 'squirt' },
      speed: { gte: 30 },
      or: [
        { primary_type: { eq: 'water' } },
        { secondary_type: { eq: 'water' } },
      ],
    })
  })
})
