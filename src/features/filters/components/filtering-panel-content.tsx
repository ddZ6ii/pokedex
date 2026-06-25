import { useState } from 'react'

import { CollapsibleFilter } from '@/features/filters/components/collapsible-filter'
import { StatFilters } from '@/features/filters/components/stat-filters'
import { type FilteringStats } from '@/features/filters/schemas/filter.schema'

export function FilteringPanelContent({
  activeStatsCount,
  onStatsReset,
  setStats,
  stats,
}: {
  activeStatsCount: number
  onStatsReset: () => void
  stats: FilteringStats
  setStats: React.Dispatch<React.SetStateAction<FilteringStats>>
}) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <CollapsibleFilter
      label="Pokémon Stats"
      activeFiltersCount={activeStatsCount}
      defaultOpen={true}
      open={activeIndex === 0}
      onOpenChange={(open) => {
        setActiveIndex(open ? 0 : -1)
      }}
    >
      <StatFilters
        stats={stats}
        setStats={setStats}
        onStatsReset={onStatsReset}
      />
    </CollapsibleFilter>
  )
}
