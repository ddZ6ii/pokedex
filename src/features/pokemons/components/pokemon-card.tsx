import { motion } from 'motion/react'
import { memo, useState } from 'react'

import { useMouseTilt } from '@/features/pokemons/hooks/useMouseTilt'
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

function TiltedCard({
  className,
  children,
  size = 'default',
  ...props
}: React.ComponentProps<typeof motion.div> & { size?: 'default' | 'sm' }) {
  const {
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
    rotateX,
    rotateY,
  } = useMouseTilt()

  const { style, ...restProps } = props
  return (
    <motion.div
      data-slot="card"
      data-size={size}
      className={cn(
        'group/card bg-card text-card-foreground ring-foreground/10 flex flex-col gap-4 overflow-hidden rounded-xl py-4 text-sm ring-1 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl',
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...style,
        rotateX,
        rotateY,
      }}
      {...restProps}
    >
      {children as React.ReactNode}

      {/* Shimmer effect  */}
      <div className="pointer-events-none absolute inset-0 translate-z-44 overflow-hidden rounded-xl opacity-0 group-hover/card:opacity-100">
        <div className="motion-safe:group-hover/card:animate-shimmer absolute inset-y-0 left-1/2 w-1/3 -translate-x-1/2 bg-linear-to-r from-transparent via-white/60 to-transparent opacity-0" />
      </div>
    </motion.div>
  )
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
    <TiltedCard
      className={cn(
        'relative min-h-109.5 max-w-78 cursor-pointer gap-3 p-0 perspective-near transform-3d',
      )}
      style={{
        backgroundImage: `url('${getBackgroundForType(nth(types, 0), pokemon.stage)}')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="outline-muted-foreground/20 absolute top-10 right-8 z-10 flex translate-z-10 rounded-full outline transform-3d">
        {types.map((type) => (
          <WithTooltip key={type} tooltip={capitalize(type)} side="top">
            <div className="size-7 cursor-pointer rounded-full p-0.5 hover:drop-shadow-lg motion-safe:hover:translate-z-14 motion-safe:hover:scale-110 motion-safe:hover:scale-3d">
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
        <div className="hover:drop-shadow-black/60', absolute top-13.5 left-9 z-10 size-8 translate-z-10 rounded-full transition-transform hover:drop-shadow-lg motion-safe:hover:translate-z-14 motion-safe:hover:scale-140 motion-safe:hover:scale-3d">
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
      <CardContent className="transform-3d">
        <div className="relative flex flex-col items-center gap-2 text-black transform-3d">
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
              'mx-auto block translate-y-8 translate-z-36 scale-40 object-cover drop-shadow-xl drop-shadow-black/40 transition-transform hover:drop-shadow-xl hover:drop-shadow-black/60 motion-safe:hover:translate-z-40 motion-safe:hover:scale-3d',
              !loaded && 'opacity-0',
            )}
            onError={handleError}
            onLoad={handleLoad}
          />
          <Heading
            as="h2"
            className="font-heading -mt-13 translate-z-8 font-medium tracking-wide text-shadow-white lg:text-xl"
          >
            {pokemon.name}
          </Heading>
          {pokemon.description && (
            <p className="text-shadow-accent mt-1 line-clamp-3 translate-z-4 px-4">
              {pokemon.description}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="mx-2 -mt-1 mb-8 rounded-none border-none bg-transparent px-4 py-1.5 transform-3d">
        <div className="text-muted-foreground ml-3 flex w-full translate-z-6 items-center gap-4 text-xs">
          {POKEMON_SKILLS.map((skill) => (
            <WithTooltip
              key={skill}
              tooltip={`${skill}: ${String(pokemon[skill])}`}
              className="hover:text-foreground relative flex transition-[colors_transform] after:absolute after:-right-2 after:h-4 after:w-px after:bg-black after:content-[''] last:after:hidden motion-safe:hover:scale-110"
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
    </TiltedCard>
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
