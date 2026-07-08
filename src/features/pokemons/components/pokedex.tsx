import { PokedexControls } from '@/features/pokemons/components/pokedex-controls'
import { Pokemons } from '@/features/pokemons/components/pokemons'
import { Heading } from '@/shared/components/ui/heading'

export function Pokedex() {
  return (
    <section className="flex flex-col items-center gap-8">
      <Heading as="h1" className="text-center">
        Pokédex
      </Heading>

      <PokedexControls />
      <Pokemons />
    </section>
  )
}
