import { getRouteApi } from '@tanstack/react-router'

export const pokemonsRouteApi = getRouteApi('/(public)/pokemons')

export const pokemonRouteApi = getRouteApi('/(public)/pokemons/$pokemonId')
