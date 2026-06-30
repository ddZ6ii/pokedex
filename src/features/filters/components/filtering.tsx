import { FilteringDrawer } from '@/features/filters/components/filtering-drawer'
import { FilteringPanelContent } from '@/features/filters/components/filtering-panel-content'
import { FilteringPopover } from '@/features/filters/components/filtering-popover'
import { useFilteringPanel } from '@/features/filters/hooks/useFilteringPanel'
import { useIsMobile } from '@/shared/hooks'

export function Filtering({ className }: { className?: string }) {
  const isMobile = useIsMobile()

  const {
    applyFilters,
    appliedFiltersCount,
    draftStats,
    draftStatsCount,
    draftTypes,
    draftTypesCount,
    error,
    hasFiltersChange,
    resetDraftStats,
    resetFilters,
    selectAllDraftTypes,
    selectDraftType,
    setDraftStats,
    syncFilters,
    unselectAllDraftTypes,
  } = useFilteringPanel()

  const FilteringPanel = isMobile ? FilteringDrawer : FilteringPopover

  return (
    <FilteringPanel
      appliedFilterCount={appliedFiltersCount}
      hasFiltersChange={hasFiltersChange}
      className={className}
      error={error}
      onApply={applyFilters}
      onOpen={syncFilters}
      onReset={resetFilters}
    >
      <FilteringPanelContent
        error={error}
        onResetStats={resetDraftStats}
        onSelectType={selectDraftType}
        onSelectAllTypes={selectAllDraftTypes}
        onUnselectAllTypes={unselectAllDraftTypes}
        stats={draftStats}
        statsCount={draftStatsCount}
        setStats={setDraftStats}
        types={draftTypes}
        typesCount={draftTypesCount}
      />
    </FilteringPanel>
  )
}
