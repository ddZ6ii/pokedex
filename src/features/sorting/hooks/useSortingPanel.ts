import { useCallback, useMemo, useState } from 'react'

import { type SortingCriterion } from '@/features/sorting/schemas/sorting.schema'
import { initialSortingState } from '@/features/sorting/store'
import { useSorting, useSortingActions } from '@/shared/store'
import { nth } from '@/shared/utilities/nth'

export function useSortingPanel() {
  const appliedCriteria = useSorting()
  const { setSorting: setAppliedCriteria, resetSorting: resetAppliedCriteria } =
    useSortingActions()

  const [draftCriteria, setDraftCriteria] =
    useState<SortingCriterion[]>(appliedCriteria)

  const applySorting = useCallback(() => {
    const nextAppliedCriteria: SortingCriterion[] = [nth(draftCriteria, 0)]

    for (const [sortBy, orderBy] of draftCriteria.slice(1)) {
      if (sortBy === null || orderBy === null) continue
      nextAppliedCriteria.push([sortBy, orderBy])
    }

    setAppliedCriteria(nextAppliedCriteria)
  }, [draftCriteria, setAppliedCriteria])

  // Sync local component state with global store.
  // This is needed in case user opens the drawer, makes some changes, but doesn't apply them and closes the drawer. When they open it again, we want to show the currently applied sorting options, not the ones they were editing before.
  const syncSorting = useCallback(() => {
    setDraftCriteria(appliedCriteria)
  }, [appliedCriteria])

  const resetSorting = useCallback(() => {
    setDraftCriteria(initialSortingState.sort)
    resetAppliedCriteria()
  }, [resetAppliedCriteria])

  const appliedCriteriaCount = appliedCriteria.filter(
    ([sortBy]) => sortBy !== null,
  ).length

  const draftCriteriaCount = draftCriteria.filter(
    ([sortBy]) => sortBy !== null,
  ).length

  const hasSortingChange = useMemo(() => {
    if (draftCriteria.length !== appliedCriteria.length) {
      return true
    }

    if (
      draftCriteria.every(([sortBy]) => sortBy === null) &&
      appliedCriteria.some(([sortBy]) => sortBy !== null)
    ) {
      return true
    }

    return draftCriteria.some(([sortBy, orderBy]) => {
      const appliedCriterion = appliedCriteria.find(
        ([appliedSortBy]) => appliedSortBy === sortBy,
      )
      if (!appliedCriterion) {
        return sortBy !== null && orderBy !== null
      }
      const [appliedSortBy, appliedOrderBy] = appliedCriterion
      return appliedSortBy !== sortBy || appliedOrderBy !== orderBy
    })
  }, [appliedCriteria, draftCriteria])

  return {
    appliedCriteriaCount,
    applySorting,
    draftCriteria,
    draftCriteriaCount,
    hasSortingChange,
    resetSorting,
    setDraftCriteria,
    syncSorting,
  }
}
