import { getRouteApi } from '@tanstack/react-router'
import { useCallback, useMemo, useState } from 'react'

import { type SortingCriterion } from '@/features/sorting/schemas/sorting.schema'
import { nth } from '@/shared/utilities/nth'

const routeApi = getRouteApi('/(public)/pokemons')

const emptyCriteria = (): SortingCriterion[] => [[null, null]]

const getInitialCriteria = (
  appliedCriteria: SortingCriterion[],
): SortingCriterion[] =>
  appliedCriteria.length ? appliedCriteria : emptyCriteria()

export function useSortingPanel() {
  const { sort } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const appliedCriteria = useMemo(() => sort ?? [], [sort])

  const [draftCriteria, setDraftCriteria] = useState<SortingCriterion[]>(() =>
    getInitialCriteria(appliedCriteria),
  )

  const applySorting = useCallback(() => {
    const nextAppliedCriteria: SortingCriterion[] =
      draftCriteria[0]?.[0] === null ? [] : [nth(draftCriteria, 0)]

    for (const [sortBy, orderBy] of draftCriteria.slice(1)) {
      if (sortBy === null || orderBy === null) continue
      nextAppliedCriteria.push([sortBy, orderBy])
    }

    void navigate({
      search: (prev) => ({
        ...prev,
        sort: nextAppliedCriteria.length ? nextAppliedCriteria : undefined,
        page: 1,
      }),
    })
  }, [draftCriteria, navigate])

  // Sync local component state with global store.
  // This is needed in case user opens the drawer, makes some changes, but doesn't apply them and closes the drawer. When they open it again, we want to show the currently applied sorting options, not the ones they were editing before.
  const syncSorting = useCallback(() => {
    setDraftCriteria(appliedCriteria.length ? appliedCriteria : emptyCriteria())
  }, [appliedCriteria])

  const resetSorting = useCallback(() => {
    setDraftCriteria(emptyCriteria())
    void navigate({ search: (prev) => ({ ...prev, sort: undefined, page: 1 }) })
  }, [navigate])

  const appliedCriteriaCount = appliedCriteria.filter(
    ([sortBy]) => sortBy !== null,
  ).length

  const draftCriteriaCount = draftCriteria.filter(
    ([sortBy]) => sortBy !== null,
  ).length

  const hasSortingChange = useMemo(() => {
    if (
      draftCriteria.length !== appliedCriteria.length &&
      !draftCriteria.some(([sortBy]) => sortBy === null)
    ) {
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
