import { StatRangeSlider } from '@/features/filters/components/stat-range-slider'
import {
  MAX_STAT_VALUE,
  MIN_STAT_VALUE,
  type FilteringStats,
} from '@/features/filters/schemas/filter.schema'
import {
  POKEMON_SKILLS,
  type PokemonSkill,
} from '@/features/pokemons/schemas/pokemon.schema'
import { Button } from '@/shared/components/ui/button'

export function StatFilters({
  disableClear,
  onClearStats,
  stats,
  setStats,
}: {
  disableClear?: boolean
  onClearStats: () => void
  stats: FilteringStats
  setStats: React.Dispatch<React.SetStateAction<FilteringStats>>
}) {
  const handleValueChange = (value: number[], skill: PokemonSkill) => {
    setStats((prev) => ({ ...prev, [skill]: value }))
  }

  return (
    <>
      {POKEMON_SKILLS.map((skill) => {
        const [min, max] = stats[skill]
        const isActive = min !== MIN_STAT_VALUE || max !== MAX_STAT_VALUE

        return (
          <StatRangeSlider
            key={skill}
            min={MIN_STAT_VALUE}
            max={MAX_STAT_VALUE}
            label={skill}
            isActive={isActive}
            value={stats[skill]}
            onValueChange={handleValueChange}
            className="mx-auto w-full max-w-xs"
          />
        )
      })}

      <Button
        variant="outline"
        disabled={disableClear}
        onClick={() => {
          onClearStats()
        }}
        className="group mx-auto w-full max-w-xs items-center px-4 aria-expanded:bg-transparent"
      >
        Clear Edits
      </Button>
    </>
  )
}
