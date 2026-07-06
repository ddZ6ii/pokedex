import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSortingPanel } from '@/features/sorting/hooks/useSortingPanel'
import { type SortingCriterion } from '@/features/sorting/schemas/sorting.schema'
import { initialSortingState } from '@/features/sorting/store'
import { useSorting, useSortingActions } from '@/shared/store'

vi.mock('@/shared/store', () => ({
  useSorting: vi.fn(),
  useSortingActions: vi.fn(),
}))

const mockSetSorting = vi.fn()
const mockResetSorting = vi.fn()

function setupMocks(sorting: SortingCriterion[] = [[null, null]]) {
  vi.mocked(useSorting).mockReturnValue(sorting)
  vi.mocked(useSortingActions).mockReturnValue({
    setSorting: mockSetSorting,
    resetSorting: mockResetSorting,
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  setupMocks()
})

describe('initial state', () => {
  it('draftCriteria is initialized from the store', () => {
    const initial: SortingCriterion[] = [['name', 'asc']]
    setupMocks(initial)

    const { result } = renderHook(() => useSortingPanel())

    expect(result.current.draftCriteria).toEqual(initial)
  })

  it('draftCriteriaCount is 0 when no criterion is selected', () => {
    const { result } = renderHook(() => useSortingPanel())

    expect(result.current.draftCriteriaCount).toBe(0)
  })

  it('draftCriteriaCount counts only non-null criteria', () => {
    setupMocks([
      ['name', 'asc'],
      [null, null],
    ])

    const { result } = renderHook(() => useSortingPanel())

    expect(result.current.draftCriteriaCount).toBe(1)
  })
})

describe('draftCriteriaCount', () => {
  it('reflects all filled criteria', () => {
    setupMocks([
      ['name', 'asc'],
      ['hp', 'desc'],
    ])

    const { result } = renderHook(() => useSortingPanel())

    expect(result.current.draftCriteriaCount).toBe(2)
  })

  it('updates when setDraftCriteria is called', () => {
    const { result } = renderHook(() => useSortingPanel())

    act(() => {
      result.current.setDraftCriteria([['name', 'asc']])
    })

    expect(result.current.draftCriteriaCount).toBe(1)
  })
})

describe('applySorting', () => {
  it('always includes the first criterion even if null', () => {
    const { result } = renderHook(() => useSortingPanel())

    act(() => {
      result.current.applySorting()
    })

    expect(mockSetSorting).toHaveBeenCalledWith([[null, null]])
  })

  it('filters out subsequent criteria where sortBy is null', () => {
    const { result } = renderHook(() => useSortingPanel())

    act(() => {
      result.current.setDraftCriteria([
        ['name', 'asc'],
        [null, null],
      ])
    })
    act(() => {
      result.current.applySorting()
    })

    expect(mockSetSorting).toHaveBeenCalledWith([['name', 'asc']])
  })

  it('filters out subsequent criteria where orderBy is null', () => {
    const { result } = renderHook(() => useSortingPanel())

    act(() => {
      result.current.setDraftCriteria([
        ['name', 'asc'],
        ['hp', null],
      ])
    })
    act(() => {
      result.current.applySorting()
    })

    expect(mockSetSorting).toHaveBeenCalledWith([['name', 'asc']])
  })

  it('keeps all fully-filled criteria', () => {
    const { result } = renderHook(() => useSortingPanel())

    act(() => {
      result.current.setDraftCriteria([
        ['name', 'asc'],
        ['hp', 'desc'],
      ])
    })
    act(() => {
      result.current.applySorting()
    })

    expect(mockSetSorting).toHaveBeenCalledWith([
      ['name', 'asc'],
      ['hp', 'desc'],
    ])
  })
})

describe('syncSorting', () => {
  it('resets draftCriteria to the current store value', () => {
    const { result } = renderHook(() => useSortingPanel())

    act(() => {
      result.current.setDraftCriteria([['name', 'asc']])
    })
    expect(result.current.draftCriteria).toEqual([['name', 'asc']])

    act(() => {
      result.current.syncSorting()
    })

    expect(result.current.draftCriteria).toEqual([[null, null]])
  })
})

describe('resetSorting', () => {
  it('resets draftCriteria to the initial state', () => {
    const { result } = renderHook(() => useSortingPanel())

    act(() => {
      result.current.setDraftCriteria([['name', 'asc']])
    })
    act(() => {
      result.current.resetSorting()
    })

    expect(result.current.draftCriteria).toEqual(initialSortingState.sort)
  })

  it('calls the store reset action', () => {
    const { result } = renderHook(() => useSortingPanel())

    act(() => {
      result.current.resetSorting()
    })

    expect(mockResetSorting).toHaveBeenCalledOnce()
  })
})
