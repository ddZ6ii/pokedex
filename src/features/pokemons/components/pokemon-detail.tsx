import {
  QueryErrorResetBoundary,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useNavigate, type ErrorComponentProps } from '@tanstack/react-router'
import { Suspense } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'

import { PokemonNotFoundError } from '@/features/pokemons/api'
import { EvolutionLink } from '@/features/pokemons/components/evolution-link'
import { usePokemonImage } from '@/features/pokemons/hooks/usePokemonImage'
import { createPokemonQueryOptions } from '@/features/pokemons/api/pokemon.query.options'
import { POKEMON_SKILLS, type Pokemon } from '@/features/pokemons/schemas'
import { getPokemonTypes } from '@/features/pokemons/utilities/get-pokemon-types'
import { pokemonRouteApi as routeApi } from '@/routes/(public)/-route-api'
import { Category, ErrorFallback } from '@/shared/components'
import { Badge } from '@/shared/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'
import { capitalize } from '@/shared/utilities'
import { headingVariants } from '@/shared/components/ui/heading'

function WidgetFallback({ error, ...props }: FallbackProps) {
  const title =
    error instanceof PokemonNotFoundError
      ? 'Pokémon not found'
      : 'Failed to load pokemon details'
  return (
    <>
      <DialogTitle>Unable to load Pokémon</DialogTitle>
      <ErrorFallback
        error={error}
        {...props}
        title={title}
        className="h-full"
      />
    </>
  )
}

function PokemonModalShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          void navigate({
            to: '/pokemons',
            resetScroll: false,
            search: (prev) => prev,
          })
        }
      }}
    >
      <DialogContent className="p-8">{children}</DialogContent>
    </Dialog>
  )
}

function PokemonDetailFetcher() {
  const { pokemonId } = routeApi.useParams()

  const { data: pokemon } = useSuspenseQuery(
    createPokemonQueryOptions(pokemonId),
  )

  return <PokemonDetail key={pokemon.id} pokemon={pokemon} />
}

function PokemonDetail({ pokemon }: { pokemon: Pokemon }) {
  const { src, loaded, handleLoad, handleError } = usePokemonImage(pokemon.id)

  const types = getPokemonTypes(pokemon)

  return (
    <>
      <DialogHeader className="lg:gap-6">
        <DialogTitle
          className={cn(
            headingVariants({ as: 'h2' }),
            'text-center tracking-wide',
          )}
        >
          {pokemon.name}
        </DialogTitle>
        <DialogDescription className="lg:text-base">
          {pokemon.description ?? 'No description available.'}
        </DialogDescription>
      </DialogHeader>

      <div className="-mt-4 grid gap-x-12 gap-y-4 text-sm sm:mt-0 sm:grid-cols-[220px_1fr] lg:mt-4 lg:text-base">
        <div className="space-y-2">
          {!loaded && <ImageSkeleton className="rounded-full" />}
          <img
            src={src}
            alt={pokemon.name}
            width={232}
            height={232}
            loading="lazy"
            className={cn(
              'mx-auto block size-30 sm:size-50 lg:size-58',
              !loaded && 'opacity-0',
            )}
            onError={handleError}
            onLoad={handleLoad}
          />

          <dl className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-4 lg:text-sm">
            <div className="flex items-center gap-x-2">
              <dt>Height:</dt>
              <dd>{pokemon.height} m</dd>
            </div>
            <div className="flex items-center gap-x-2">
              <dt>Weight:</dt>
              <dd>{pokemon.weight} kg</dd>
            </div>
          </dl>
        </div>

        <div className="mt-2 grid content-start gap-4">
          <Category label="Types">
            <div className="flex flex-wrap gap-1">
              {types.map((type) => (
                <Badge
                  key={type}
                  variant="outline"
                  className="h-auto py-0.5 text-[length:inherit]"
                >
                  {capitalize(type)}
                </Badge>
              ))}
            </div>
          </Category>

          <Category label=" Abilities">
            <div className="flex flex-wrap gap-1">
              {pokemon.abilities
                .filter((ability) => !ability.is_hidden)
                .map((ability) => (
                  <Badge
                    key={ability.name}
                    variant="outline"
                    className="h-auto py-0.5 text-[length:inherit]"
                  >
                    {capitalize(ability.name.replace(/-/g, ' '))}
                    {ability.is_hidden && ' (Hidden)'}
                  </Badge>
                ))}
            </div>
          </Category>

          {pokemon.evolves_from && (
            <Category label=" Evolves from">
              <EvolutionLink
                name={pokemon.evolves_from.name}
                id={pokemon.evolves_from.id}
              />
            </Category>
          )}

          {pokemon.evolves_to.length > 0 && (
            <Category label=" Evolves to">
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {pokemon.evolves_to.map((evolution) => (
                  <EvolutionLink
                    key={evolution.id}
                    id={evolution.id}
                    name={evolution.name}
                  />
                ))}
              </div>
            </Category>
          )}

          <Category label=" Stats" className="space-y-1">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
              {[...POKEMON_SKILLS].sort().map((skill) => (
                <div key={skill} className="flex items-center gap-x-2">
                  <dt className="text-muted-foreground capitalize">{skill}:</dt>
                  <dd className="flex-1 font-semibold">{pokemon[skill]}</dd>
                </div>
              ))}
            </dl>
          </Category>
        </div>
      </div>
    </>
  )
}

function ImageSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton
      className={cn(
        'mx-auto block size-30 rounded-full sm:size-50 lg:size-58',
        className,
      )}
    />
  )
}

function PokemonDetailSkeleton() {
  return (
    <>
      <DialogHeader className="lg:gap-6">
        <DialogTitle>
          <Skeleton className="mx-auto h-7 w-1/4 lg:h-9" />
        </DialogTitle>
        <DialogDescription asChild>
          <Skeleton className="h-5 w-full" />
        </DialogDescription>
      </DialogHeader>

      <div className="-mt-4 grid gap-x-12 gap-y-4 text-sm sm:mt-0 sm:grid-cols-[220px_1fr] lg:mt-4 lg:text-base">
        <div className="space-y-4">
          <ImageSkeleton />

          <dl className="flex gap-x-4">
            <Skeleton className="mx-auto h-5 w-1/2" />
            <Skeleton className="mx-auto h-5 w-1/2" />
          </dl>
        </div>

        <div className="mt-2 grid content-start gap-4">
          <div className="flex flex-wrap items-center gap-x-2">
            <Skeleton className="mr-10 h-5 w-14" />
            {Array.from({ length: 2 }).map((_, index) => (
              // eslint-disable-next-line react-x/no-array-index-key -- static-length skeleton placeholders, never reordered/added/removed individually
              <Skeleton key={index} className="h-6.5 w-14 rounded-4xl" />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-x-2">
            <Skeleton className="mr-6 h-5 w-18" />
            <Skeleton className="h-6.5 w-20 rounded-4xl" />
          </div>

          <div className="flex flex-wrap gap-x-2">
            <Skeleton className="mr-1 h-5 w-23" />
            <Skeleton className="h-5 w-24 rounded-4xl" />
          </div>

          <div className="flex flex-wrap gap-x-2">
            <Skeleton className="mr-4 h-5 w-20" />
            <Skeleton className="h-5 w-24 rounded-4xl" />
          </div>

          <div className="space-y-1">
            <Skeleton className="h-5 w-12" />

            <dl className="grid grid-cols-2 gap-x-4 gap-y-1">
              {Array.from({ length: 4 }).map((_, index) => (
                // eslint-disable-next-line react-x/no-array-index-key -- static-length skeleton placeholders, never reordered/added/removed individually
                <Skeleton key={index} className="my-0.5 mr-4 h-4 w-20" />
              ))}
            </dl>
          </div>
        </div>
      </div>
    </>
  )
}

export function PokemonDetailModal() {
  return (
    <PokemonModalShell>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary FallbackComponent={WidgetFallback} onReset={reset}>
            <Suspense fallback={<PokemonDetailSkeleton />}>
              <PokemonDetailFetcher />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </PokemonModalShell>
  )
}

export function PokemonDetailRouteError({ error, reset }: ErrorComponentProps) {
  return (
    <PokemonModalShell>
      <DialogHeader>
        <DialogTitle>Unable to load Pokémon...</DialogTitle>
      </DialogHeader>
      <ErrorFallback
        error={error}
        resetErrorBoundary={reset}
        title="Pokémon not found"
      />
    </PokemonModalShell>
  )
}
