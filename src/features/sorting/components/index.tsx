import { SortingPanel } from '@/features/sorting/components/sorting-panel'
import { SortingPanelContent } from '@/features/sorting/components/sorting-panel-content'
import { useSortingPanel } from '@/features/sorting/hooks/useSortingPanel'

export function Sorting({ className }: { className?: string }) {
  const {
    appliedCriteriaCount,
    applySorting,
    draftCriteria,
    hasSortingChange,
    resetSorting,
    setDraftCriteria,
    syncSorting,
  } = useSortingPanel()

  return (
    <SortingPanel
      appliedCriteriaCount={appliedCriteriaCount}
      className={className}
      hasSortingChange={hasSortingChange}
      onApply={applySorting}
      onOpen={syncSorting}
      onReset={resetSorting}
    >
      <SortingPanelContent
        criteria={draftCriteria}
        setCriteria={setDraftCriteria}
      />
    </SortingPanel>
  )
}
