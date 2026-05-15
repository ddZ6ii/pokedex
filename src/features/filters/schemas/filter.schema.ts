import z from 'zod'

import type { SelectOption } from '@/shared/types'

const PER_PAGES = ['10', '20', '50', '100'] as const

const PER_PAGE_OPTIONS = PER_PAGES.map((value) => ({
  group: 'items per page',
  label: value,
  value,
})) satisfies SelectOption<(typeof PER_PAGES)[number]>[]

const FilterSchema = z.object({
  page: z.number().int().positive().default(1),
  perPage: z
    .union([z.literal(10), z.literal(20), z.literal(50), z.literal(100)])
    .default(10),
  search: z.string().optional(),
})

type Filters = z.infer<typeof FilterSchema>

export { FilterSchema, PER_PAGE_OPTIONS, type Filters }
