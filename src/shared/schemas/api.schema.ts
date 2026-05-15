import z from 'zod'

import { FilterSchema } from '@/features/filters/schemas'
import { SortingSchema } from '@/features/sorting/schemas'

const _ApiQueryOptionsSchema = z.object({
  ...FilterSchema.shape,
  ...SortingSchema.shape,
})

const ApiQueryParamsSchema = _ApiQueryOptionsSchema
  .optional()
  .transform((query) => {
    const { page, perPage, search } = FilterSchema.parse(query ?? {})
    const { sortBy, sortOrder } = SortingSchema.parse(query ?? {})

    return {
      _page: String(page),
      _per_page: String(perPage),
      ...(search && { 'name:contains': search }),
      //By defaultjson-server sorts by id in ascending order (numeric IDs are stringified)
      ...(sortBy && {
        _sort: !sortOrder || sortOrder === 'asc' ? sortBy : `-${sortBy}`,
      }),
    }
  })

type ApiQueryParams = z.output<typeof ApiQueryParamsSchema>
type QueryOptions = z.input<typeof ApiQueryParamsSchema>

export { ApiQueryParamsSchema, type ApiQueryParams, type QueryOptions }
