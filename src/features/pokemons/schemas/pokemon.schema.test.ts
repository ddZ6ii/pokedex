import { describe, expect, it } from 'vitest'

import {
  PokemonSchema,
  PokemonsPaginatedResponseSchema,
  PokemonsResponseSchema,
} from '@/features/pokemons/schemas/pokemon.schema'
import { makePaginatedResponse, pokemonFixture } from '@/tests/utilities'

const validPaginatedResponse = makePaginatedResponse([pokemonFixture], {
  next: 2,
  last: 10,
  pages: 10,
  items: 100,
})

describe('PokemonSchema', () => {
  it('accepts a valid pokemon', () => {
    expect(PokemonSchema.parse(pokemonFixture)).toEqual(pokemonFixture)
  })

  it('coerces id from string', () => {
    expect(PokemonSchema.parse({ ...pokemonFixture, id: '1' }).id).toBe(1)
  })

  it('rejects id 0', () => {
    expect(() => PokemonSchema.parse({ ...pokemonFixture, id: 0 })).toThrow()
  })

  it('rejects negative id', () => {
    expect(() => PokemonSchema.parse({ ...pokemonFixture, id: -1 })).toThrow()
  })

  it('rejects non-integer id', () => {
    expect(() => PokemonSchema.parse({ ...pokemonFixture, id: 1.5 })).toThrow()
  })

  it('rejects empty name', () => {
    expect(() => PokemonSchema.parse({ ...pokemonFixture, name: '' })).toThrow()
  })

  it('rejects invalid primary_type', () => {
    expect(() =>
      PokemonSchema.parse({ ...pokemonFixture, primary_type: 'InvalidType' }),
    ).toThrow()
  })

  it('accepts null secondary_type', () => {
    expect(
      PokemonSchema.parse({ ...pokemonFixture, secondary_type: null })
        .secondary_type,
    ).toBeNull()
  })

  it('rejects invalid secondary_type', () => {
    expect(() =>
      PokemonSchema.parse({ ...pokemonFixture, secondary_type: 'InvalidType' }),
    ).toThrow()
  })

  it('rejects hp of 0', () => {
    expect(() => PokemonSchema.parse({ ...pokemonFixture, hp: 0 })).toThrow()
  })

  it('rejects negative attack', () => {
    expect(() =>
      PokemonSchema.parse({ ...pokemonFixture, attack: -1 }),
    ).toThrow()
  })

  it('rejects non-integer defense', () => {
    expect(() =>
      PokemonSchema.parse({ ...pokemonFixture, defense: 49.5 }),
    ).toThrow()
  })

  it('rejects non-integer special_attack', () => {
    expect(() =>
      PokemonSchema.parse({ ...pokemonFixture, special_attack: 1.1 }),
    ).toThrow()
  })

  it('rejects non-integer special_defense', () => {
    expect(() =>
      PokemonSchema.parse({ ...pokemonFixture, special_defense: 1.1 }),
    ).toThrow()
  })

  it('rejects speed of 0', () => {
    expect(() => PokemonSchema.parse({ ...pokemonFixture, speed: 0 })).toThrow()
  })

  it('rejects missing required field', () => {
    const { hp: _, ...withoutHp } = pokemonFixture
    expect(() => PokemonSchema.parse(withoutHp)).toThrow()
  })

  it('accepts null evolves_from', () => {
    expect(
      PokemonSchema.parse({ ...pokemonFixture, evolves_from: null })
        .evolves_from,
    ).toBeNull()
  })

  it('coerces evolves_from.id from string', () => {
    expect(
      PokemonSchema.parse({
        ...pokemonFixture,
        evolves_from: { id: '1', name: 'Bulbasaur' },
      }).evolves_from?.id,
    ).toBe(1)
  })

  it('rejects negative evolves_from.id', () => {
    expect(() =>
      PokemonSchema.parse({
        ...pokemonFixture,
        evolves_from: { id: -1, name: 'Bulbasaur' },
      }),
    ).toThrow()
  })
})

describe('PokemonsResponseSchema', () => {
  it('accepts an array of valid pokemons', () => {
    expect(PokemonsResponseSchema.parse([pokemonFixture])).toEqual([
      pokemonFixture,
    ])
  })

  it('accepts an empty array', () => {
    expect(PokemonsResponseSchema.parse([])).toEqual([])
  })

  it('rejects an array with an invalid pokemon', () => {
    expect(() =>
      PokemonsResponseSchema.parse([{ ...pokemonFixture, hp: 0 }]),
    ).toThrow()
  })

  it('rejects a non-array', () => {
    expect(() => PokemonsResponseSchema.parse(pokemonFixture)).toThrow()
  })
})

describe('PokemonsPaginatedResponseSchema', () => {
  it('accepts a valid paginated response', () => {
    expect(
      PokemonsPaginatedResponseSchema.parse(validPaginatedResponse),
    ).toEqual(validPaginatedResponse)
  })

  it('accepts null for prev and next', () => {
    expect(() =>
      PokemonsPaginatedResponseSchema.parse({
        ...validPaginatedResponse,
        prev: null,
        next: null,
      }),
    ).not.toThrow()
  })

  it('accepts numbers for prev and next', () => {
    expect(() =>
      PokemonsPaginatedResponseSchema.parse({
        ...validPaginatedResponse,
        prev: 1,
        next: 3,
      }),
    ).not.toThrow()
  })

  it('rejects string for prev', () => {
    expect(() =>
      PokemonsPaginatedResponseSchema.parse({
        ...validPaginatedResponse,
        prev: 'none',
      }),
    ).toThrow()
  })

  it('rejects string for next', () => {
    expect(() =>
      PokemonsPaginatedResponseSchema.parse({
        ...validPaginatedResponse,
        next: 'none',
      }),
    ).toThrow()
  })

  it('rejects missing data field', () => {
    const { data: _, ...withoutData } = validPaginatedResponse
    expect(() => PokemonsPaginatedResponseSchema.parse(withoutData)).toThrow()
  })

  it('rejects invalid pokemon inside data', () => {
    expect(() =>
      PokemonsPaginatedResponseSchema.parse({
        ...validPaginatedResponse,
        data: [{ ...pokemonFixture, id: -1 }],
      }),
    ).toThrow()
  })

  it('accepts empty data array', () => {
    expect(() =>
      PokemonsPaginatedResponseSchema.parse({
        ...validPaginatedResponse,
        data: [],
      }),
    ).not.toThrow()
  })
})
