import { motion } from 'motion/react'
import { memo } from 'react'

import { useMouseTilt } from '@/features/pokemons/hooks/useMouseTilt'
import {
  BASE_IMAGE_URL,
  usePokemonImage,
} from '@/features/pokemons/hooks/usePokemonImage'
import { useRetryableImage } from '@/features/pokemons/hooks/useRetryableImage'
import {
  POKEMON_SKILLS,
  POKEMON_TYPES,
  type Pokemon,
  type PokemonStage,
  type PokemonType,
} from '@/features/pokemons/schemas/pokemon.schema'
import { getPokemonTypes } from '@/features/pokemons/utilities/get-pokemon-types'
import { WithTooltip } from '@/shared/components'
import { Card, CardContent, CardFooter } from '@/shared/components/ui/card'
import { Heading } from '@/shared/components/ui/heading'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'
import { capitalize, nth } from '@/shared/utilities'

// Backgrounds are lossy WebP (q=90), not PNG — see
// scripts/generate-pokemon-backgrounds-webp.sh. Gradient/textured card art
// is a poor fit for PNG's lossless compression; WebP cuts ~85-90% off file
// size here with no visible quality loss at this app's render size.
const BG_IMAGES = new Map<PokemonType, string>([
  ['bug', '/pokemon-backgrounds/bg-bug.webp'],
  ['dark', '/pokemon-backgrounds/bg-dark.webp'],
  ['dragon', '/pokemon-backgrounds/bg-dragon.webp'],
  ['electric', '/pokemon-backgrounds/bg-electric.webp'],
  ['fairy', '/pokemon-backgrounds/bg-fairy.webp'],
  ['fighting', '/pokemon-backgrounds/bg-fighting.webp'],
  ['fire', '/pokemon-backgrounds/bg-fire.webp'],
  ['flying', '/pokemon-backgrounds/bg-flying.webp'],
  ['ghost', '/pokemon-backgrounds/bg-ghost.webp'],
  ['grass', '/pokemon-backgrounds/bg-grass.webp'],
  ['ground', '/pokemon-backgrounds/bg-ground.webp'],
  ['ice', '/pokemon-backgrounds/bg-ice.webp'],
  ['normal', '/pokemon-backgrounds/bg-normal.webp'],
  ['poison', '/pokemon-backgrounds/bg-poison.webp'],
  ['psychic', '/pokemon-backgrounds/bg-psychic.webp'],
  ['rock', '/pokemon-backgrounds/bg-rock.webp'],
  ['steel', '/pokemon-backgrounds/bg-steel.webp'],
  ['water', '/pokemon-backgrounds/bg-water.webp'],
])

const TYPE_SPRITE_URL = '/pokemon-types/sprite.webp'

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
    background = background.replace('.webp', '-stage-2.webp')
  }
  if (stage === '3') {
    background = background.replace('.webp', '-stage-3.webp')
  }
  return background
}

