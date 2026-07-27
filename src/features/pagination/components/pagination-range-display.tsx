import { getRouteApi } from '@tanstack/react-router'

import { cn } from '@/shared/lib/utils'

const routeApi = getRouteApi('/(public)/pokemons')

export function PaginationRangeDisplay({
  className,
  totalItems,
}: {
  className?: string
  totalItems: number
}) {
  const { page, perPage } = routeApi.useSearch()

  return (
    <p
      className={cn(
        'text-muted-foreground min-w-28 whitespace-nowrap lg:min-w-60',
        className,
      )}
    >
      <span className="hidden lg:inline">Showing</span>{' '}
      {perPage * (page - 1) + 1} - {Math.min(page * perPage, totalItems)} of{' '}
      {totalItems} <span className="hidden lg:inline">pokemons</span>
    </p>
  )
}
