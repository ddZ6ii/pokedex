import { type StatsQuery } from './compute-stats-query'

export function computeInlineStatsParams(
  statsQuery: StatsQuery,
): Record<string, string> {
  return Object.entries(statsQuery).reduce<Record<string, string>>(
    (acc, [field, condition]) => {
      if ('eq' in condition) {
        acc[`${field}:eq`] = String(condition.eq)
      } else {
        if (condition.gte !== undefined)
          acc[`${field}:gte`] = String(condition.gte)
        if (condition.lte !== undefined)
          acc[`${field}:lte`] = String(condition.lte)
      }
      return acc
    },
    {},
  )
}
