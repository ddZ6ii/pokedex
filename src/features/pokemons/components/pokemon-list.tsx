import {
  PokemonCardMemoized,
  PokemonCardSkeleton,
} from '@/features/pokemons/components/pokemon-card'
import type { Pokemon } from '@/features/pokemons/schemas/pokemon.schema'
import { cn } from '@/shared/lib/utils'
import { usePerPage } from '@/shared/store'

function PokemonList({
  'aria-busy': ariaBusy,
  className,
  pokemons,
}: {
  'aria-busy'?: boolean
  className?: string
  pokemons: Pokemon[]
}) {
  if (pokemons.length === 0) {
    return <p className="text-center">No pokemons found.</p>
  }

  return (
    <ul
      aria-busy={ariaBusy}
      className={cn('flex flex-1 flex-wrap justify-center gap-6', className)}
    >
      {pokemons.map((pokemon) => (
        <li key={pokemon.id}>
          <PokemonCardMemoized pokemon={pokemon} />
        </li>
      ))}
    </ul>
  )
}

function PokemonListSkeleton() {
  const perPage = usePerPage()

  return (
    <div role="status" aria-live="polite">
      <ul className="flex flex-wrap justify-center gap-6">
        {Array.from({ length: perPage }).map((_, index) => (
          <li key={index}>
            <PokemonCardSkeleton aria-hidden={true} />
          </li>
        ))}
      </ul>
    </div>
  )
}

export { PokemonList, PokemonListSkeleton }
