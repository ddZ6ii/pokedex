import type { Pokemon, PokemonType } from '@/features/pokemons/schemas'

export function getPokemonTypes(pokemon: Pokemon): PokemonType[] {
  const types: PokemonType[] = [pokemon.primary_type]
  if (pokemon.secondary_type) {
    types.push(pokemon.secondary_type)
  }
  return types
}
