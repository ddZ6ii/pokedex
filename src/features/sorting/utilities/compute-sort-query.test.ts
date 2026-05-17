import { describe, expect, it } from 'vitest'

import { computeSortQuery } from '@/features/sorting/utilities/compute-sort-query'

describe('computeSortQuery', () => {
  it('returns null for empty criteria', () => {
    expect(computeSortQuery([])).toBeNull()
  })

  it('returns null when sortBy is null', () => {
    expect(computeSortQuery([[null, 'asc']])).toBeNull()
  })

  it('returns null when sortOrder is null', () => {
    expect(computeSortQuery([['name', null]])).toBeNull()
  })

  it('returns null when any criterion is incomplete', () => {
    expect(
      computeSortQuery([
        ['name', 'asc'],
        [null, 'desc'],
      ]),
    ).toBeNull()
  })

  it('returns field name for a single ascending criterion', () => {
    expect(computeSortQuery([['name', 'asc']])).toBe('name')
  })

  it('returns prefixed field name for a single descending criterion', () => {
    expect(computeSortQuery([['name', 'desc']])).toBe('-name')
  })

  it('returns comma-separated fields for multiple criteria', () => {
    expect(
      computeSortQuery([
        ['name', 'asc'],
        ['hp', 'desc'],
      ]),
    ).toBe('name,-hp')
  })

  it('handles multiple ascending criteria', () => {
    expect(
      computeSortQuery([
        ['name', 'asc'],
        ['hp', 'asc'],
      ]),
    ).toBe('name,hp')
  })

  it('handles multiple descending criteria', () => {
    expect(
      computeSortQuery([
        ['name', 'desc'],
        ['hp', 'desc'],
      ]),
    ).toBe('-name,-hp')
  })
})
