import * as z from 'zod'

import { ModeSchema } from '@/shared/schemas'

const StorageSchema = z.object({
  version: z.number(),
  state: z.object({
    mode: ModeSchema,
  }),
})

type PersistedStoreState = z.infer<typeof StorageSchema>

export { type PersistedStoreState, StorageSchema }
