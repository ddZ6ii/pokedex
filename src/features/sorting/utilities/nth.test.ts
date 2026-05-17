import { describe, expect, it } from 'vitest'

import { nth } from '@/features/sorting/utilities/nth'

describe('nth', () => {
  it('returns first element by default', () => {
    expect(nth([1, 2, 3])).toBe(1)
  })

  it('returns element at given index', () => {
    expect(nth(['a', 'b', 'c'], 2)).toBe('c')
  })

  it('returns falsy values (0, false, empty string)', () => {
    expect(nth([0])).toBe(0)
    expect(nth([false])).toBe(false)
    expect(nth([''])).toBe('')
  })

  it('throws when array is empty', () => {
    expect(() => nth([])).toThrow('No item at index 0')
  })

  it('throws when index is out of bounds', () => {
    expect(() => nth([1, 2], 5)).toThrow('No item at index 5')
  })
})
