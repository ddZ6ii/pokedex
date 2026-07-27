import type { SortingCriterion } from '@/features/sorting/schemas/sorting.schema'
import { hasSortingApplied } from '@/features/sorting/utilities/has-sorting-applied'

export function computeSortQuery(
  criteria: SortingCriterion[] | undefined,
): string | null {
  const definiteCriteria = criteria ?? []
  if (!hasSortingApplied(definiteCriteria)) return null

  return definiteCriteria.reduce((acc, [sortBy, orderBy]) => {
    const newSort = orderBy === 'asc' ? sortBy : `-${sortBy}`

    if (acc.length > 0) {
      acc += `,${newSort}`
    } else {
      acc = newSort
    }
    return acc
  }, '')
}
