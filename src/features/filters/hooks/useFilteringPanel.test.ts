import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  defaultStats,
  initStats,
  useFilteringPanel,
} from '@/features/filters/hooks/useFilteringPanel'
import {
  MAX_STAT_VALUE,
  MIN_STAT_VALUE,
  type Filters,
} from '@/features/filters/schemas'
import type { PokemonSkills } from '@/features/pokemons/schemas/pokemon.schema'
import { useFiltersActions, useStatsFilters } from '@/shared/store'

vi.mock('@/shared/store', () => ({
  useStatsFilters: vi.fn(),
  useFiltersActions: vi.fn(),
}))

const mockSetStats = vi.fn()
const mockResetStats = vi.fn()

function setupMocks(stats?: Filters['stats']) {
  vi.mocked(useStatsFilters).mockReturnValue({ stats })
  vi.mocked(useFiltersActions).mockReturnValue({
    setStats: mockSetStats,
    resetStats: mockResetStats,
  } as unknown as ReturnType<typeof useFiltersActions>)
}

beforeEach(() => {
  vi.clearAllMocks()
  setupMocks()
})

describe('initStats', () => {
  it('returns defaultStats when called with undefined', () => {
    expect(initStats(undefined)).toEqual(defaultStats)
  })

  it('uses default range for missing skills', () => {
    const result = initStats({ hp: [10, 90] })

    for (const skill of Object.keys(result)) {
      if (skill === 'hp') continue
      expect(result[skill as PokemonSkills]).toEqual([
        MIN_STAT_VALUE,
        MAX_STAT_VALUE,
      ])
    }
  })

  it('copies provided stat values', () => {
    const result = initStats({ hp: [20, 80], attack: [10, 70] })

    expect(result.hp).toEqual([20, 80])
    expect(result.attack).toEqual([10, 70])
  })
})

describe('initial state', () => {
  it('stats defaults to defaultStats when no active stats', () => {
    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.stats).toEqual(defaultStats)
  })

  it('stats initializes from the store when active stats are present', () => {
    setupMocks({ hp: [10, 90] })

    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.stats.hp).toEqual([10, 90])

    for (const skill of Object.keys(result.current.stats)) {
      if (skill === 'hp') continue
      expect(result.current.stats[skill as PokemonSkills]).toEqual([
        MIN_STAT_VALUE,
        MAX_STAT_VALUE,
      ])
    }
  })

  it('activeStatsCount is 0 when all stats are at default values', () => {
    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.activeStatsCount).toBe(0)
  })
})

describe('activeStatsCount', () => {
  it('counts a stat where min is above minimum', () => {
    setupMocks({ hp: [10, MAX_STAT_VALUE] })

    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.activeStatsCount).toBe(1)
  })

  it('counts a stat where max is below maximum', () => {
    setupMocks({ hp: [MIN_STAT_VALUE, 90] })

    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.activeStatsCount).toBe(1)
  })

  it('counts multiple active stats', () => {
    setupMocks({ hp: [10, 90], attack: [5, MAX_STAT_VALUE] })

    const { result } = renderHook(() => useFilteringPanel())

    expect(result.current.activeStatsCount).toBe(2)
  })

  it('updates when setStats is called', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.setStats((prev) => ({ ...prev, hp: [10, 90] }))
    })

    expect(result.current.activeStatsCount).toBe(1)
  })
})

describe('applyFilters', () => {
  it('calls setActiveStats with empty object when all stats are at default', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.applyFilters()
    })

    expect(mockSetStats).toHaveBeenCalledWith({})
  })

  it('omits stats that are at default values', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.setStats((prev) => ({ ...prev, hp: [10, 90] }))
    })
    act(() => {
      result.current.applyFilters()
    })

    expect(mockSetStats).toHaveBeenCalledWith({ hp: [10, 90] })
  })

  it('passes all changed stats', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.setStats((prev) => ({
        ...prev,
        hp: [10, 90],
        attack: [5, 80],
      }))
    })
    act(() => {
      result.current.applyFilters()
    })

    expect(mockSetStats).toHaveBeenCalledWith({ hp: [10, 90], attack: [5, 80] })
  })
})

describe('syncFilters', () => {
  it('resets local stats to the current store value', () => {
    setupMocks({ hp: [10, 90] })

    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.setStats((prev) => ({ ...prev, hp: [20, 80] }))
    })
    expect(result.current.stats.hp).toEqual([20, 80])

    act(() => {
      result.current.syncFilters()
    })

    expect(result.current.stats.hp).toEqual([10, 90])
  })
})

describe('resetStats', () => {
  it('resets local stats to default values', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.setStats((prev) => ({ ...prev, hp: [10, 90] }))
    })
    act(() => {
      result.current.resetStats()
    })

    expect(result.current.stats).toEqual(defaultStats)
  })

  it('calls resetActiveStats when active stats exist in the store', () => {
    setupMocks({ hp: [10, 90] })

    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.resetStats()
    })

    expect(mockResetStats).toHaveBeenCalledOnce()
  })

  it('does not call resetActiveStats when no active stats in the store', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.resetStats()
    })

    expect(mockResetStats).not.toHaveBeenCalled()
  })
})

describe('resetFilters', () => {
  it('resets local stats to default values', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.setStats((prev) => ({ ...prev, attack: [0, 50] }))
    })
    act(() => {
      result.current.resetFilters()
    })

    expect(result.current.stats).toEqual(defaultStats)
  })

  it('calls resetActiveStats when active stats exist in the store', () => {
    setupMocks({ attack: [0, 50] })

    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.resetFilters()
    })

    expect(mockResetStats).toHaveBeenCalledOnce()
  })

  it('does not call resetActiveStats when no active stats in the store', () => {
    const { result } = renderHook(() => useFilteringPanel())

    act(() => {
      result.current.resetFilters()
    })

    expect(mockResetStats).not.toHaveBeenCalled()
  })
})
