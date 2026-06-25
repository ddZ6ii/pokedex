import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { FilteringPanelContent } from '@/features/filters/components/filtering-panel-content'
import { defaultStats as DEFAULT_STATS } from '@/features/filters/hooks/useFilteringPanel'
import {
  type FilteringStats,
  MAX_STAT_VALUE,
  MIN_STAT_VALUE,
} from '@/features/filters/schemas/filter.schema'
import { POKEMON_SKILLS } from '@/features/pokemons/schemas/pokemon.schema'
import { nth } from '@/shared/utilities/nth'
import { renderWithProviders } from '@/tests/utilities'

const noop = vi.fn()

function Wrapper({
  activeStatsCount = 0,
  initialStats = DEFAULT_STATS,
  onChange,
  onStatsReset = noop,
}: {
  activeStatsCount?: number
  initialStats?: FilteringStats
  onChange?: (stats: FilteringStats) => void
  onStatsReset?: () => void
}) {
  const [stats, setStats] = useState<FilteringStats>(initialStats)

  const handleSet: React.Dispatch<React.SetStateAction<FilteringStats>> = (
    value,
  ) => {
    setStats((prev) => {
      const next = typeof value === 'function' ? value(prev) : value
      onChange?.(next)
      return next
    })
  }

  return (
    <FilteringPanelContent
      activeStatsCount={activeStatsCount}
      onStatsReset={onStatsReset}
      setStats={handleSet}
      stats={stats}
    />
  )
}

describe('FilteringPanelContent', () => {
  describe('initial rendering', () => {
    it('renders "Pokémon Stats" collapsible trigger', () => {
      renderWithProviders(<Wrapper />)

      expect(
        screen.getByRole('button', { name: /pokémon stats/i }),
      ).toBeInTheDocument()
    })

    it('is open by default, showing stat sliders', () => {
      renderWithProviders(<Wrapper />)

      expect(screen.getAllByRole('slider')).toHaveLength(
        POKEMON_SKILLS.length * 2, // 2 thumbs (role="slider") per stat
      )
    })

    it('renders a slider for each stat', () => {
      renderWithProviders(<Wrapper />)

      for (const skill of POKEMON_SKILLS) {
        expect(screen.getByText(skill)).toBeInTheDocument()
      }
    })

    it('shows no count badge when activeStatsCount is 0', () => {
      renderWithProviders(<Wrapper activeStatsCount={0} />)

      const trigger = screen.getByRole('button', { name: /pokémon stats/i })
      expect(within(trigger).queryByText(/^\d+$/)).not.toBeInTheDocument()
    })

    it('shows count badge when activeStatsCount > 0', () => {
      renderWithProviders(<Wrapper activeStatsCount={3} />)

      const trigger = screen.getByRole('button', { name: /pokémon stats/i })
      expect(within(trigger).getByText('3')).toBeInTheDocument()
    })

    it('renders "Reset Stats" button', () => {
      renderWithProviders(<Wrapper />)

      expect(
        screen.getByRole('button', { name: /reset stats/i }),
      ).toBeInTheDocument()
    })
  })

  describe('collapsible behavior', () => {
    it('clicking trigger closes the panel', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Wrapper />)

      await user.click(screen.getByRole('button', { name: /pokémon stats/i }))

      expect(screen.queryAllByRole('slider')).toHaveLength(0)
    })

    it('clicking trigger twice re-opens the panel', async () => {
      const user = userEvent.setup()
      renderWithProviders(<Wrapper />)

      const trigger = screen.getByRole('button', { name: /pokémon stats/i })
      await user.click(trigger)
      await user.click(trigger)

      expect(screen.getAllByRole('slider')).toHaveLength(
        POKEMON_SKILLS.length * 2,
      )
    })
  })

  describe('Reset Stats button', () => {
    it('clicking calls onStatsReset', async () => {
      const onStatsReset = vi.fn()
      const user = userEvent.setup()
      renderWithProviders(<Wrapper onStatsReset={onStatsReset} />)

      await user.click(screen.getByRole('button', { name: /reset stats/i }))

      expect(onStatsReset).toHaveBeenCalledOnce()
    })
  })

  describe('stat sliders', () => {
    it('displays min and max values below each slider', () => {
      renderWithProviders(
        <Wrapper
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

    it('adjusting a slider updates stats via setStats', async () => {
      const onChange = vi.fn()
      const user = userEvent.setup()
      renderWithProviders(<Wrapper onChange={onChange} />)

      const sliders = screen.getAllByRole('slider')
      nth(sliders, 0).focus()
      await user.keyboard('{ArrowRight}')

      expect(onChange).toHaveBeenCalledWith(
        expect.objectContaining({
          hp: [MIN_STAT_VALUE + 1, MAX_STAT_VALUE],
        }),
      )
    })
  })
})
