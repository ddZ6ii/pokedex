import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  DEFAULT_DRAFT_STATS,
  initDraftStats,
  initDraftTypes,
  useFilteringPanel,
} from '@/features/filters/hooks/useFilteringPanel'
import {
  MAX_STAT_VALUE,
  MIN_STAT_VALUE,
  type Filters,
} from '@/features/filters/schemas'
import {
  POKEMON_TYPES,
  type PokemonSkill,
  type PokemonType,
} from '@/features/pokemons/schemas'

const DEFAULT_TYPES = new Set<PokemonType>(POKEMON_TYPES)

type MockSearch = { stats: Filters['stats']; types: PokemonType[] | undefined }
type MockSearchResult = MockSearch & { page: number }

const mockNavigate =
  vi.fn<(opts: { search: (prev: MockSearch) => MockSearchResult }) => void>()
let mockSearch: MockSearch = {
  stats: undefined,
  types: undefined,
}

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()
  return {
    ...actual,
    getRouteApi: () => ({
      useSearch: () => mockSearch,
      useNavigate: () => mockNavigate,
    }),
  }
})

function setupMocks(stats?: Filters['stats'], types: Filters['types'] = null) {
  mockSearch = { stats, types: types ? [...types] : undefined }
}

beforeEach(() => {
  vi.clearAllMocks()
  setupMocks()
})

describe('initDraftStats', () => {
  it('returns DEFAULT_DRAFT_STATS when called with null', () => {
    expect(initDraftStats()).toEqual(DEFAULT_DRAFT_STATS)
  })

  it('uses default range for missing skills', () => {
    const result = initDraftStats({ hp: [10, 90] })

    for (const skill of Object.keys(result)) {
      if (skill === 'hp') continue
      expect(result[skill as PokemonSkill]).toEqual([
        MIN_STAT_VALUE,
        MAX_STAT_VALUE,
      ])
    }
  })

  it('copies provided stat values', () => {
    const result = initDraftStats({ hp: [20, 80], attack: [10, 70] })

    expect(result.hp).toEqual([20, 80])
    expect(result.attack).toEqual([10, 70])
  })
})

describe('initDraftTypes', () => {
  it('returns a set of POKEMON_TYPES when called with null', () => {
    expect(initDraftTypes(null)).toEqual(DEFAULT_TYPES)
  })

  it('returns a Set from the provided types', () => {
    const types = new Set<PokemonType>(['fire', 'water'])
    expect(initDraftTypes(types)).toEqual(types)
  })

  it('returns a new Set instance, not the same reference', () => {
    const types = new Set<PokemonType>(['fire'])
    expect(initDraftTypes(types)).not.toBe(types)
  })
})

describe('initial state', () => {
  it('stats defaults to DEFAULT_DRAFT_STATS when no active stats', () => {
    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.draftStats).toEqual(DEFAULT_DRAFT_STATS)
  })

  it('stats initializes from the store when active stats are present', () => {
    setupMocks({ hp: [10, 90] })

    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.draftStats.hp).toEqual([10, 90])

    for (const skill of Object.keys(result.current.draftStats)) {
      if (skill === 'hp') continue
      expect(result.current.draftStats[skill as PokemonSkill]).toEqual([
        MIN_STAT_VALUE,
        MAX_STAT_VALUE,
      ])
    }
  })

  it('draftStatsCount is 0 when all stats are at default values', () => {
    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.draftStatsCount).toBe(0)
  })

  it('types defaults to a set of POKEMON_TYPES when no active types', () => {
    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.draftTypes).toEqual(DEFAULT_TYPES)
  })

  it('types initializes from the store when active types are present', () => {
    setupMocks(undefined, new Set<PokemonType>(['fire', 'water']))

    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.draftTypes).toEqual(new Set(['fire', 'water']))
  })

  it('draftTypesCount is 0 when all types are selected', () => {
    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.draftTypesCount).toBe(0)
  })

  it('error is null initially', () => {
    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.error).toBeNull()
  })

  it('hasFiltersChange is false initially', () => {
    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.hasFiltersChange).toBe(false)
  })

  it('appliedFiltersCount is 0 when no filters are applied', () => {
    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.appliedFiltersCount).toBe(0)
  })
})

