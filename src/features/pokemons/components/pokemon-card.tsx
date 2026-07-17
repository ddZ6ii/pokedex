import { memo, useState } from 'react'

import {
  BASE_IMAGE_URL,
  usePokemonImage,
} from '@/features/pokemons/hooks/usePokemonImage'
import {
  POKEMON_SKILLS,
  type Pokemon,
  type PokemonStage,
  type PokemonType,
} from '@/features/pokemons/schemas/pokemon.schema'
import { WithTooltip } from '@/shared/components'
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card'
import { Heading } from '@/shared/components/ui/heading'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'
import { capitalize, nth } from '@/shared/utilities'

const BG_IMAGES = new Map<PokemonType, string>([
  ['bug', '/pokemon-backgrounds/bg-bug.png'],
  ['dark', '/pokemon-backgrounds/bg-dark.png'],
  ['dragon', '/pokemon-backgrounds/bg-dragon.png'],
  ['electric', '/pokemon-backgrounds/bg-electric.png'],
  ['fairy', '/pokemon-backgrounds/bg-fairy.png'],
  ['fighting', '/pokemon-backgrounds/bg-fighting.png'],
  ['fire', '/pokemon-backgrounds/bg-fire.png'],
  ['flying', '/pokemon-backgrounds/bg-flying.png'],
  ['ghost', '/pokemon-backgrounds/bg-ghost.png'],
  ['grass', '/pokemon-backgrounds/bg-grass.png'],
  ['ground', '/pokemon-backgrounds/bg-ground.png'],
  ['ice', '/pokemon-backgrounds/bg-ice.png'],
  ['normal', '/pokemon-backgrounds/bg-normal.png'],
  ['poison', '/pokemon-backgrounds/bg-poison.png'],
  ['psychic', '/pokemon-backgrounds/bg-psychic.png'],
  ['rock', '/pokemon-backgrounds/bg-rock.png'],
  ['steel', '/pokemon-backgrounds/bg-steel.png'],
  ['water', '/pokemon-backgrounds/bg-water.png'],
])

const getBackgroundForType = (
  type: PokemonType,
  stage: PokemonStage,
): string => {
  let background = BG_IMAGES.get(type)
  if (!background) {
    throw new Error(
      `No background found for pokemon type "${type}". Please ensure that all types have a corresponding background defined in the BG_IMAGES map.`,
    )
  }
  if (stage === '2') {
    background = background.replace('.png', '-stage-2.png')
  }
  if (stage === '3') {
    background = background.replace('.png', '-stage-3.png')
  }
  return background
}

function PokemonCard({ pokemon }: { pokemon: Pokemon }) {
  const { src, loaded, handleLoad, handleError } = usePokemonImage(pokemon.id)
  const [evolvesFromLoaded, setEvolvesFromLoaded] = useState(false)

  const types: PokemonType[] = [pokemon.primary_type]
  if (pokemon.secondary_type) {
    types.push(pokemon.secondary_type)
  }

  const evolvesFromSrc = pokemon.evolves_from_id
    ? `${BASE_IMAGE_URL}/${String(pokemon.evolves_from_id)}.png`
    : null

  return (
    <Card
      className={cn('relative min-h-109.5 max-w-78 cursor-pointer gap-3 p-0')}
      style={{
        backgroundImage: `url('${getBackgroundForType(nth(types, 0), pokemon.stage)}')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="outline-muted-foreground/20 absolute top-3.5 right-3.5 z-10 flex rounded-full outline">
        {types.map((type) => (
          <WithTooltip key={type} tooltip={capitalize(type)} side="top">
            <div className="size-7 cursor-pointer rounded-full p-0.5 transition-transform hover:scale-110">
              <img
                src={`/pokemon-types/${type.toLowerCase()}.png`}
                alt={type}
                width={32}
                height={32}
                loading="lazy"
                className="block aspect-square w-full object-cover"
              />
            </div>
          </WithTooltip>
        ))}
      </div>

      {pokemon.stage !== 'base' && evolvesFromSrc && (
        <div className="absolute top-8.5 left-5 z-10 size-8 rounded-full">
          <WithTooltip
            tooltip={`Evolves from ${pokemon.evolves_from_name ?? ''}`}
            side="top"
            className="h-full w-full"
          >
            <img
              src={evolvesFromSrc}
              alt={pokemon.evolves_from_name ?? ''}
              width={40}
              height={40}
              className={cn(
                'mx-auto block object-cover',
                !evolvesFromLoaded && 'opacity-0',
              )}
              onLoad={() => {
                setEvolvesFromLoaded(true)
              }}
            />
          </WithTooltip>
        </div>
      )}

      <CardContent>
        <div className="relative flex flex-col items-center gap-2 text-black">
          {!loaded && (
            <ImageSkeleton className="absolute top-12.5 mx-auto size-42 rounded-full" />
          )}
          <img
            src={src}
            alt={pokemon.name}
            width={280}
            height={280}
            loading="lazy"
            className={cn(
              'mx-auto block -translate-y-1 scale-65 object-cover transition-transform hover:scale-87',
              !loaded && 'opacity-0',
            )}
            onError={handleError}
            onLoad={handleLoad}
          />
          <Heading
            as="h2"
            className="font-heading -mt-12 tracking-wide lg:text-xl"
          >
            {pokemon.name}
          </Heading>
          {pokemon.description && (
            <p className="mt-2 line-clamp-3 px-4">{pokemon.description}</p>
          )}
        </div>
      </CardContent>
      <CardFooter className="mx-2 mb-8 rounded-none border-none bg-transparent px-4 py-1.5">
        <div className="text-muted-foreground ml-2 flex w-full items-center gap-4 text-xs">
          {POKEMON_SKILLS.map((skill) => (
            <WithTooltip
              key={skill}
              tooltip={`${skill}: ${String(pokemon[skill])}`}
              className="hover:text-foreground relative flex transition-[colors_transform] after:absolute after:-right-2 after:h-4 after:w-px after:bg-black after:content-[''] last:after:hidden hover:scale-110"
            >
              <div className="flex cursor-pointer items-center gap-0.5 font-semibold text-black">
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

function ImageSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn('h-45.5 w-full', className)} />
}

function PokemonCardSkeleton() {
  return (
    <Card className="relative h-109.5 w-78">
      <div className="absolute top-3.5 right-3.5 flex gap-1">
        <Skeleton className="size-6 rounded-full" />
        <Skeleton className="size-6 rounded-full" />
      </div>

      <CardContent>
        <div className="mt-8 flex flex-col gap-4 px-2">
          <ImageSkeleton />
          <Skeleton className="mx-auto h-6 w-1/2" />
          <div className="mt-1 space-y-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="flex h-3.5 justify-center" />
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="mx-2 mb-8 rounded-none border-none bg-transparent px-4 py-1.5">
        <div className="text-muted-foreground flex w-full items-center gap-4 text-xs">
          {Array.from({ length: POKEMON_SKILLS.length }).map((_, i) => (
            <Skeleton key={i} className="h-5.5 w-1/6" />
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

const PokemonCardMemoized = memo(PokemonCard)

export { PokemonCardMemoized, PokemonCardSkeleton }
