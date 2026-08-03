export class InvalidPokemonIdError extends Error {
  status = 400

  constructor(id: string) {
    super(`"${id}" is not a valid Pokémon id.`)
    this.name = 'InvalidPokemonIdError'
  }
}
