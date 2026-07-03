import { SortingPanel } from '@/features/sorting/components/sorting-panel'
import { SortingPanelContent } from '@/features/sorting/components/sorting-panel-content'
import { useSortingPanel } from '@/features/sorting/hooks/useSortingPanel'

export function Sorting({ className }: { className?: string }) {
  const {
    selectedCriteria,
    selectedCriteriaCount,
    setSelectedCriteria,
    applySorting,
    resetSorting,
    syncSorting,
  } = useSortingPanel()

  return (
    <SortingPanel
      selectedCount={selectedCriteriaCount}
      onApply={applySorting}
      onOpen={syncSorting}
      onReset={resetSorting}
      className={className}
    >
      <SortingPanelContent
        selectedCriteria={selectedCriteria}
        setSelectedCriteria={setSelectedCriteria}
      />
    </SortingPanel>
  )
}
