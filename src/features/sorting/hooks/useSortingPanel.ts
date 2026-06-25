import { useCallback, useState } from 'react'

import { type SortingCriterion } from '@/features/sorting/schemas/sorting.schema'
import { initialSortingState } from '@/features/sorting/store'
import { useSorting, useSortingActions } from '@/shared/store'
import { nth } from '@/shared/utilities/nth'

export function useSortingPanel() {
  const sorting = useSorting()
  const { setSorting, resetSorting: reset } = useSortingActions()

  const [selectedCriteria, setSelectedCriteria] =
    useState<SortingCriterion[]>(sorting)

  const applySorting = useCallback(() => {
    const activeSelectedCriteria: SortingCriterion[] = []
    activeSelectedCriteria.push(nth(selectedCriteria, 0))
    for (const [sortBy, orderBy] of selectedCriteria.slice(1)) {
      if (sortBy === null || orderBy === null) continue

      activeSelectedCriteria.push([sortBy, orderBy])
    }
    setSorting(activeSelectedCriteria)
  }, [selectedCriteria, setSorting])

  // Sync local component state with global store.
  // This is needed in case user opens the drawer, makes some changes, but doesn't apply them and closes the drawer. When they open it again, we want to show the currently applied sorting options, not the ones they were editing before.
  const syncSorting = useCallback(() => {
    setSelectedCriteria(sorting)
  }, [sorting])

  const resetSorting = useCallback(() => {
    setSelectedCriteria(initialSortingState.sort)
    reset()
  }, [reset])

  const selectedCriteriaCount = selectedCriteria.filter(
    ([sortBy]) => sortBy !== null,
  ).length

  return {
    selectedCriteria,
    selectedCriteriaCount,
    applySorting,
    resetSorting,
    setSelectedCriteria,
    syncSorting,
  }
}
