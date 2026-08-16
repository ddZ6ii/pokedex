import type { Pokemon } from '@/features/pokemons/schemas/pokemon.schema'
import { useRetryableImage } from '@/features/pokemons/hooks/useRetryableImage'

const BASE_IMAGE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

function usePokemonImage(id: Pokemon['id']) {
  return useRetryableImage(`${BASE_IMAGE_URL}/${String(id)}.png`)
}

export { usePokemonImage, BASE_IMAGE_URL }
