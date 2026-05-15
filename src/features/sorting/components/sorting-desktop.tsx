import { useTransition } from 'react'

import { SortingControls } from '@/features/sorting/components/sorting-controls'
import { useSorting, useSortingActions } from '@/shared/store'

type SortingDesktopProps = {
  className?: string
}

export function SortingDesktop({ className }: SortingDesktopProps) {
  const [isPending, startTransition] = useTransition()
  const { sortBy, sortOrder } = useSorting()
  const { setSorting } = useSortingActions()

  return (
    <SortingControls
      disabled={isPending}
      className={className}
      selectedSortBy={sortBy}
      selectedOrderBy={sortOrder}
      onSortBySelect={(nextSortBy) => {
        const nextSortOrder = nextSortBy && (sortOrder ?? 'asc')
        startTransition(() => {
          setSorting(nextSortBy, nextSortOrder)
        })
      }}
      onSortOrderSelect={(nextSortOrder) => {
        startTransition(() => {
          setSorting(sortBy, nextSortOrder)
        })
      }}
    />
  )
}
