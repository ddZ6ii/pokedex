import z from 'zod'

const POKEMON_SKILLS = ['hp', 'attack', 'defense', 'speed'] as const
const POKEMON_STAGES = ['base', '2', '3'] as const
const POKEMON_TYPES = [
  'bug',
  'dark',
  'dragon',
  'electric',
  'fairy',
  'fighting',
  'fire',
  'flying',
  'ghost',
  'grass',
  'ground',
  'ice',
  'normal',
  'poison',
  'psychic',
  'rock',
  'steel',
  'water',
] as const

const _PokemonSkillSchema = z.enum(POKEMON_SKILLS)
const _PokemonStageSchema = z.enum(POKEMON_STAGES)
const _PokemonTypeSchema = z.enum(POKEMON_TYPES)

const PokemonAbilitySchema = z.object({
  name: z.string().min(1),
  is_hidden: z.boolean(),
})

const PokemonEvolutionSchema = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().min(1),
})

const PokemonSchema = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().min(1),
  description: z.string().min(1).optional(),
  primary_type: _PokemonTypeSchema,
  secondary_type: _PokemonTypeSchema.nullable(),
  hp: z.number().int().positive(),
  attack: z.number().int().positive(),
  defense: z.number().int().positive(),
  special_attack: z.number().int().positive(),
  special_defense: z.number().int().positive(),
  speed: z.number().int().positive(),
  stage: _PokemonStageSchema,
  evolves_from: PokemonEvolutionSchema.nullable(),
  height: z.number().positive(),
  weight: z.number().positive(),
  abilities: z.array(PokemonAbilitySchema),
  evolves_to: z.array(PokemonEvolutionSchema),
})

const PokemonsResponseSchema = z.array(PokemonSchema)

const PokemonsPaginatedResponseSchema = z.object({
  first: z.number(),
  prev: z.number().nullable(),
  next: z.number().nullable(),
  last: z.number(),
  pages: z.number(),
  items: z.number(),
  data: z.array(PokemonSchema),
})

type PokemonSkill = z.infer<typeof _PokemonSkillSchema>
type PokemonStage = z.infer<typeof _PokemonStageSchema>
type PokemonType = z.infer<typeof _PokemonTypeSchema>
type Pokemon = z.infer<typeof PokemonSchema>
type PokemonAbility = z.infer<typeof PokemonAbilitySchema>
type PokemonEvolution = z.infer<typeof PokemonEvolutionSchema>

type PokemonsPaginatedResponse = z.infer<typeof PokemonsPaginatedResponseSchema>
type PokemonResponse = z.infer<typeof PokemonSchema>

export {
  POKEMON_TYPES,
  POKEMON_SKILLS,
  PokemonSchema,
  PokemonsResponseSchema,
  PokemonsPaginatedResponseSchema,
  type Pokemon,
  type PokemonAbility,
  type PokemonEvolution,
  type PokemonResponse,
  type PokemonsPaginatedResponse,
  type PokemonSkill,
  type PokemonStage,
  type PokemonType,
}
