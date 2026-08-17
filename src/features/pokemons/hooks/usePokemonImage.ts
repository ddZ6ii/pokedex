import type { Pokemon } from '@/features/pokemons/schemas/pokemon.schema'
import { useRetryableImage } from '@/features/pokemons/hooks/useRetryableImage'

// Self-hosted WebP, generated via scripts/generate-pokemon-artwork-webp.sh
// from the official-artwork PNGs (raw.githubusercontent.com/PokeAPI/sprites).
// Hotlinking those directly hurt Lighthouse's cache-lifetimes and
// image-delivery audits: short cache TTL we don't control, PNG instead of
// WebP.
const BASE_IMAGE_URL = '/pokemon-artwork'

function usePokemonImage(id: Pokemon['id']) {
  return useRetryableImage(`${BASE_IMAGE_URL}/${String(id)}.webp`)
}

export { usePokemonImage, BASE_IMAGE_URL }
