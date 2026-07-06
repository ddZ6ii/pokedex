import { FilteringPanel } from '@/features/filters/components/filtering-panel'
import { FilteringPanelContent } from '@/features/filters/components/filtering-panel-content'
import { useFilteringPanel } from '@/features/filters/hooks/useFilteringPanel'

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
    hasFiltersChange,
    resetFilters,
    selectAllDraftTypes,
    selectDraftType,
    setDraftStats,
    syncFilters,
    unselectAllDraftTypes,
  } = useFilteringPanel()

  return (
    <FilteringPanel
      appliedFilterCount={appliedFiltersCount}
      className={className}
      error={error}
      hasFiltersChange={hasFiltersChange}
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
    </FilteringPanel>
  )
}
