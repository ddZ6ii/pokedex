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
import { pokemonsRouteApi as routeApi } from '@/routes/(public)/-route-api'

export const DEFAULT_DRAFT_STATS = Object.fromEntries(
  POKEMON_SKILLS.map((skill) => [skill, [MIN_STAT_VALUE, MAX_STAT_VALUE]]),
) as FilteringStats

const DEFAULT_TYPES = new Set<PokemonType>(POKEMON_TYPES)

const TYPE_FILTERS_ERROR = 'Please select at least one type.'

export const initDraftStats = (
  appliedStats?: Filters['stats'],
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
  const { stats: appliedStats, types } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const appliedTypes = useMemo(() => (types ? new Set(types) : null), [types])

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

    const nextStats = Object.keys(nextAppliedStats).length
      ? nextAppliedStats
      : undefined
    const nextTypes =
      draftTypes.size === POKEMON_TYPES.length ? undefined : [...draftTypes]

    if (
      !appliedStats &&
      nextStats === undefined &&
      appliedTypes === null &&
      nextTypes === undefined
    ) {
      return
    }

    startTransition(() => {
      void navigate({
        search: (prev) => ({
          ...prev,
          stats: nextStats,
          types: nextTypes,
          page: 1,
        }),
      })
    })
  }, [appliedStats, appliedTypes, draftStats, draftTypes, error, navigate])

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
    void navigate({
      search: (prev) => ({
        ...prev,
        stats: undefined,
        types: undefined,
        page: 1,
      }),
    })
  }, [navigate, clearDraftStats, _clearDraftTypes])

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
