import { useState } from 'react'

import { CollapsibleFilter } from '@/features/filters/components/collapsible-filter'
import { StatFilters } from '@/features/filters/components/stat-filters'
import { TypeFilters } from '@/features/filters/components/type-filters'
import { type FilteringStats } from '@/features/filters/schemas/filter.schema'
import { type PokemonType } from '@/features/pokemons/schemas'
import { cn } from '@/shared/lib/utils'

const activeClassName = 'shadow-foreground/5 shadow-lg'

export function FilteringPanelContent({
  error = null,
  onClearStats,
  onSelectType,
  onSelectAllTypes,
  onUnselectAllTypes,
  setStats,
  stats,
  statsCount,
  typesCount,
  types,
}: {
  error?: Error | null
  onClearStats: () => void
  onSelectType: (type: PokemonType, nextChecked: boolean) => void
  onSelectAllTypes: () => void
  onUnselectAllTypes: () => void
  stats: FilteringStats
  statsCount: number
  setStats: React.Dispatch<React.SetStateAction<FilteringStats>>
  types: Set<PokemonType>
  typesCount: number
}) {
  const [activeIndex, setActiveIndex] = useState(
    typesCount > 0 ? 0 : statsCount > 0 ? 1 : 0,
  )

  return (
    <div className="space-y-4">
      <CollapsibleFilter
        label="Pokémon Types"
        activeFiltersCount={typesCount}
        open={activeIndex === 0}
        onOpenChange={(open) => {
          setActiveIndex(open ? 0 : -1)
        }}
        className={cn(activeIndex === 1 && activeClassName)}
      >
        <TypeFilters
          error={error}
          types={types}
          onSelectType={onSelectType}
          onSelectAllTypes={onSelectAllTypes}
          onUnselectAllTypes={onUnselectAllTypes}
        />
      </CollapsibleFilter>

      <CollapsibleFilter
        label="Pokémon Stats"
        activeFiltersCount={statsCount}
        open={activeIndex === 1}
        onOpenChange={(open) => {
          setActiveIndex(open ? 1 : -1)
        }}
        className={cn(activeIndex === 0 && activeClassName)}
      >
        <StatFilters
          disableClear={statsCount === 0}
          onClearStats={onClearStats}
          stats={stats}
          setStats={setStats}
        />
      </CollapsibleFilter>
    </div>
  )
}
