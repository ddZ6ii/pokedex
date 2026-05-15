import z from 'zod'

import { FilterSchema } from '@/features/filters/schemas'
import { ModeSchema } from '@/shared/schemas'
import { SortingSchema } from '@/features/sorting/schemas'

const StorageSchema = z.object({
  version: z.number(),
  state: z.object({
    mode: ModeSchema,
    perPage: FilterSchema.shape.perPage,
    sortBy: SortingSchema.shape.sortBy,
    sortOrder: SortingSchema.shape.sortOrder,
  }),
})

type PersistedStoreState = z.infer<typeof StorageSchema>

export { type PersistedStoreState, StorageSchema }
