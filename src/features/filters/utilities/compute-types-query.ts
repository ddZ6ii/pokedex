import { type Filters } from '@/features/filters/schemas/filter.schema'
import { type PokemonType } from '@/features/pokemons/schemas'

type TypeCondition =
  | { primary_type: { eq: PokemonType } }
  | { secondary_type: { eq: PokemonType } }

export type TypesQuery = { or: TypeCondition[] }

export function computeTypesQuery(types: Filters['types']): TypesQuery | null {
  if (!types || types.size === 0) return null

  const conditions = [...types].flatMap<TypeCondition>((type) => [
    { primary_type: { eq: type } },
    { secondary_type: { eq: type } },
  ])

  return { or: conditions }
}
