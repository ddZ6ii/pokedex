import z from 'zod'

import { FilterSchema } from '@/features/filters/schemas'
import { SortingSchema } from '@/features/sorting/schemas'
import { ModeSchema } from '@/shared/schemas'

const StorageSchema = z.object({
  version: z.number(),
  state: z.object({
    mode: ModeSchema,
    perPage: FilterSchema.shape.perPage,
    sort: SortingSchema.shape.sort,
  }),
})

type PersistedStoreState = z.infer<typeof StorageSchema>

export { type PersistedStoreState, StorageSchema }
