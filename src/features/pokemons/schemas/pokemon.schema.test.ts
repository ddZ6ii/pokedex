import { describe, expect, it } from 'vitest'

import {
  PokemonSchema,
  PokemonsPaginatedResponseSchema,
  PokemonsResponseSchema,
  type Pokemon,
} from '@/features/pokemons/schemas/pokemon.schema'

const validPokemon: Pokemon = {
  id: 1,
  name: 'Bulbasaur',
  primary_type: 'Grass',
  secondary_type: 'Poison',
  hp: 45,
  attack: 49,
  defense: 49,
  special_attack: 65,
  special_defense: 65,
  speed: 45,
}

describe('PokemonSchema', () => {
  it('accepts a valid pokemon', () => {
    expect(PokemonSchema.parse(validPokemon)).toEqual(validPokemon)
  })

  it('coerces id from string', () => {
    expect(PokemonSchema.parse({ ...validPokemon, id: '1' }).id).toBe(1)
  })

  it('rejects id 0', () => {
    expect(() => PokemonSchema.parse({ ...validPokemon, id: 0 })).toThrow()
  })

  it('rejects negative id', () => {
    expect(() => PokemonSchema.parse({ ...validPokemon, id: -1 })).toThrow()
  })

  it('rejects non-integer id', () => {
    expect(() => PokemonSchema.parse({ ...validPokemon, id: 1.5 })).toThrow()
  })

  it('rejects empty name', () => {
    expect(() => PokemonSchema.parse({ ...validPokemon, name: '' })).toThrow()
  })

  it('rejects invalid primary_type', () => {
    expect(() =>
      PokemonSchema.parse({ ...validPokemon, primary_type: 'InvalidType' }),
    ).toThrow()
  })

  it('accepts null secondary_type', () => {
    expect(
      PokemonSchema.parse({ ...validPokemon, secondary_type: null })
        .secondary_type,
    ).toBeNull()
  })

  it('rejects invalid secondary_type', () => {
    expect(() =>
      PokemonSchema.parse({ ...validPokemon, secondary_type: 'InvalidType' }),
    ).toThrow()
  })

  it('rejects hp of 0', () => {
    expect(() => PokemonSchema.parse({ ...validPokemon, hp: 0 })).toThrow()
  })

  it('rejects negative attack', () => {
    expect(() => PokemonSchema.parse({ ...validPokemon, attack: -1 })).toThrow()
  })

  it('rejects non-integer defense', () => {
    expect(() =>
      PokemonSchema.parse({ ...validPokemon, defense: 49.5 }),
    ).toThrow()
  })

  it('rejects non-integer special_attack', () => {
    expect(() =>
      PokemonSchema.parse({ ...validPokemon, special_attack: 1.1 }),
    ).toThrow()
  })

  it('rejects non-integer special_defense', () => {
    expect(() =>
      PokemonSchema.parse({ ...validPokemon, special_defense: 1.1 }),
    ).toThrow()
  })

  it('rejects speed of 0', () => {
    expect(() => PokemonSchema.parse({ ...validPokemon, speed: 0 })).toThrow()
  })

  it('rejects missing required field', () => {
    const { hp: _, ...withoutHp } = validPokemon
    expect(() => PokemonSchema.parse(withoutHp)).toThrow()
  })
})

describe('PokemonsResponseSchema', () => {
  it('accepts an array of valid pokemons', () => {
    expect(PokemonsResponseSchema.parse([validPokemon])).toEqual([validPokemon])
  })

  it('accepts an empty array', () => {
    expect(PokemonsResponseSchema.parse([])).toEqual([])
  })

  it('rejects an array with an invalid pokemon', () => {
    expect(() =>
      PokemonsResponseSchema.parse([{ ...validPokemon, hp: 0 }]),
    ).toThrow()
  })

  it('rejects a non-array', () => {
    expect(() => PokemonsResponseSchema.parse(validPokemon)).toThrow()
  })
})

describe('PokemonsPaginatedResponseSchema', () => {
  const validPaginated = {
    data: [validPokemon],
    first: 1,
    prev: null,
    next: 2,
    last: 10,
    pages: 10,
    items: 100,
  }

  it('accepts a valid paginated response', () => {
    expect(PokemonsPaginatedResponseSchema.parse(validPaginated)).toEqual(
      validPaginated,
    )
  })

  it('accepts null for prev and next', () => {
    expect(() =>
      PokemonsPaginatedResponseSchema.parse({
        ...validPaginated,
        prev: null,
        next: null,
      }),
    ).not.toThrow()
  })

  it('accepts numbers for prev and next', () => {
    expect(() =>
      PokemonsPaginatedResponseSchema.parse({
        ...validPaginated,
        prev: 1,
        next: 3,
      }),
    ).not.toThrow()
  })

  it('rejects string for prev', () => {
    expect(() =>
      PokemonsPaginatedResponseSchema.parse({
        ...validPaginated,
        prev: 'none',
      }),
    ).toThrow()
  })

  it('rejects string for next', () => {
    expect(() =>
      PokemonsPaginatedResponseSchema.parse({
        ...validPaginated,
        next: 'none',
      }),
    ).toThrow()
  })

  it('rejects missing data field', () => {
    const { data: _, ...withoutData } = validPaginated
    expect(() => PokemonsPaginatedResponseSchema.parse(withoutData)).toThrow()
  })

  it('rejects invalid pokemon inside data', () => {
    expect(() =>
      PokemonsPaginatedResponseSchema.parse({
        ...validPaginated,
        data: [{ ...validPokemon, id: -1 }],
      }),
    ).toThrow()
  })

  it('accepts empty data array', () => {
    expect(() =>
      PokemonsPaginatedResponseSchema.parse({ ...validPaginated, data: [] }),
    ).not.toThrow()
  })
})
