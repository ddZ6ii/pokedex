import z from 'zod'

import { FilterSchema } from '@/features/filters/schemas'

const ApiQueryParamsSchema = FilterSchema.optional().transform((input) => {
  const { page, perPage, search, sortBy, sortOrder } = FilterSchema.parse(
    input ?? {},
  )
  return {
    _page: page.toString(),
    _per_page: perPage.toString(),
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
