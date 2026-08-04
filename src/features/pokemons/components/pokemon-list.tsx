import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion, type Variants } from 'motion/react'

import {
  PokemonCardMemoized,
  PokemonCardSkeleton,
} from '@/features/pokemons/components/pokemon-card'
import type { Pokemon } from '@/features/pokemons/schemas/pokemon.schema'
import { pokemonsRouteApi as routeApi } from '@/routes/(public)/-route-api'
import { cn } from '@/shared/lib/utils'

const MAX_STAGGER_DURATION = 0.6
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
const REDUCED_CARD_VARIANTS: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
}
const REDUCED_LIST_VARIANTS: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
}

function getListVariants(itemCount: number): Variants {
  return {
    hidden: { opacity: 0.8 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: Math.min(
          0.1,
          MAX_STAGGER_DURATION / Math.max(itemCount, 1),
        ),
      },
    },
  }
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
      className={cn(
        'grid w-full grid-cols-[repeat(auto-fill,312px)] justify-center gap-6',
        className,
      )}
      variants={
        prefersReducedMotion
          ? REDUCED_LIST_VARIANTS
          : getListVariants(pokemons.length)
      }
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
          <Link
            to="/pokemons/$pokemonId"
            params={{ pokemonId: pokemon.id }}
            search={(prev) => prev}
            resetScroll={false}
          >
            <PokemonCardMemoized pokemon={pokemon} />
          </Link>
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
