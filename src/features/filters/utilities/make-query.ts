import { FilterSchema, type Filters } from '@/features/filters/schemas'
import { computeInlineStatsParams } from '@/features/filters/utilities/compute-inline-stats-params'
import { computeStatsQuery } from '@/features/filters/utilities/compute-stats-query'
import { computeTypesQuery } from '@/features/filters/utilities/compute-types-query'
import { computeWhereQuery } from '@/features/filters/utilities/compute-where-query'
import { SortingSchema } from '@/features/sorting/schemas'
import { computeSortQuery } from '@/features/sorting/utilities'

export function makeQuery(filters: Filters) {
  const { page, perPage, search, stats, types } = FilterSchema.parse(filters)

  const { sort } = SortingSchema.parse(filters)
  const sortQuery = computeSortQuery(sort)
  const statsQuery = computeStatsQuery(stats)
  const typesQuery = computeTypesQuery(types)

  const baseQuery = {
    _page: String(page),
    _per_page: String(perPage),
    // If no sorting criteria is applied, json-server will return by default results sorted by id in ascending order (numeric IDs are stringified)
    ...(sortQuery && { _sort: sortQuery }),
  }

  if (!typesQuery) {
    return {
      ...baseQuery,
      ...(search && { 'name:contains': search }),
      ...(stats && computeInlineStatsParams(statsQuery)),
    }
  }

  // Filtering by `types` uses a `_where` complex query.
  // With json-server, `_where` completely replaces all non-reserved filter params (hp:gte, name:contains, etc.). Reserved filter params like `_page`, `_per_page` and `_sort` are safe.
  // So when `types` is applied, we need to move all non-reserved filter params into the `_where` query.
  return {
    ...baseQuery,
    _where: computeWhereQuery(search, statsQuery, typesQuery),
  }
}
