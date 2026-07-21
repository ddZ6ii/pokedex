import { startTransition, useCallback, useMemo, useState } from 'react'

import {
  MAX_STAT_VALUE,
  MIN_STAT_VALUE,
  type FilteringStats,
  type Filters,
} from '@/features/filters/schemas'
import {
  POKEMON_SKILLS,
  POKEMON_TYPES,
  type PokemonType,
} from '@/features/pokemons/schemas'
import { useFilters, useFiltersActions } from '@/shared/store'

export const DEFAULT_DRAFT_STATS = Object.fromEntries(
  POKEMON_SKILLS.map((skill) => [skill, [MIN_STAT_VALUE, MAX_STAT_VALUE]]),
) as FilteringStats

const DEFAULT_TYPES = new Set<PokemonType>(POKEMON_TYPES)

const TYPE_FILTERS_ERROR = 'Please select at least one type.'

export const initDraftStats = (
  appliedStats: Filters['stats'] = null,
): FilteringStats => {
  if (!appliedStats) return DEFAULT_DRAFT_STATS

  const initialStats = {} as FilteringStats

  for (const skill of POKEMON_SKILLS) {
    if (appliedStats[skill] === undefined) {
      initialStats[skill] = [MIN_STAT_VALUE, MAX_STAT_VALUE]
      continue
    }
    initialStats[skill] = [...appliedStats[skill]]
  }

  return initialStats
}

export const initDraftTypes = (
  appliedTypes: Filters['types'],
): Set<PokemonType> => {
  if (!appliedTypes) return DEFAULT_TYPES
  return new Set(appliedTypes)
}

export function useFilteringPanel() {
  const { stats: appliedStats, types: appliedTypes } = useFilters()
  const {
    setStats: setAppliedStats,
    setTypes: setAppliedTypes,
    resetStats: resetAppliedStats,
    resetTypes: resetAppliedTypes,
  } = useFiltersActions()

  const [error, setError] = useState<Error | null>(null)
  const [draftStats, setDraftStats] = useState(() =>
    initDraftStats(appliedStats),
  )
  const [draftTypes, setDraftTypes] = useState(() =>
    initDraftTypes(appliedTypes),
  )

  const applyFilters = useCallback(() => {
    if (error) return

    const nextAppliedStats = Object.fromEntries(
      Object.entries(draftStats).filter(
        ([_, [min, max]]) => min !== MIN_STAT_VALUE || max !== MAX_STAT_VALUE,
      ),
    ) as FilteringStats

    startTransition(() => {
      if (Object.keys(nextAppliedStats).length) {
        setAppliedStats(nextAppliedStats)
      } else if (appliedStats) {
        resetAppliedStats()
      }

      if (draftTypes.size === POKEMON_TYPES.length) {
        if (appliedTypes) {
          resetAppliedTypes()
        }
      } else {
        setAppliedTypes(new Set(draftTypes))
      }
    })
  }, [
    appliedStats,
    appliedTypes,
    draftStats,
    draftTypes,
    error,
    resetAppliedStats,
    resetAppliedTypes,
    setAppliedStats,
    setAppliedTypes,
  ])

  // Sync local component state with global store.
  // This is needed in case user opens the drawer, makes some changes, but doesn't apply them and closes the drawer. When they open it again, we want to show the currently applied filtering options, not the ones they were editing before.
  const syncFilters = useCallback(() => {
    setDraftStats(initDraftStats(appliedStats))
    setDraftTypes(initDraftTypes(appliedTypes))
    setError(null)
  }, [appliedStats, appliedTypes])

  const clearDraftStats = useCallback(() => {
    setDraftStats(DEFAULT_DRAFT_STATS)
  }, [])

  const _clearDraftTypes = useCallback(() => {
    setError(null)
    setDraftTypes(DEFAULT_TYPES)
  }, [])

  const resetFilters = useCallback(() => {
    clearDraftStats()
    _clearDraftTypes()
    resetAppliedStats()
    resetAppliedTypes()
  }, [resetAppliedStats, resetAppliedTypes, clearDraftStats, _clearDraftTypes])

  const selectDraftType = useCallback(
    (type: PokemonType, nextChecked: boolean) => {
      let nextError: Error | null = null

      setDraftTypes((prev) => {
        const newSet = new Set(prev)
        if (nextChecked) {
          newSet.add(type)
        } else {
          newSet.delete(type)
        }
        if (newSet.size === 0) {
          nextError = new Error(TYPE_FILTERS_ERROR)
        }
        return newSet
      })

      setError(nextError)
    },
    [],
  )

  const selectAllDraftTypes = useCallback(() => {
    setError(null)
    setDraftTypes(DEFAULT_TYPES)
  }, [])

  const unselectAllDraftTypes = useCallback(() => {
    setError(new Error(TYPE_FILTERS_ERROR))
    setDraftTypes(new Set())
  }, [])

  const _appliedStatsCount = Object.values(appliedStats ?? {}).length
  const appliedTypesCount = appliedTypes?.size ?? 0
  const appliedFiltersCount = _appliedStatsCount + appliedTypesCount

  const draftStatsCount = Object.values(draftStats).filter(
    ([min, max]) => min > MIN_STAT_VALUE || max < MAX_STAT_VALUE,
  ).length

  const draftTypesCount =
    draftTypes.size === POKEMON_TYPES.length ? 0 : draftTypes.size

  const _hasStatFiltersChange = useMemo(
    () =>
      Object.entries(draftStats).some(([skill, [min, max]]) => {
        const appliedStat = appliedStats?.[skill as keyof FilteringStats]
        if (!appliedStat) {
          return min !== MIN_STAT_VALUE || max !== MAX_STAT_VALUE
        }
        return appliedStat[0] !== min || appliedStat[1] !== max
      }),
    [draftStats, appliedStats],
  )

  const _effectiveAppliedTypes = appliedTypes ?? DEFAULT_TYPES

  const _hasTypeFiltersChange = useMemo(
    () =>
      draftTypes.size !== _effectiveAppliedTypes.size ||
      [...draftTypes].some((type) => !_effectiveAppliedTypes.has(type)),
    [draftTypes, _effectiveAppliedTypes],
  )

  const hasFiltersChange = _hasStatFiltersChange || _hasTypeFiltersChange

  const isApplyDisabled = !!error || !hasFiltersChange

  return {
    applyFilters,
    appliedFiltersCount,
    clearDraftStats,
    draftStats,
    draftStatsCount,
    draftTypes,
    draftTypesCount,
    error,
    hasFiltersChange,
    isApplyDisabled,
    resetFilters,
    selectAllDraftTypes,
    selectDraftType,
    setDraftStats,
    syncFilters,
    unselectAllDraftTypes,
  }
}
