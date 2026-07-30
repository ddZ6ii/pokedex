import { describe, expect, it } from 'vitest'

import {
  PokemonsSearchSchema,
  type PokemonsSearch,
} from './pokemons-search.schema'
import { toPokemonsQueryOptions } from '@/features/pokemons/utilities'

const BASE_SEARCH: PokemonsSearch = {
  page: 1,
  perPage: 10,
  search: undefined,
  stats: undefined,
  types: undefined,
  sort: undefined,
}

describe('PokemonsSearchSchema', () => {
  it('defaults page and perPage, and omits search/stats/types/sort when the URL has no search params', () => {
    expect(PokemonsSearchSchema.parse({})).toEqual(BASE_SEARCH)
  })

  it('keeps types as a plain array (not a Set) so it stays URL-serializable', () => {
    const result = PokemonsSearchSchema.parse({ types: ['grass', 'fire'] })
    expect(result.types).toEqual(['grass', 'fire'])
  })

  it('falls back to undefined instead of throwing when search params are malformed', () => {
    expect(
      PokemonsSearchSchema.parse({
        ...BASE_SEARCH,
        perPage: 999,
        types: ['not-a-real-type'],
      }),
    ).toEqual(BASE_SEARCH)
  })
})

describe('toPokemonsQueryOptions', () => {
  it('converts the URL-safe types array into the Set the API layer expects', () => {
    const options = toPokemonsQueryOptions({
      page: 1,
      perPage: 10,
      search: undefined,
      stats: undefined,
      types: ['grass', 'fire'],
      sort: undefined,
    })
    expect(options.types).toEqual(new Set(['grass', 'fire']))
  })

  it('keeps types null when no type filter is applied', () => {
    const options = toPokemonsQueryOptions({
      page: 1,
      perPage: 10,
      search: undefined,
      stats: undefined,
      types: undefined,
      sort: undefined,
    })
    expect(options.types).toBeNull()
  })
})
