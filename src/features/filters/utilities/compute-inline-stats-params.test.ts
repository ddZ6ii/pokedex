import { describe, expect, it } from 'vitest'

import { computeInlineStatsParams } from './compute-inline-stats-params'

describe('computeInlineStatsParams', () => {
  it('emits :eq for an exact condition', () => {
    expect(computeInlineStatsParams({ hp: { eq: 50 } })).toEqual({
      'hp:eq': '50',
    })
  })

  it('emits :gte only when gte is present', () => {
    expect(computeInlineStatsParams({ hp: { gte: 20 } })).toEqual({
      'hp:gte': '20',
    })
  })

  it('emits :lte only when lte is present', () => {
    expect(computeInlineStatsParams({ hp: { lte: 80 } })).toEqual({
      'hp:lte': '80',
    })
  })

  it('emits both :gte and :lte when both are present', () => {
    expect(computeInlineStatsParams({ hp: { gte: 20, lte: 80 } })).toEqual({
      'hp:gte': '20',
      'hp:lte': '80',
    })
  })

  it('emits nothing for an empty range condition', () => {
    expect(computeInlineStatsParams({ hp: {} })).toEqual({})
  })
})
