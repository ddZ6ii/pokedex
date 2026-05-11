import { useState } from 'react'

import {
  type SelectSortByOptions,
  type SelectSortOrderOptions,
} from '@/features/filters/schemas'
import { SortingControls } from '@/features/sorting/components/sorting-controls'
import { SortingMobileDrawer } from '@/features/sorting/components/sorting-mobile-drawer'
import { cn } from '@/shared/lib/utils'
import { useFiltersActions, useSortFilters } from '@/shared/store'

type SortingMobileProps = {
  className?: string
}

export function SortingMobile({ className }: SortingMobileProps) {
  const { sortBy, sortOrder } = useSortFilters()
  const { setSorting, resetSorting } = useFiltersActions()

  const [selectedSortBy, setSelectedSortBy] =
    useState<SelectSortByOptions | null>(sortBy)

  const [selectedOrderBy, setSelectedOrderBy] =
    useState<SelectSortOrderOptions | null>(sortBy == null ? null : sortOrder)

  const handleSelectSortBy = (nextSortBy: SelectSortByOptions | null) => {
    setSelectedSortBy(nextSortBy)
    // If sortBy is being cleared, also clear orderBy. Otherwise, if orderBy is not already set, default it to 'asc'.
    setSelectedOrderBy(nextSortBy == null ? null : (selectedOrderBy ?? 'asc'))
  }

  const handleSelectSortOrder = (
    nextSortOrder: SelectSortOrderOptions | null,
  ) => {
    setSelectedOrderBy(nextSortOrder)
  }

  // Sync local component state with global store
  const handleDrawerOpen = () => {
    setSelectedSortBy(sortBy)
    setSelectedOrderBy(sortBy == null ? null : sortOrder)
  }

  const handleApplySorting = () => {
    setSorting(selectedSortBy, selectedOrderBy ?? 'asc')
  }

  const handleResetSorting = () => {
    setSelectedSortBy(null)
    setSelectedOrderBy(null)
    resetSorting()
  }

  const hasSortingApplied = sortBy !== null

  return (
    <SortingMobileDrawer
      onOpen={handleDrawerOpen}
      onApply={handleApplySorting}
      onReset={handleResetSorting}
      className={cn(
        hasSortingApplied &&
          'dark:text-foreground! text-background bg-primary! hover:bg-primary/95! hover:text-background',
        className,
      )}
    >
      <SortingControls
        className="p-4"
        selectedSortBy={selectedSortBy}
        selectedOrderBy={selectedOrderBy}
        onSortBySelect={handleSelectSortBy}
        onSortOrderSelect={handleSelectSortOrder}
      />
    </SortingMobileDrawer>
  )
}
