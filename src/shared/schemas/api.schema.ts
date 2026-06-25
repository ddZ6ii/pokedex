import z from 'zod'

import { FilterSchema } from '@/features/filters/schemas'
import { SortingSchema } from '@/features/sorting/schemas'
import { computeSortQuery } from '@/features/sorting/utilities'
import { computeStatsQuery } from '@/features/filters/utilities'

const _ApiQueryOptionsSchema = z.object({
  ...FilterSchema.shape,
  ...SortingSchema.shape,
})

const ApiQueryParamsSchema = _ApiQueryOptionsSchema
  .optional()
  .transform((query) => {
    const { page, perPage, search, stats } = FilterSchema.parse(query ?? {})
    const { sort } = SortingSchema.parse(query ?? {})
    const sortQuery = computeSortQuery(sort)
    const statsQuery = computeStatsQuery(stats)

    return {
      _page: String(page),
      _per_page: String(perPage),
      ...(search && { 'name:contains': search }),
      // If no sorting criteria is applied, json-server will return by default results sorted by id in ascending order (numeric IDs are stringified)
      ...(sortQuery && {
        _sort: sortQuery,
      }),
      ...(stats && statsQuery),
    }
  })

type ApiQueryParams = z.output<typeof ApiQueryParamsSchema>
type QueryOptions = z.input<typeof ApiQueryParamsSchema>

export { ApiQueryParamsSchema, type ApiQueryParams, type QueryOptions }
