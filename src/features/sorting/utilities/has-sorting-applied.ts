import type { SortingCriterion } from '@/features/sorting/schemas/sorting.schema'

type NonNullableSortingCriterion = [
  NonNullable<SortingCriterion[0]>,
  NonNullable<SortingCriterion[1]>,
]

export function hasSortingApplied(
  criteria: SortingCriterion[],
): criteria is NonNullableSortingCriterion[] {
  return (
    criteria.length > 0 &&
    criteria.every(([sortBy, orderBy]) => sortBy !== null && orderBy !== null)
  )
}
