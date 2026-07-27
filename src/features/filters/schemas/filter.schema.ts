import z from 'zod'

import {
  POKEMON_SKILLS,
  POKEMON_TYPES,
  type PokemonSkill,
} from '@/features/pokemons/schemas/pokemon.schema'
import type { SelectOption } from '@/shared/types'

const PER_PAGES = ['10', '20', '50', '100'] as const

const PER_PAGE_OPTIONS = PER_PAGES.map((value) => ({
  group: 'items per page',
  label: value,
  value,
})) satisfies SelectOption<(typeof PER_PAGES)[number]>[]

const MIN_STAT_VALUE = 0
const MAX_STAT_VALUE = 255

const _StatRangeSchema = z.tuple([
  z.number().min(MIN_STAT_VALUE).max(MAX_STAT_VALUE).default(MIN_STAT_VALUE),
  z.number().min(MIN_STAT_VALUE).max(MAX_STAT_VALUE).default(MAX_STAT_VALUE),
])

const _FilteringStatSchema = z.object(
  Object.fromEntries(
    POKEMON_SKILLS.map((skill) => [skill, _StatRangeSchema]),
  ) as Record<PokemonSkill, typeof _StatRangeSchema>,
)

const _FilteringTypeSchema = z.set(z.enum(POKEMON_TYPES))

const FilterSchema = z.object({
  page: z.number().int().positive().default(1),
  perPage: z
    .union([z.literal(10), z.literal(20), z.literal(50), z.literal(100)])
    .default(10),
  search: z.string().optional(),
  stats: _FilteringStatSchema.partial().nullable().default(null),
  types: _FilteringTypeSchema.nullable().default(null),
})

type Filters = z.infer<typeof FilterSchema>
type FilteringStats = z.infer<typeof _FilteringStatSchema>

export {
  type Filters,
  type FilteringStats,
  FilterSchema,
  MIN_STAT_VALUE,
  MAX_STAT_VALUE,
  PER_PAGE_OPTIONS,
}
