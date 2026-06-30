import z from 'zod'

import { FilterSchema, type Filters } from '@/features/filters/schemas'
import { makeQuery } from '@/features/filters/utilities'
import { SortingSchema } from '@/features/sorting/schemas'

const _ApiQueryOptionsSchema = z.object({
  ...FilterSchema.shape,
  ...SortingSchema.shape,
})

const ApiQueryParamsSchema = _ApiQueryOptionsSchema
  .optional()
  .transform((query) => makeQuery(query ?? ({} as Filters)))

type ApiQueryParams = z.output<typeof ApiQueryParamsSchema>
type QueryOptions = z.input<typeof ApiQueryParamsSchema>

export { ApiQueryParamsSchema, type ApiQueryParams, type QueryOptions }
