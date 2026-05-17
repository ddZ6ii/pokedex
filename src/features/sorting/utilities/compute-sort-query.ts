import type { SortingCriterion } from '@/features/sorting/schemas/sorting.schema'
import { hasSortingApplied } from '@/features/sorting/utilities/has-sorting-applied'

export function computeSortQuery(criteria: SortingCriterion[]): string | null {
  if (!hasSortingApplied(criteria)) return null

  return criteria.reduce((acc, [sortBy, orderBy]) => {
    const newSort = orderBy === 'asc' ? sortBy : `-${sortBy}`

    if (acc.length > 0) {
      acc += `,${newSort}`
    } else {
      acc = newSort
    }
    return acc
  }, '')
}
