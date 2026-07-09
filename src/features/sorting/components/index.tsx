import { ArrowUpDownIcon } from 'lucide-react'

import { SortingPanelContent } from '@/features/sorting/components/sorting-panel-content'
import { useSortingPanel } from '@/features/sorting/hooks/useSortingPanel'
import { ResponsivePanel } from '@/shared/components/responsive-panel'

export function Sorting({ className }: { className?: string }) {
  const {
    appliedCriteriaCount,
    applySorting,
    draftCriteria,
    isApplyDisabled,
    resetSorting,
    setDraftCriteria,
    syncSorting,
  } = useSortingPanel()

  return (
    <ResponsivePanel
      className={className}
      count={appliedCriteriaCount}
      description="Choose a field to sort by and a direction."
      Icon={ArrowUpDownIcon}
      isApplyDisabled={isApplyDisabled}
      label="sorting options"
      onApply={applySorting}
      onOpen={syncSorting}
      onReset={resetSorting}
    >
      <SortingPanelContent
        criteria={draftCriteria}
        setCriteria={setDraftCriteria}
      />
    </ResponsivePanel>
  )
}
