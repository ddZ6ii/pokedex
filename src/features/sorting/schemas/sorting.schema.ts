import z from 'zod'

import { POKEMON_SKILLS } from '@/features/pokemons/schemas'
import type { SelectOption } from '@/shared/types'
import { capitalize } from '@/shared/utilities'

const SORT_BY_VALUES = ['name', ...POKEMON_SKILLS] as const

const SORT_ORDER_VALUES = ['asc', 'desc'] as const

const SORT_BY_OPTIONS = SORT_BY_VALUES.map((value, i) => ({
  group: i === 0 ? 'general' : 'stats',
  label: capitalize(value),
  value,
})) satisfies SelectOption<(typeof SORT_BY_VALUES)[number]>[]

const SORT_ORDER_OPTIONS = SORT_ORDER_VALUES.map((value) => ({
  group: 'order',
  label: capitalize(value === 'asc' ? 'ascending' : 'descending'),
  value,
})) satisfies SelectOption<(typeof SORT_ORDER_VALUES)[number]>[]

const SortingSchema = z.object({
  sortBy: z.enum(SORT_BY_VALUES).nullable().default(null),
  sortOrder: z.enum(SORT_ORDER_VALUES).nullable().default(null),
})

type SelectSortByOptions = (typeof SORT_BY_VALUES)[number]
type SelectSortOrderOptions = (typeof SORT_ORDER_VALUES)[number]
type Sorting = z.infer<typeof SortingSchema>

export {
  SortingSchema,
  SORT_BY_OPTIONS,
  SORT_ORDER_OPTIONS,
  type SelectSortByOptions,
  type SelectSortOrderOptions,
  type Sorting,
}
