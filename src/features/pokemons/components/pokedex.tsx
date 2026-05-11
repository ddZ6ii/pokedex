import { Pokemons } from '@/features/pokemons/components/pokemons'
import { Filters } from '@/features/filters/components'
import { Heading } from '@/shared/components/ui/heading'
import { cn } from '@/shared/lib/utils'

export function Pokedex({ className }: { className?: string }) {
  return (
    <section className={cn('flex flex-col items-center gap-8', className)}>
      <Heading as="h1" className="text-center">
        Pokédex
      </Heading>
      <Filters />
      <Pokemons />
    </section>
  )
}
