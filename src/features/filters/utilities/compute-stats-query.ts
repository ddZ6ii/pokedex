import {
  MAX_STAT_VALUE,
  MIN_STAT_VALUE,
  type Filters,
} from '@/features/filters/schemas/filter.schema'

export type StatCondition = { eq: number } | { gte?: number; lte?: number }
export type StatsQuery = Record<string, StatCondition>

export function computeStatsQuery(stats: Filters['stats']): StatsQuery {
  return Object.entries(stats ?? {}).reduce<StatsQuery>(
    (acc, [stat, [gte, lte]]) => {
      if (gte === lte) {
        acc[stat] = { eq: gte }
        return acc
      }

      const condition: { gte?: number; lte?: number } = {}
      if (gte > MIN_STAT_VALUE) condition.gte = gte
      if (lte < MAX_STAT_VALUE) condition.lte = lte
      acc[stat] = condition
      return acc
    },
    {},
  )
}
