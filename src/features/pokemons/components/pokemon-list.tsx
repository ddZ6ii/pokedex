import { motion, useReducedMotion, type Variants } from 'motion/react'
import { getRouteApi } from '@tanstack/react-router'

import {
  PokemonCardMemoized,
  PokemonCardSkeleton,
} from '@/features/pokemons/components/pokemon-card'
import type { Pokemon } from '@/features/pokemons/schemas/pokemon.schema'
import { cn } from '@/shared/lib/utils'

const routeApi = getRouteApi('/(public)/pokemons')

const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
}

const LIST_VARIANTS: Variants = {
  hidden: { opacity: 0.8 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const REDUCED_CARD_VARIANTS: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
}

const REDUCED_LIST_VARIANTS: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
}

function PokemonList({
  'aria-busy': ariaBusy,
  className,
  pokemons,
}: {
  'aria-busy'?: boolean
  className?: string
  pokemons: Pokemon[]
}) {
  const prefersReducedMotion = useReducedMotion()

  if (pokemons.length === 0) {
    return <p className="text-center">No pokemons found.</p>
  }

  return (
    <motion.ul
      aria-busy={ariaBusy}
      className={cn('flex flex-1 flex-wrap justify-center gap-6', className)}
      variants={prefersReducedMotion ? REDUCED_LIST_VARIANTS : LIST_VARIANTS}
      initial={'hidden'}
      animate="visible"
    >
      {pokemons.map((pokemon) => (
        <motion.li
          key={pokemon.id}
          variants={
            prefersReducedMotion ? REDUCED_CARD_VARIANTS : CARD_VARIANTS
          }
          className="perspective-distant"
        >
          <PokemonCardMemoized pokemon={pokemon} />
        </motion.li>
      ))}
    </motion.ul>
  )
}

function PokemonListSkeleton() {
  const { perPage } = routeApi.useSearch()

  return (
    <div role="status" aria-live="polite">
      <ul className="flex flex-wrap justify-center gap-6">
        {Array.from({ length: perPage }).map((_, index) => (
          // eslint-disable-next-line react-x/no-array-index-key -- static-length skeleton placeholders, never reordered/added/removed individually
          <li key={index}>
            <PokemonCardSkeleton aria-hidden={true} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export { PokemonList, PokemonListSkeleton }
