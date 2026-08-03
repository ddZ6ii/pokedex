import type {
  Pokemon,
  PokemonsPaginatedResponse,
} from '@/features/pokemons/schemas'

export const POKEMONS_URL = '*/pokemons'
export const POKEMON_URL = '*/pokemons/:id'

export const emptyPokemonsResponse: PokemonsPaginatedResponse = {
  first: 1,
  prev: null,
  next: null,
  last: 1,
  pages: 0,
  items: 0,
  data: [],
}

export const pokemonFixture: Pokemon = {
  id: 1,
  name: 'Bulbasaur',
  description: 'A strange seed was planted on its back at birth.',
  primary_type: 'grass',
  secondary_type: 'poison',
  hp: 45,
  attack: 49,
  defense: 49,
  special_attack: 65,
  special_defense: 65,
  speed: 45,
  stage: 'base',
  evolves_from: null,
  height: 0.7,
  weight: 6.9,
  abilities: [
    { name: 'overgrow', is_hidden: false },
    { name: 'chlorophyll', is_hidden: true },
  ],
  evolves_to: [{ id: 2, name: 'Ivysaur' }],
}

export function makePokemon(overrides: Partial<Pokemon> = {}): Pokemon {
  const { description: _description, ...listPokemon } = pokemonFixture
  return { ...listPokemon, ...overrides }
}

export function makePaginatedResponse(
  data: Pokemon[],
  overrides: Partial<PokemonsPaginatedResponse> = {},
): PokemonsPaginatedResponse {
  return {
    ...emptyPokemonsResponse,
    pages: 1,
    items: data.length,
    data,
    ...overrides,
  }
}
