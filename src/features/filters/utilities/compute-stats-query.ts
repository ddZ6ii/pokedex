import {
  MAX_STAT_VALUE,
  MIN_STAT_VALUE,
  type Filters,
} from '@/features/filters/schemas/filter.schema'

export function computeStatsQuery(
  stats: Filters['stats'],
): Record<string, string> {
  return Object.entries(stats ?? {}).reduce<Record<string, string>>(
    (acc, [stat, [gte, lte]]) => {
      if (gte === lte) {
        acc[`${stat}:eq`] = String(gte)
        return acc
      }

      if (gte > MIN_STAT_VALUE) {
        acc[`${stat}:gte`] = String(gte)
      }
      if (lte < MAX_STAT_VALUE) {
        acc[`${stat}:lte`] = String(lte)
      }
      return acc
    },
    {},
  )
}
