import { memo, useState } from 'react'

import { WithTooltip } from '@/shared/components'
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card'
import { Heading } from '@/shared/components/ui/heading'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  POKEMON_SKILLS,
  type Pokemon,
  type PokemonType,
} from '@/features/pokemons/schemas'
import { cn } from '@/shared/lib/utils'

const BASE_IMAGE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork'

const COLORS = new Map<PokemonType, string>([
  ['Bug', 'bg-[#92bd2d]'],
  ['Dark', 'bg-[#595761]'],
  ['Dragon', 'bg-[#076ac8]'],
  ['Electric', 'bg-[#f2d94e]'],
  ['Fairy', 'bg-[#ee91e5]'],
  ['Fighting', 'bg-[#d3425f]'],
  ['Fire', 'bg-[#fba54d]'],
  ['Flying', 'bg-[#a1bbec]'],
  ['Ghost', 'bg-[#5f6dbc]'],
  ['Grass', 'bg-[#5fbe58]'],
  ['Ground', 'bg-[#da7c4c]'],
  ['Ice', 'bg-[#76d0c1]'],
  ['Normal', 'bg-[#a0a29f]'],
  ['Poison', 'bg-[#b863cf]'],
  ['Psychic', 'bg-[#fa8582]'],
  ['Rock', 'bg-[#c9bc8a]'],
  ['Steel', 'bg-[#5894a3]'],
  ['Water', 'bg-[#549ce0]'],
])

const getColorForType = (type: PokemonType): string => {
  const color = COLORS.get(type)
  if (!color) {
    throw new Error(
      `No color found for pokemon type "${type}". Please ensure that all types have a corresponding color defined in the COLORS map.`,
    )
  }
  return color
}

function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <Card className="relative max-w-xs cursor-pointer">
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        {pokemon.type.map((type) => (
          <WithTooltip key={type} tooltip={type} side="right">
            <div
              className={cn(
                'size-6 cursor-pointer rounded-full p-1 transition-transform hover:scale-110',
                getColorForType(type),
              )}
            >
              <img
                loading="lazy"
                src={`/pokemon-types/${type.toLowerCase()}.svg`}
                alt={type}
                width={16}
                height={16}
                className="aspect-square w-full object-cover"
              />
            </div>
          </WithTooltip>
        ))}
      </div>

      <CardContent>
        <div className="flex flex-col items-center gap-4">
          {!loaded && <ImageSkeleton />}
          <img
            src={`${BASE_IMAGE_URL}/${String(pokemon.id)}.png`}
            alt={pokemon.name}
            width={280}
            height={280}
            className={cn('mx-auto block size-70', !loaded && 'hidden')}
            onLoad={() => {
              setLoaded(true)
            }}
          />
          <Heading as="h2">{pokemon.name}</Heading>
        </div>
      </CardContent>

      <CardFooter>
        <div className="text-muted-foreground flex w-full items-center text-xs">
          {POKEMON_SKILLS.map((skill) => (
            <WithTooltip
              key={skill}
              tooltip={`${skill}: ${String(pokemon[skill])}`}
              className="after:bg-muted-foreground hover:text-foreground relative flex flex-1 justify-center transition-[colors_transform] after:absolute after:right-0 after:h-4 after:w-px after:content-[''] last:after:hidden hover:scale-110"
            >
              <div className="flex cursor-pointer items-center gap-1">
                <img
                  loading="lazy"
                  src={`/pokemon-skills/${skill}.svg`}
                  alt={skill}
                  width={20}
                  height={20}
                  className="size-5"
                />
                <span>{pokemon[skill]}</span>
              </div>
            </WithTooltip>
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

function ImageSkeleton() {
  return <Skeleton className="size-70 rounded-full" />
}

function PokemonCardSkeleton() {
  return (
    <Card className="relative max-w-xs">
      <div className="absolute top-2 right-2 flex flex-col gap-2">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="size-6 rounded-full" />
      </div>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <ImageSkeleton />
          <Skeleton className="h-7 w-1/2" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-muted-foreground flex w-full items-center justify-between text-xs">
          {Array.from({ length: POKEMON_SKILLS.length }).map((_, i) => (
            <Skeleton key={i} className="flex h-5 w-1/5 justify-center" />
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

const PokemonCardMemoized = memo(PokemonCard)

export { PokemonCardMemoized, PokemonCardSkeleton }