function TiltedCard({
  className,
  children,
  background,
  size = 'default',
  ...props
}: Omit<React.ComponentProps<typeof motion.div>, 'style'> & {
  size?: 'default' | 'sm'
  background?: React.ReactNode
}) {
  const {
    handleMouseEnter,
    handleMouseMove,
    handleMouseLeave,
    rotateX,
    rotateY,
  } = useMouseTilt()

  return (
    <motion.div
      data-slot="card"
      data-size={size}
      className={cn(
        'group/card bg-card text-card-foreground ring-foreground/10 flex flex-col gap-4 rounded-xl py-4 text-sm ring-1 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0',
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY }}
      {...props}
    >
      {/*
        Kept out of the transform-3d chain on purpose: overflow-hidden forces
        transform-style back to flat (per spec, enforced strictly by Firefox),
        which would collapse every translate-z descendant onto one plane.
      */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-xl">
        {background}
      </div>

      {children as React.ReactNode}

      {/* Shimmer effect  */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl opacity-0 group-hover/card:opacity-100">
        <div className="motion-safe:group-hover/card:animate-shimmer absolute inset-y-0 left-1/2 w-1/3 -translate-x-1/2 bg-linear-to-r from-transparent via-white/60 to-transparent opacity-0" />
      </div>
    </motion.div>
  )
}

// All 18 type icons live in one sprite (public/pokemon-types/sprite.png,
// generated via `magick ... +append` from the individual icons, then
// converted to WebP via `cwebp -lossless`) instead of one PNG per type —
// with up to 2 type icons per card across a full list page, that turns
// dozens of per-render image requests into a single cached one. Regenerate
// both files if the source icons in public/pokemon-types/*.png ever change.
function TypeIcon({ type }: { type: PokemonType }) {
  const index = POKEMON_TYPES.indexOf(type)
  const lastIndex = POKEMON_TYPES.length - 1

  return (
    <div
      role="img"
      aria-label={type}
      className="block aspect-square w-full"
      style={{
        backgroundImage: `url('${TYPE_SPRITE_URL}')`,
        backgroundSize: `${(POKEMON_TYPES.length * 100).toString()}% 100%`,
        backgroundPositionX: `${((index / lastIndex) * 100).toString()}%`,
        backgroundPositionY: '0',
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}

function PokemonCard({
  pokemon,
  priority = false,
}: {
  pokemon: Pokemon
  priority?: boolean
}) {
  const { src, loaded, failed, handleLoad, handleError } = usePokemonImage(
    pokemon.id,
  )

  const types: PokemonType[] = getPokemonTypes(pokemon)

  const backgroundUrl = getBackgroundForType(nth(types, 0), pokemon.stage)
  const {
    src: backgroundSrc,
    loaded: backgroundLoaded,
    failed: backgroundFailed,
    handleLoad: handleBackgroundLoad,
    handleError: handleBackgroundError,
  } = useRetryableImage(backgroundUrl)

  const evolvesFromUrl = pokemon.evolves_from
    ? `${BASE_IMAGE_URL}/${String(pokemon.evolves_from.id)}.png`
    : null
  const showEvolvesFrom = pokemon.stage !== 'base' && Boolean(evolvesFromUrl)
  const {
    src: evolvesFromSrc,
    loaded: evolvesFromLoaded,
    failed: evolvesFromFailed,
    handleLoad: handleEvolvesFromLoad,
    handleError: handleEvolvesFromError,
  } = useRetryableImage(evolvesFromUrl ?? '')

  // A card is "ready" once every image it needs has either loaded or given
  // up retrying — settling on failure too, so one bad asset can't leave the
  // skeleton stuck forever. Cards without a prior evolution skip that image
  // entirely.
  const allImagesSettled =
    (loaded || failed) &&
    (backgroundLoaded || backgroundFailed) &&
    (!showEvolvesFrom || evolvesFromLoaded || evolvesFromFailed)

  return (
    <TiltedCard
      className={cn(
        'relative min-h-109.5 w-78 cursor-pointer gap-3 p-0 perspective-near transform-3d',
      )}
      background={
        <img
          src={backgroundSrc}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleBackgroundLoad}
          onError={handleBackgroundError}
          className="size-full object-contain object-center"
        />
      }
    >
      <div
        className="outline-muted-foreground/20 absolute top-3.5 right-3.5 z-10 flex rounded-full outline transform-3d"
        // Freeze the card tilt while hovering: this pill sits far from the
        // tilt's rotation center, so letting mousemove keep re-tilting the
        // card shifts the badge out from under the cursor and flickers hover.
        onMouseMove={(e) => {
          e.stopPropagation()
        }}
      >
        {types.map((type) => (
          <WithTooltip key={type} tooltip={capitalize(type)} side="top">
            <div className="size-7 cursor-pointer rounded-full p-0.5 hover:drop-shadow-lg motion-safe:hover:translate-z-14 motion-safe:hover:scale-110 motion-safe:hover:scale-3d">
              <TypeIcon type={type} />
            </div>
          </WithTooltip>
        ))}
      </div>

      {showEvolvesFrom && (
        <div
          className={cn(
            'absolute top-8.5 left-5 z-10 size-8 rounded-full transition-transform duration-500 hover:drop-shadow-lg hover:drop-shadow-black/60 motion-safe:hover:translate-z-2 motion-safe:hover:scale-300 motion-safe:hover:scale-3d',
            allImagesSettled && 'translate-z-1',
          )}
          // Same tilt-freeze as the type badges above — this badge is also
          // off-center enough for continuous re-tilting to flicker its hover.
          onMouseMove={(e) => {
            e.stopPropagation()
          }}
        >
          <WithTooltip
            tooltip={`Evolves from ${pokemon.evolves_from?.name ?? ''}`}
            side="top"
            className="h-full w-full"
          >
            <img
              src={evolvesFromSrc}
              alt={pokemon.evolves_from?.name ?? ''}
              width={40}
              height={40}
              loading="lazy"
              className="mx-auto block object-cover"
              onLoad={handleEvolvesFromLoad}
              onError={handleEvolvesFromError}
            />
          </WithTooltip>
        </div>
      )}

      <CardContent className="perspective-normal transform-3d">
        <div className="relative flex flex-col items-center gap-2 text-black perspective-normal transform-3d">
          <img
            src={src}
            alt={pokemon.name}
            width={280}
            height={280}
            loading="lazy"
            className={cn(
              'mx-auto block translate-y-0 scale-70 object-cover drop-shadow-xl drop-shadow-black/40',
              allImagesSettled && 'translate-z-2',
            )}
            onError={handleError}
            onLoad={handleLoad}
          />
          <Heading
            as="h2"
            className={cn(
              'font-heading -mt-13 font-medium tracking-wide text-shadow-white lg:text-xl',
              allImagesSettled && 'translate-z-2',
            )}
          >
            {pokemon.name}
          </Heading>
          {pokemon.description && (
            <p
              className={cn(
                'text-shadow-accent mx-2 mt-1 line-clamp-3 px-4',
                allImagesSettled && 'translate-z-2',
              )}
            >
              {pokemon.description}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="mx-2 mt-1 mb-8 rounded-none border-none bg-transparent px-4 py-1.5 transform-3d">
        <div
          className={cn(
            'text-muted-foreground ml-3 flex w-full items-center gap-4 text-xs',
            allImagesSettled && 'translate-z-2',
          )}
        >
          {POKEMON_SKILLS.map((skill) => (
            <WithTooltip
              key={skill}
              tooltip={`${capitalize(skill)}: ${String(pokemon[skill])}`}
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

      {!allImagesSettled && (
        // Inside this card's preserve-3d context, sibling stacking is
        // decided by 3D depth (translate-z), not z-index — so the content
        // this overlay needs to hide stays flat (no translate-z) until
        // allImagesSettled flips, keeping the overlay's z-index authoritative.
        <PokemonCardSkeleton
          aria-hidden={true}
          className="absolute inset-0 z-20"
        />
      )}
    </TiltedCard>
  )
}

function ImageSkeleton({ className }: { className?: string }) {
  return <Skeleton className={cn('h-45.5 w-full', className)} />
}

function PokemonCardSkeleton({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card className={cn('relative h-109.5 w-78', className)} {...props}>
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
              // eslint-disable-next-line react-x/no-array-index-key -- static-length skeleton placeholders, never reordered/added/removed individually
              <Skeleton key={i} className="flex h-3.5 justify-center" />
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="mx-2 mb-8 rounded-none border-none bg-transparent px-4 py-1.5">
        <div className="text-muted-foreground flex w-full items-center gap-4 text-xs">
          {POKEMON_SKILLS.map((skill) => (
            <Skeleton key={skill} className="h-5.5 w-1/6" />
          ))}
        </div>
      </CardFooter>
    </Card>
  )
}

const PokemonCardMemoized = memo(PokemonCard)

export { PokemonCardMemoized, PokemonCardSkeleton }
