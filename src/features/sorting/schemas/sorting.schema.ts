import * as z from 'zod'

import { POKEMON_SKILLS } from '@/features/pokemons/schemas/pokemon.schema'
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

const _SortingCriterionSchema = z.tuple([
  z.union([z.enum(SORT_BY_VALUES), z.null()]),
  z.union([z.enum(SORT_ORDER_VALUES), z.null()]),
])

const SortingSchema = z.object({
  sort: z.array(_SortingCriterionSchema).optional(),
})

type Sorting = z.infer<typeof SortingSchema>
type SortingCriterion = z.infer<typeof _SortingCriterionSchema>
type SortingOrder = (typeof SORT_ORDER_VALUES)[number]

export {
  SortingSchema,
  SORT_BY_OPTIONS,
  SORT_ORDER_OPTIONS,
  type Sorting,
  type SortingCriterion,
  type SortingOrder,
}
