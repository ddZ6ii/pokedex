import { FilteringDrawer } from '@/features/filters/components/filtering-drawer'
import { FilteringPanelContent } from '@/features/filters/components/filtering-panel-content'
import { FilteringPopover } from '@/features/filters/components/filtering-popover'
import { useFilteringPanel } from '@/features/filters/hooks/useFilteringPanel'
import { useIsMobile } from '@/shared/hooks'

export function Filtering({ className }: { className?: string }) {
  const isMobile = useIsMobile()

  const {
    activeFiltersCount,
    activeStatsCount,
    applyFilters,
    resetFilters,
    resetStats,
    setStats,
    stats,
    syncFilters,
  } = useFilteringPanel()

  const FilteringPanel = isMobile ? FilteringDrawer : FilteringPopover

  return (
    <FilteringPanel
      activeFiltersCount={activeFiltersCount}
      className={className}
      onApply={applyFilters}
      onOpen={syncFilters}
      onReset={resetFilters}
    >
      <FilteringPanelContent
        activeStatsCount={activeStatsCount}
        onStatsReset={resetStats}
        stats={stats}
        setStats={setStats}
      />
    </FilteringPanel>
  )
}
