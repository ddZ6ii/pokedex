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
  criteria,
  setCriteria,
}: {
  criteria: SortingCriterion[]
  setCriteria: React.Dispatch<React.SetStateAction<SortingCriterion[]>>
}) {
  return (
    <MultiSort
      criteria={criteria}
      setCriteria={setCriteria}
      sortOptions={SORT_BY_OPTIONS}
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
