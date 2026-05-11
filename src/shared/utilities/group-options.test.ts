import { describe, expect, it } from 'vitest'
import { groupOptions } from './group-options'
import type { SelectOption } from '@/shared/types'

type T = string

const opt = (label: string, group?: string): SelectOption<T> => ({
  label,
  value: label.toLowerCase(),
  ...(group !== undefined && { group }),
})

describe('groupOptions', () => {
  it('returns empty array for empty input', () => {
    expect(groupOptions([])).toEqual([])
  })

  it('merges consecutive ungrouped options into one group with undefined label', () => {
    const result = groupOptions([opt('A'), opt('B')])
    expect(result).toEqual([
      { label: undefined, options: [opt('A'), opt('B')] },
    ])
  })

  it('merges consecutive options sharing a group label', () => {
    const result = groupOptions([
      opt('A', 'G1'),
      opt('B', 'G1'),
      opt('C', 'G1'),
    ])
    expect(result).toEqual([
      {
        label: 'G1',
        options: [opt('A', 'G1'), opt('B', 'G1'), opt('C', 'G1')],
      },
    ])
  })

  it('creates separate groups for same label that is non-consecutive', () => {
    const result = groupOptions([
      opt('A', 'G1'),
      opt('B', 'G2'),
      opt('C', 'G1'),
    ])
    expect(result).toEqual([
      { label: 'G1', options: [opt('A', 'G1')] },
      { label: 'G2', options: [opt('B', 'G2')] },
      { label: 'G1', options: [opt('C', 'G1')] },
    ])
  })

  it('handles a single option', () => {
    const result = groupOptions([opt('A', 'G1')])
    expect(result).toEqual([{ label: 'G1', options: [opt('A', 'G1')] }])
  })

  it('handles mixed grouped and ungrouped options', () => {
    const result = groupOptions([
      opt('A'),
      opt('B', 'G1'),
      opt('C', 'G1'),
      opt('D'),
    ])
    expect(result).toEqual([
      { label: undefined, options: [opt('A')] },
      { label: 'G1', options: [opt('B', 'G1'), opt('C', 'G1')] },
      { label: undefined, options: [opt('D')] },
    ])
  })
})
