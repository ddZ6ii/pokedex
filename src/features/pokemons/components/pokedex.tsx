import { Pokemons } from '@/features/pokemons/components/pokemons'
import { Filtering, SearchPokemon } from '@/features/filters/components'
import { Sorting } from '@/features/sorting/components'
import { Heading } from '@/shared/components/ui/heading'
import { cn } from '@/shared/lib/utils'

export function Pokedex({ className }: { className?: string }) {
  return (
    <section className={cn('flex flex-col items-center gap-8', className)}>
      <Heading as="h1" className="text-center">
        Pokédex
      </Heading>

      <div className="flex w-full max-w-78 gap-2 md:max-w-162 2xl:max-w-330">
        <SearchPokemon />

        <div className="flex items-center gap-1 lg:gap-4">
          <Filtering className="flex-1" />
          <Sorting className="flex-1" />
        </div>
      </div>

      <Pokemons />
    </section>
  )
}
