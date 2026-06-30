import z from 'zod'

const POKEMON_SKILLS = ['hp', 'attack', 'defense', 'speed'] as const
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

const _PokemonSkillsSchema = z.enum(POKEMON_SKILLS)
const _PokemonTypeSchema = z.enum(POKEMON_TYPES)

const PokemonSchema = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().min(1),
  primary_type: _PokemonTypeSchema,
  secondary_type: _PokemonTypeSchema.nullable(),
  hp: z.number().int().positive(),
  attack: z.number().int().positive(),
  defense: z.number().int().positive(),
  special_attack: z.number().int().positive(),
  special_defense: z.number().int().positive(),
  speed: z.number().int().positive(),
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

type PokemonType = z.infer<typeof _PokemonTypeSchema>
type PokemonSkills = z.infer<typeof _PokemonSkillsSchema>
type Pokemon = z.infer<typeof PokemonSchema>

type PokemonsPaginatedResponse = z.infer<typeof PokemonsPaginatedResponseSchema>

export {
  POKEMON_TYPES,
  POKEMON_SKILLS,
  PokemonSchema,
  PokemonsResponseSchema,
  PokemonsPaginatedResponseSchema,
  type Pokemon,
  type PokemonType,
  type PokemonSkills,
  type PokemonsPaginatedResponse,
}
