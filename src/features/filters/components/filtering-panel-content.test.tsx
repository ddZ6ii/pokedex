import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { FilteringPanelContent } from '@/features/filters/components/filtering-panel-content'
import { DEFAULT_DRAFT_STATS } from '@/features/filters/hooks/useFilteringPanel'
import {
  type FilteringStats,
  MAX_STAT_VALUE,
  MIN_STAT_VALUE,
} from '@/features/filters/schemas/filter.schema'
import {
  POKEMON_SKILLS,
  POKEMON_TYPES,
  type PokemonType,
} from '@/features/pokemons/schemas/pokemon.schema'
import { nth } from '@/shared/utilities/nth'
import { renderWithProviders } from '@/tests/utilities'

const DEFAULT_TYPES = new Set<PokemonType>(POKEMON_TYPES)
const STATS_TRIGGER_LABEL = /pokémon stats/i
const TYPES_TRIGGER_LABEL = /pokémon types/i
const noop = vi.fn()

function Wrapper({
  initialStats = DEFAULT_DRAFT_STATS,
  initialTypes = DEFAULT_TYPES,
  error = null,
  onResetStats = noop,
  onSelectAllTypes = noop,
  onUnselectAllTypes = noop,
  onSelectType,
  onStatsChange,
  statsCount = 0,
  typesCount = 0,
}: {
  initialStats?: FilteringStats
  initialTypes?: Set<PokemonType>
  error?: Error | null
  onResetStats?: () => void
  onSelectAllTypes?: () => void
  onUnselectAllTypes?: () => void
  onSelectType?: (type: PokemonType, nextChecked: boolean) => void
  onStatsChange?: (stats: FilteringStats) => void
  statsCount?: number
  typesCount?: number
}) {
  const [stats, setStats] = useState<FilteringStats>(initialStats)
  const [types, setTypes] = useState<Set<PokemonType>>(initialTypes)

  const handleSetStats: React.Dispatch<React.SetStateAction<FilteringStats>> = (
    value,
  ) => {
    setStats((prev) => {
      const next = typeof value === 'function' ? value(prev) : value
      onStatsChange?.(next)
      return next
    })
  }

  const handleSelectType = (type: PokemonType, nextChecked: boolean) => {
    onSelectType?.(type, nextChecked)
    setTypes((prev) => {
      const next = new Set(prev)
      if (nextChecked) next.add(type)
      else next.delete(type)
      return next
    })
  }

  return (
    <FilteringPanelContent
      error={error}
      onSelectType={handleSelectType}
      onSelectAllTypes={onSelectAllTypes}
      onResetStats={onResetStats}
      onUnselectAllTypes={onUnselectAllTypes}
      setStats={handleSetStats}
      stats={stats}
      statsCount={statsCount}
      types={types}
      typesCount={typesCount}
    />
  )
}

