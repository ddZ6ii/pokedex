import {
  MultiSort,
  MultiSortAddTrigger,
  MultiSortBySelect,
  MultiSortItem,
  MultiSortList,
  MultiSortOrderSelect,
} from '@/features/sorting/components/multi-sort'
import {
  SORT_BY_OPTIONS,
  type SortingCriterion,
} from '@/features/sorting/schemas/sorting.schema'

export function SortingPanelContent({
  selectedCriteria,
  setSelectedCriteria,
}: {
  selectedCriteria: SortingCriterion[]
  setSelectedCriteria: React.Dispatch<React.SetStateAction<SortingCriterion[]>>
}) {
  return (
    <MultiSort
      sortOptions={SORT_BY_OPTIONS}
      selectedCriteria={selectedCriteria}
      setSelectedCriteria={setSelectedCriteria}
    >
      <MultiSortList>
        <MultiSortItem>
          <MultiSortBySelect />
          <MultiSortOrderSelect />
        </MultiSortItem>
      </MultiSortList>
      <MultiSortAddTrigger>Add criteria</MultiSortAddTrigger>
    </MultiSort>
  )
}
