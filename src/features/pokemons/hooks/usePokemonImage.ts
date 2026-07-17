import { useRef, useState } from 'react'

import type { Pokemon } from '@/features/pokemons/schemas/pokemon.schema'

const BASE_IMAGE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

const MAX_RETRIES = 3

function usePokemonImage(id: Pokemon['id']) {
  const [loaded, setLoaded] = useState(false)
  const [src, setSrc] = useState(`${BASE_IMAGE_URL}/${String(id)}.png`)
  const retriesRef = useRef(0)

  const handleLoad = () => {
    setLoaded(true)
  }

  // Retry loading the image with exponential backoff if it fails to load
  const handleError = () => {
    if (retriesRef.current >= MAX_RETRIES) return // give up, show fallback

    const delay = 500 * 2 ** retriesRef.current + Math.random() * 200
    retriesRef.current += 1
    setTimeout(() => {
      setSrc(
        `${BASE_IMAGE_URL}/${String(id)}.png?retry=${retriesRef.current.toString()}`,
      )
    }, delay)
  }

  return { src, loaded, handleLoad, handleError }
}

export { usePokemonImage, BASE_IMAGE_URL }