describe('FilteringPanelContent', () => {
  describe('initial rendering', () => {
    it('renders Stats and Types collapsible triggers', () => {
      renderWithProviders(<Wrapper />)

      expect(
        screen.getByRole('button', { name: STATS_TRIGGER_LABEL }),
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: TYPES_TRIGGER_LABEL }),
      ).toBeInTheDocument()
    })

    it('shows no panels open when no active filters', () => {
      renderWithProviders(<Wrapper />)

      expect(screen.queryAllByRole('slider')).toHaveLength(0)
      for (const type of POKEMON_TYPES) {
        expect(
          screen.queryByRole('checkbox', { name: type }),
        ).not.toBeInTheDocument()
      }
    })

    it('opens Stats panel when statsCount > 0', () => {
      renderWithProviders(<Wrapper statsCount={1} />)

      expect(screen.getAllByRole('slider')).toHaveLength(
        POKEMON_SKILLS.length * 2,
      )
    })

    it('opens Types panel when typesCount > 0 and statsCount is 0', () => {
      renderWithProviders(<Wrapper typesCount={2} />)

      expect(screen.queryAllByRole('slider')).toHaveLength(0)
      expect(screen.getAllByRole('checkbox')).toHaveLength(POKEMON_TYPES.length)
    })

    it('shows no count badge on Stats trigger when statsCount is 0', () => {
      renderWithProviders(<Wrapper statsCount={0} />)

      const trigger = screen.getByRole('button', { name: STATS_TRIGGER_LABEL })
      expect(within(trigger).queryByText(/^\d+$/)).not.toBeInTheDocument()
    })

    it('shows count badge on Stats trigger when statsCount > 0', () => {
      renderWithProviders(<Wrapper statsCount={3} />)

      const trigger = screen.getByRole('button', { name: STATS_TRIGGER_LABEL })
      expect(within(trigger).getByText('3')).toBeInTheDocument()
    })

    it('shows count badge on Types trigger when typesCount > 0', () => {
      renderWithProviders(<Wrapper typesCount={5} />)

      const trigger = screen.getByRole('button', { name: TYPES_TRIGGER_LABEL })
      expect(within(trigger).getByText('5')).toBeInTheDocument()
    })
  })

  describe('accordion behavior', () => {
    it('clicking Stats trigger opens it', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Wrapper />)

      await user.click(
        screen.getByRole('button', { name: STATS_TRIGGER_LABEL }),
      )

      expect(screen.getAllByRole('slider')).toHaveLength(
        POKEMON_SKILLS.length * 2,
      )
    })

    it('clicking open Stats trigger closes it', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Wrapper statsCount={1} />)

      await user.click(
        screen.getByRole('button', { name: STATS_TRIGGER_LABEL }),
      )

      expect(screen.queryAllByRole('slider')).toHaveLength(0)
    })

    it('opening Types closes Stats', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Wrapper statsCount={1} />)

      await user.click(
        screen.getByRole('button', { name: TYPES_TRIGGER_LABEL }),
      )

      expect(screen.queryAllByRole('slider')).toHaveLength(0)
      expect(screen.getAllByRole('checkbox')).toHaveLength(POKEMON_TYPES.length)
    })

    it('opening Stats closes Types', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Wrapper typesCount={2} />)

      await user.click(
        screen.getByRole('button', { name: STATS_TRIGGER_LABEL }),
      )

      expect(screen.getAllByRole('slider')).toHaveLength(
        POKEMON_SKILLS.length * 2,
      )
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    })
  })

  describe('Stats panel', () => {
    it('renders a slider for each stat', () => {
      renderWithProviders(<Wrapper statsCount={1} />)

      for (const skill of POKEMON_SKILLS) {
        expect(screen.getByText(skill)).toBeInTheDocument()
      }
    })

    it('displays current min and max values below each slider', () => {
      renderWithProviders(
        <Wrapper
          statsCount={1}
          initialStats={{
            hp: [10, 80],
            attack: [MIN_STAT_VALUE, MAX_STAT_VALUE],
            defense: [MIN_STAT_VALUE, MAX_STAT_VALUE],
            speed: [MIN_STAT_VALUE, MAX_STAT_VALUE],
          }}
        />,
      )

      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('80')).toBeInTheDocument()
    })

    it('renders Reset Stats button', () => {
      renderWithProviders(<Wrapper statsCount={1} />)

      expect(
        screen.getByRole('button', { name: /reset stats/i }),
      ).toBeInTheDocument()
    })

    it('clicking Reset Stats calls onResetStats', async () => {
      const onResetStats = vi.fn()
      const user = userEvent.setup()
      renderWithProviders(
        <Wrapper statsCount={1} onResetStats={onResetStats} />,
      )

      await user.click(screen.getByRole('button', { name: /reset stats/i }))

      expect(onResetStats).toHaveBeenCalledOnce()
    })

    it('adjusting a slider updates stats via setStats', async () => {
      const onStatsChange = vi.fn()
      const user = userEvent.setup()
      renderWithProviders(
        <Wrapper statsCount={1} onStatsChange={onStatsChange} />,
      )

      const sliders = screen.getAllByRole('slider')
      nth(sliders, 0).focus()
      await user.keyboard('{ArrowRight}')

      expect(onStatsChange).toHaveBeenCalledWith(
        expect.objectContaining({
          hp: [MIN_STAT_VALUE + 1, MAX_STAT_VALUE],
        }),
      )
    })
  })

  describe('Types panel', () => {
    it('renders a checkbox for each Pokémon type', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Wrapper />)

      await user.click(
        screen.getByRole('button', { name: TYPES_TRIGGER_LABEL }),
      )

      for (const type of POKEMON_TYPES) {
        expect(screen.getByRole('checkbox', { name: type })).toBeInTheDocument()
      }
    })

    it('checking a type calls onSelectType with the type and true', async () => {
      const onSelectType = vi.fn()
      const user = userEvent.setup()
      renderWithProviders(
        <Wrapper
          typesCount={2}
          initialTypes={new Set<PokemonType>(['fire'])}
          onSelectType={onSelectType}
        />,
      )

      await user.click(screen.getByRole('checkbox', { name: 'water' }))

      expect(onSelectType).toHaveBeenCalledWith('water', true)
    })

    it('unchecking a type calls onSelectType with the type and false', async () => {
      const onSelectType = vi.fn()
      const user = userEvent.setup()
      renderWithProviders(
        <Wrapper
          typesCount={2}
          initialTypes={new Set<PokemonType>(['fire', 'water'])}
          onSelectType={onSelectType}
        />,
      )

      await user.click(screen.getByRole('checkbox', { name: 'fire' }))

      expect(onSelectType).toHaveBeenCalledWith('fire', false)
    })

    it('clicking Select All calls onSelectAllTypes', async () => {
      const onSelectAllTypes = vi.fn()
      const user = userEvent.setup()
      renderWithProviders(
        <Wrapper
          typesCount={1}
          initialTypes={new Set<PokemonType>(['fire'])}
          onSelectAllTypes={onSelectAllTypes}
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Select All' }))

      expect(onSelectAllTypes).toHaveBeenCalledOnce()
    })

    it('clicking Unselect All calls onUnselectAllTypes', async () => {
      const onUnselectAllTypes = vi.fn()
      const user = userEvent.setup()
      renderWithProviders(
        <Wrapper
          typesCount={2}
          initialTypes={new Set<PokemonType>(['fire', 'water'])}
          onUnselectAllTypes={onUnselectAllTypes}
        />,
      )

      await user.click(screen.getByRole('button', { name: 'Unselect All' }))

      expect(onUnselectAllTypes).toHaveBeenCalledOnce()
    })

    it('shows error message when error prop is set', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Wrapper error={new Error('Failed to load types')} />)

      await user.click(
        screen.getByRole('button', { name: TYPES_TRIGGER_LABEL }),
      )

      expect(screen.getByText('Failed to load types')).toBeInTheDocument()
    })
  })
})
