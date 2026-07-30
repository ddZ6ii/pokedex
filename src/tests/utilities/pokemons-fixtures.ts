import type { PokemonsPaginatedResponse } from '@/features/pokemons/schemas'

export const POKEMONS_URL = '*/pokemons'

export const emptyPokemonsResponse: PokemonsPaginatedResponse = {
  first: 1,
  prev: null,
  next: null,
  last: 1,
  pages: 0,
  items: 0,
  data: [],
}

export const successPokemonsResponse: PokemonsPaginatedResponse = {
  ...emptyPokemonsResponse,
  pages: 1,
  items: 1,
  data: [
    {
      id: 1,
      name: 'Bulbasaur',
      primary_type: 'grass',
      secondary_type: 'poison',
      hp: 45,
      attack: 49,
      defense: 49,
      special_attack: 65,
      special_defense: 65,
      speed: 45,
      stage: 'base',
      evolves_from_id: null,
      evolves_from_name: null,
    },
  ],
}
