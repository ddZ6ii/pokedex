import { describe, expect, it } from 'vitest'

import { hasSortingApplied } from '@/features/sorting/utilities/has-sorting-applied'

describe('hasSortingApplied', () => {
  it('returns false for empty criteria', () => {
    expect(hasSortingApplied([])).toBe(false)
  })

  it('returns true when all criteria are fully specified', () => {
    expect(hasSortingApplied([['name', 'asc']])).toBe(true)
  })

  it('returns true for multiple fully specified criteria', () => {
    expect(
      hasSortingApplied([
        ['name', 'asc'],
        ['hp', 'desc'],
      ]),
    ).toBe(true)
  })

  it('returns false when sortBy is null', () => {
    expect(hasSortingApplied([[null, 'asc']])).toBe(false)
  })

  it('returns false when sortOrder is null', () => {
    expect(hasSortingApplied([['name', null]])).toBe(false)
  })

  it('returns false when both fields are null', () => {
    expect(hasSortingApplied([[null, null]])).toBe(false)
  })

  it('returns false when any criterion is incomplete', () => {
    expect(
      hasSortingApplied([
        ['name', 'asc'],
        [null, 'desc'],
      ]),
    ).toBe(false)
  })
})
