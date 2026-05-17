import { SortingDrawer } from '@/features/sorting/components/sorting-drawer'
import { SortingPanelContent } from '@/features/sorting/components/sorting-panel-content'
import { SortingPopover } from '@/features/sorting/components/sorting-popover'
import { useSortingPanel } from '@/features/sorting/hooks/useSortingPanel'
import { useIsMobile } from '@/shared/hooks'

export function Sorting({ className }: { className?: string }) {
  const isMobile = useIsMobile()

  const {
    selectedCriteria,
    selectedCriteriaCount,
    setSelectedCriteria,
    applySorting,
    resetSorting,
    syncSorting,
  } = useSortingPanel()

  const SortingPanel = isMobile ? SortingDrawer : SortingPopover

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
