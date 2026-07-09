import { ListFilterIcon } from 'lucide-react'

import { FilteringPanelContent } from '@/features/filters/components/filtering-panel-content'
import { useFilteringPanel } from '@/features/filters/hooks/useFilteringPanel'
import { ResponsivePanel } from '@/shared/components/responsive-panel'

export function Filtering({ className }: { className?: string }) {
  const {
    applyFilters,
    appliedFiltersCount,
    clearDraftStats,
    draftStats,
    draftStatsCount,
    draftTypes,
    draftTypesCount,
    error,
    isApplyDisabled,
    resetFilters,
    selectAllDraftTypes,
    selectDraftType,
    setDraftStats,
    syncFilters,
    unselectAllDraftTypes,
  } = useFilteringPanel()

  return (
    <ResponsivePanel
      className={className}
      count={appliedFiltersCount}
      description="Filter Pokémons by type and stats."
      Icon={ListFilterIcon}
      isApplyDisabled={isApplyDisabled}
      label="filtering options"
      onApply={applyFilters}
      onOpen={syncFilters}
      onReset={resetFilters}
    >
      <FilteringPanelContent
        error={error}
        onClearStats={clearDraftStats}
        onSelectType={selectDraftType}
        onSelectAllTypes={selectAllDraftTypes}
        onUnselectAllTypes={unselectAllDraftTypes}
        stats={draftStats}
        statsCount={draftStatsCount}
        setStats={setDraftStats}
        types={draftTypes}
        typesCount={draftTypesCount}
      />
    </ResponsivePanel>
  )
}
