import { type StatsQuery } from '@/features/filters/utilities/compute-stats-query'
import { type TypesQuery } from '@/features/filters/utilities/compute-types-query'

export function computeWhereQuery(
  search: string | undefined,
  statsQuery: StatsQuery,
  typesQuery: TypesQuery,
): string {
  return JSON.stringify({
    ...(search && { name: { contains: search } }),
    ...statsQuery,
    ...typesQuery,
  })
}
