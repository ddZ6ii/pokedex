import { createFileRoute } from '@tanstack/react-router'

import { Pokedex } from '@/features/pokemons/components'

export const Route = createFileRoute('/(public)/pokemons')({
  component: Pokedex,
})
