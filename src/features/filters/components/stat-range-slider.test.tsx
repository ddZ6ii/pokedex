import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { StatRangeSlider } from '@/features/filters/components/stat-range-slider'

describe('StatRangeSlider', () => {
  it('gives each range thumb a distinct accessible name', () => {
    render(
      <StatRangeSlider
        label="hp"
        value={[10, 80]}
        isActive={false}
        onValueChange={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('slider', { name: 'hp minimum' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('slider', { name: 'hp maximum' }),
    ).toBeInTheDocument()
  })
})
