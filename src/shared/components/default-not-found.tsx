import { type NotFoundRouteProps } from '@tanstack/react-router'

import { CustomAnimatedLink } from '@/shared/components'
import { Heading } from '@/shared/components/ui/heading'
import { cn } from '@/shared/lib/utils'

type DefaultNotFoundComponentProps = NotFoundRouteProps &
  React.ComponentProps<'div'>

export function DefaultNotFoundComponent({
  className,
  ...props
}: DefaultNotFoundComponentProps) {
  const {
    isNotFound: _isNotFound,
    routeId: _routeId,
    data: _data,
    ...restProps
  } = props

  return (
    <div
      {...restProps}
      className={cn(
        'flex flex-1 flex-col justify-center gap-8 perspective-near transform-3d',
        className,
      )}
    >
      <div className="space-y-6 text-center">
        <Heading as="h1" className="text-5xl">
          Page Not Found
        </Heading>
        <p className="text-muted-foreground">
          <i>Psyduck is confused...</i> this page doesn&apos;t exist.
        </p>
      </div>

      <img
        src="/not-found.webp"
        alt=""
        width={475}
        height={475}
        className="mx-auto max-w-1/2 -translate-y-4 translate-z-4 rotate-x-6 -rotate-y-6"
      />

      <CustomAnimatedLink to="/pokemons" replace size="xl" variant="default">
        Go to Pokédex
      </CustomAnimatedLink>
    </div>
  )
}
