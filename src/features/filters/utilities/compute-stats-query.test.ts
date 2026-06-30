import { describe, expect, it } from 'vitest'

import {
  MAX_STAT_VALUE,
  MIN_STAT_VALUE,
} from '@/features/filters/schemas/filter.schema'

import { computeStatsQuery } from './compute-stats-query'

describe('computeStatsQuery', () => {
  it('returns empty object for null stats', () => {
    expect(computeStatsQuery(null)).toEqual({})
  })

  it('returns empty object for empty stats', () => {
    expect(computeStatsQuery({})).toEqual({})
  })

  it('emits eq when gte === lte', () => {
    expect(computeStatsQuery({ hp: [50, 50] })).toEqual({ hp: { eq: 50 } })
  })

  it('omits gte when gte equals MIN_STAT_VALUE', () => {
    expect(computeStatsQuery({ hp: [MIN_STAT_VALUE, 80] })).toEqual({
      hp: { lte: 80 },
    })
  })

  it('omits lte when lte equals MAX_STAT_VALUE', () => {
    expect(computeStatsQuery({ hp: [20, MAX_STAT_VALUE] })).toEqual({
      hp: { gte: 20 },
    })
  })

  it('emits both gte and lte when range is within bounds', () => {
    expect(computeStatsQuery({ hp: [20, 80] })).toEqual({
      hp: { gte: 20, lte: 80 },
    })
  })

  it('emits nothing when stat covers full range', () => {
    expect(computeStatsQuery({ hp: [MIN_STAT_VALUE, MAX_STAT_VALUE] })).toEqual(
      { hp: {} },
    )
  })

  it('handles multiple stats independently', () => {
    expect(
      computeStatsQuery({
        hp: [10, 90],
        attack: [MIN_STAT_VALUE, MAX_STAT_VALUE],
        defense: [50, 50],
      }),
    ).toEqual({
      hp: { gte: 10, lte: 90 },
      attack: {},
      defense: { eq: 50 },
    })
  })
})
