import { Link } from '@tanstack/react-router'
import { SquareArrowOutUpRight } from 'lucide-react'

export function EvolutionLink({ id, name }: { id: number; name: string }) {
  return (
    <Link
      to="/pokemons/$pokemonId"
      params={{ pokemonId: id }}
      search={(prev) => prev}
      resetScroll={false}
      className="text-sidebar-primary/90 focus-visible:text-sidebar-primary hover:text-sidebar-primary flex items-center gap-0.5 underline-offset-4 hover:underline"
    >
      {name}
      <SquareArrowOutUpRight className="size-[1em]" aria-hidden={true} />
    </Link>
  )
}
