import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSortingPanel } from '@/features/sorting/hooks/useSortingPanel'
import { type SortingCriterion } from '@/features/sorting/schemas/sorting.schema'

type MockSearch = { sort: SortingCriterion[] | undefined }
type MockSearchResult = { sort: SortingCriterion[] | undefined; page: number }

const mockNavigate =
  vi.fn<(opts: { search: (prev: MockSearch) => MockSearchResult }) => void>()
let mockSort: SortingCriterion[] | undefined = undefined

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    getRouteApi: () => ({
      useSearch: () => ({ sort: mockSort }),
      useNavigate: () => mockNavigate,
    }),
  }
})

function setupMocks(sort?: SortingCriterion[]) {
  mockSort = sort
}

beforeEach(() => {
  vi.clearAllMocks()
  setupMocks()
})

describe('initial state', () => {
  it('draftCriteria falls back to a single empty row when the URL has no sort applied', () => {
    const { result } = renderHook(() => useSortingPanel())

    expect(result.current.draftCriteria).toEqual([[null, null]])
  })

  it('draftCriteria is initialized from the URL when sort is present', () => {
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
  it('navigates with sort undefined when only a single null row exists, and resets page to 1', () => {
    const { result } = renderHook(() => useSortingPanel())

    act(() => {
      result.current.applySorting()
    })

    const updater = mockNavigate.mock.calls[0]?.[0].search
    expect(updater?.({ sort: mockSort })).toEqual({
      sort: undefined,
      page: 1,
    })
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

    const updater = mockNavigate.mock.calls[0]?.[0].search
    expect(updater?.({ sort: mockSort }).sort).toEqual([['name', 'asc']])
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

    const updater = mockNavigate.mock.calls[0]?.[0].search
    expect(updater?.({ sort: mockSort }).sort).toEqual([['name', 'asc']])
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

    const updater = mockNavigate.mock.calls[0]?.[0].search
    expect(updater?.({ sort: mockSort }).sort).toEqual([
      ['name', 'asc'],
      ['hp', 'desc'],
    ])
  })
})

describe('syncSorting', () => {
  it('resets draftCriteria to the current URL value', () => {
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
  it('resets draftCriteria to a single empty row', () => {
    const { result } = renderHook(() => useSortingPanel())

    act(() => {
      result.current.setDraftCriteria([['name', 'asc']])
    })
    act(() => {
      result.current.resetSorting()
    })

    expect(result.current.draftCriteria).toEqual([[null, null]])
  })

  it('navigates with sort reset to undefined and page to 1', () => {
    const { result } = renderHook(() => useSortingPanel())

    act(() => {
      result.current.resetSorting()
    })

    const updater = mockNavigate.mock.calls[0]?.[0].search
    expect(updater?.({ sort: mockSort })).toEqual({ sort: undefined, page: 1 })
  })
})