describe('draftStatsCount', () => {
  it('counts a stat where min is above minimum', () => {
    setupMocks({ hp: [10, MAX_STAT_VALUE] })

    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.draftStatsCount).toBe(1)
  })

  it('counts a stat where max is below maximum', () => {
    setupMocks({ hp: [MIN_STAT_VALUE, 90] })

    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.draftStatsCount).toBe(1)
  })

  it('counts multiple active stats', () => {
    setupMocks({ hp: [10, 90], attack: [5, MAX_STAT_VALUE] })

    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.draftStatsCount).toBe(2)
  })

  it('updates when setDraftStats is called', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.setDraftStats((prev) => ({ ...prev, hp: [10, 90] }))
    })

    expect(result.current.draftStatsCount).toBe(1)
  })
})

describe('draftTypesCount', () => {
  it('is 0 when all types are selected', () => {
    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.draftTypesCount).toBe(0)
  })

  it('reflects the number of selected types when not all are selected', () => {
    setupMocks(undefined, new Set<PokemonType>(['fire', 'water']))

    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.draftTypesCount).toBe(2)
  })
})

describe('appliedFiltersCount', () => {
  it('sums applied stats and applied types counts', () => {
    setupMocks(
      { hp: [10, 90], attack: [5, 80] },
      new Set<PokemonType>(['fire']),
    )

    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.appliedFiltersCount).toBe(3)
  })
})

describe('applyFilters', () => {
  it('does not navigate when stats are unset and unchanged, and no types selected', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.applyFilters()
    })

    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('omits stats that are at default values', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.setDraftStats((prev) => ({ ...prev, hp: [10, 90] }))
    })
    act(() => {
      result.current.applyFilters()
    })

    const updater = mockNavigate.mock.calls[0]?.[0].search
    expect(updater?.(mockSearch).stats).toEqual({ hp: [10, 90] })
  })

  it('passes all changed stats', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.setDraftStats((prev) => ({
        ...prev,
        hp: [10, 90],
        attack: [5, 80],
      }))
    })
    act(() => {
      result.current.applyFilters()
    })

    const updater = mockNavigate.mock.calls[0]?.[0].search
    expect(updater?.(mockSearch).stats).toEqual({
      hp: [10, 90],
      attack: [5, 80],
    })
  })

  it('sets types to undefined when all types are selected', () => {
    setupMocks(undefined, new Set<PokemonType>(['fire']))

    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.selectAllDraftTypes()
    })
    act(() => {
      result.current.applyFilters()
    })

    const updater = mockNavigate.mock.calls[0]?.[0].search
    expect(updater?.(mockSearch).types).toBeUndefined()
  })

  it('passes an array of selected types when a subset is selected', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.selectDraftType('fire', false)
    })
    act(() => {
      result.current.applyFilters()
    })

    const updater = mockNavigate.mock.calls[0]?.[0].search
    const expectedTypes = POKEMON_TYPES.filter((t) => t !== 'fire')
    expect(updater?.(mockSearch).types).toEqual(
      expect.arrayContaining(expectedTypes),
    )
    expect(updater?.(mockSearch).types).toHaveLength(expectedTypes.length)
  })

  it('resets page to 1', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.setDraftStats((prev) => ({ ...prev, hp: [10, 90] }))
    })
    act(() => {
      result.current.applyFilters()
    })

    const updater = mockNavigate.mock.calls[0]?.[0].search
    expect(updater?.(mockSearch).page).toBe(1)
  })

  it('does not apply when there is an error', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.unselectAllDraftTypes()
    })
    act(() => {
      result.current.applyFilters()
    })

    expect(mockNavigate).not.toHaveBeenCalled()
  })
})

describe('syncFilters', () => {
  it('resets local stats to the current store value', () => {
    setupMocks({ hp: [10, 90] })

    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.setDraftStats((prev) => ({ ...prev, hp: [20, 80] }))
    })
    expect(result.current.draftStats.hp).toEqual([20, 80])

    act(() => {
      result.current.syncFilters()
    })

    expect(result.current.draftStats.hp).toEqual([10, 90])
  })

  it('resets local types to the current store value', () => {
    setupMocks(undefined, new Set<PokemonType>(['fire', 'water']))

    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.selectDraftType('fire', false)
    })
    act(() => {
      result.current.syncFilters()
    })

    expect(result.current.draftTypes).toEqual(new Set(['fire', 'water']))
  })

  it('clears the error', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.unselectAllDraftTypes()
    })
    expect(result.current.error).not.toBeNull()

    act(() => {
      result.current.syncFilters()
    })

    expect(result.current.error).toBeNull()
  })
})

