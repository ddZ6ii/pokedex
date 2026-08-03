import type { Pokemon } from '@/features/pokemons/schemas'

export class PokemonNotFoundError extends Error {
  id: Pokemon['id']
  status = 404

  constructor(id: Pokemon['id']) {
    super(`No Pokémon found with id ${id.toString()}.`)
    this.name = 'PokemonNotFoundError'
    this.id = id
  }
}
