import { useCallback, useState } from 'react'

import {
  MAX_STAT_VALUE,
  MIN_STAT_VALUE,
  type FilteringStats,
  type Filters,
} from '@/features/filters/schemas'
import { POKEMON_SKILLS, type PokemonSkills } from '@/features/pokemons/schemas'
import { useStatsFilters, useFiltersActions } from '@/shared/store'

export const defaultStats = Object.fromEntries(
  POKEMON_SKILLS.map((skill) => [skill, [MIN_STAT_VALUE, MAX_STAT_VALUE]]),
) as FilteringStats

export const initStats = (globalStats: Filters['stats']): FilteringStats => {
  if (!globalStats) return defaultStats

  const initialStats = {} as FilteringStats

  for (const skill of POKEMON_SKILLS) {
    if (globalStats[skill] === undefined) {
      initialStats[skill] = [MIN_STAT_VALUE, MAX_STAT_VALUE]
      continue
    }
    initialStats[skill] = [...globalStats[skill]]
  }

  return initialStats
}

export function useFilteringPanel() {
  const { stats: activeStats } = useStatsFilters()
  const { setStats: setActiveStats, resetStats: resetActiveStats } =
    useFiltersActions()

  const [stats, setStats] = useState(() => initStats(activeStats))

  const applyFilters = useCallback(() => {
    const nextStats: Filters['stats'] = {}

    for (const stat in stats) {
      const hasChanged =
        stats[stat as PokemonSkills][0] !== MIN_STAT_VALUE ||
        stats[stat as PokemonSkills][1] !== MAX_STAT_VALUE

      if (!hasChanged) continue

      nextStats[stat as PokemonSkills] = stats[stat as PokemonSkills]
    }

    setActiveStats(nextStats)
  }, [stats, setActiveStats])

  // Sync local component state with global store.
  // This is needed in case user opens the drawer, makes some changes, but doesn't apply them and closes the drawer. When they open it again, we want to show the currently applied filtering options, not the ones they were editing before.
  const syncFilters = useCallback(() => {
    setStats(initStats(activeStats))
  }, [activeStats])

  const resetStats = useCallback(() => {
    setStats(defaultStats)
    if (activeStats) {
      resetActiveStats()
    }
  }, [activeStats, resetActiveStats])

  const resetFilters = useCallback(() => {
    setStats(defaultStats)
    if (activeStats) {
      resetActiveStats()
    }
  }, [resetActiveStats, activeStats])

  const activeStatsCount = Object.values(stats).filter(
    ([min, max]) => min > MIN_STAT_VALUE || max < MAX_STAT_VALUE,
  ).length

  const activeFiltersCount = activeStatsCount

  return {
    activeFiltersCount,
    activeStatsCount,
    applyFilters,
    resetFilters,
    resetStats,
    setStats,
    stats,
    syncFilters,
  }
}