describe('clearDraftStats', () => {
  it('resets local stats to default values', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.setDraftStats((prev) => ({ ...prev, hp: [10, 90] }))
    })
    act(() => {
      result.current.clearDraftStats()
    })

    expect(result.current.draftStats).toEqual(DEFAULT_DRAFT_STATS)
  })
})

describe('selectDraftType', () => {
  it('removes a type when unchecked', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.selectDraftType('fire', false)
    })

    expect(result.current.draftTypes.has('fire')).toBe(false)
  })

  it('adds a type when checked', () => {
    setupMocks(undefined, new Set<PokemonType>(['water']))

    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.selectDraftType('fire', true)
    })

    expect(result.current.draftTypes.has('fire')).toBe(true)
  })

  it('sets an error when the last type is unchecked', () => {
    setupMocks(undefined, new Set<PokemonType>(['fire']))

    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.selectDraftType('fire', false)
    })

    expect(result.current.error).not.toBeNull()
  })

  it('clears the error when a type is added back', () => {
    setupMocks(undefined, new Set<PokemonType>(['fire']))

    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.selectDraftType('fire', false)
    })
    act(() => {
      result.current.selectDraftType('fire', true)
    })

    expect(result.current.error).toBeNull()
  })
})

describe('selectAllDraftTypes', () => {
  it('selects all types', () => {
    setupMocks(undefined, new Set<PokemonType>(['fire']))

    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.selectAllDraftTypes()
    })

    expect(result.current.draftTypes).toEqual(DEFAULT_TYPES)
  })

  it('clears the error', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.unselectAllDraftTypes()
    })
    act(() => {
      result.current.selectAllDraftTypes()
    })

    expect(result.current.error).toBeNull()
  })
})

describe('unselectAllDraftTypes', () => {
  it('deselects all types', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.unselectAllDraftTypes()
    })

    expect(result.current.draftTypes.size).toBe(0)
  })

  it('sets an error', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.unselectAllDraftTypes()
    })

    expect(result.current.error).not.toBeNull()
  })
})

describe('hasFiltersChange', () => {
  it('is true when draft stats differ from applied stats', () => {
    setupMocks({ hp: [10, 90] })

    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.setDraftStats((prev) => ({ ...prev, hp: [20, 80] }))
    })

    expect(result.current.hasFiltersChange).toBe(true)
  })

  it('is true when draft types differ from applied types', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.selectDraftType('fire', false)
    })

    expect(result.current.hasFiltersChange).toBe(true)
  })

  it('is false when draft matches applied', () => {
    setupMocks({ hp: [10, 90] }, new Set<PokemonType>(['fire']))

    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.hasFiltersChange).toBe(false)
  })
})

describe('resetFilters', () => {
  it('resets local stats to default values', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.setDraftStats((prev) => ({ ...prev, attack: [0, 50] }))
    })
    act(() => {
      result.current.resetFilters()
    })

    expect(result.current.draftStats).toEqual(DEFAULT_DRAFT_STATS)
  })

  it('resets local types to all selected', () => {
    setupMocks(undefined, new Set<PokemonType>(['fire']))

    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.resetFilters()
    })

    expect(result.current.draftTypes).toEqual(DEFAULT_TYPES)
  })

  it('navigates with stats and types reset to undefined', () => {
    setupMocks({ attack: [0, 50] }, new Set<PokemonType>(['fire']))

    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.resetFilters()
    })

    const updater = mockNavigate.mock.calls[0]?.[0].search
    expect(updater?.(mockSearch)).toEqual({
      stats: undefined,
      types: undefined,
      page: 1,
    })
  })

  it('clears the error', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.unselectAllDraftTypes()
    })
    act(() => {
      result.current.resetFilters()
    })

    expect(result.current.error).toBeNull()
  })
})
