import z from 'zod'

import { POKEMON_SKILLS } from '@/features/pokemons/schemas'
import type { SelectOption } from '@/shared/types'
import { capitalize } from '@/shared/utilities'

const PER_PAGES = ['10', '20', '50', '100'] as const
const SORT_BY_VALUES = ['name', ...POKEMON_SKILLS] as const
const SORT_ORDER_VALUES = ['asc', 'desc'] as const

const PER_PAGE_OPTIONS = PER_PAGES.map((value) => ({
  group: 'items per page',
  label: value,
  value,
})) satisfies SelectOption<(typeof PER_PAGES)[number]>[]

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

const FilterSchema = z.object({
  page: z.number().int().positive().default(1),
  perPage: z
    .union([z.literal(10), z.literal(20), z.literal(50), z.literal(100)])
    .default(10),
  search: z.string().optional(),
  sortBy: z.enum(SORT_BY_VALUES).nullable().default(null),
  sortOrder: z.enum(SORT_ORDER_VALUES).nullable().default(null),
})

const APIParamsSchema = FilterSchema.optional().transform((input) => {
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

type ApiParams = z.output<typeof APIParamsSchema>
type Filters = z.infer<typeof FilterSchema>
type QueryOptions = z.input<typeof APIParamsSchema>
type SelectSortByOptions = (typeof SORT_BY_VALUES)[number]
type SelectSortOrderOptions = (typeof SORT_ORDER_VALUES)[number]

export {
  APIParamsSchema,
  FilterSchema,
  PER_PAGE_OPTIONS,
  SORT_BY_OPTIONS,
  SORT_ORDER_OPTIONS,
  type ApiParams,
  type Filters,
  type QueryOptions,
  type SelectSortByOptions,
  type SelectSortOrderOptions,
}
