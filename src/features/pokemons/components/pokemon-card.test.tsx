import { act, fireEvent } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { PokemonCardMemoized } from '@/features/pokemons/components/pokemon-card'
import { makePokemon, renderWithProviders } from '@/tests/utilities'

beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.useRealTimers()
})

describe('PokemonCardMemoized', () => {
  it('lazy-loads the type background and retries it on error', () => {
    const { container } = renderWithProviders(
      <PokemonCardMemoized pokemon={makePokemon()} />,
    )

    const background = container.querySelector<HTMLImageElement>(
      'img[src^="/pokemon-backgrounds/"]',
    )
    if (!background) throw new Error('background img not mounted')

    // pokemonFixture (via makePokemon) has primary_type "grass", stage "base".
    expect(background.getAttribute('src')).toBe(
      '/pokemon-backgrounds/bg-grass.webp',
    )
    expect(background).toHaveAttribute('loading', 'lazy')

    fireEvent.error(background)
    act(() => {
      // Tier-0 delay is 500 * (1 + Math.random()), approaching but never
      // reaching 1000ms; advance well clear of that max.
      vi.advanceTimersByTime(1100)
    })

    expect(background.getAttribute('src')).toBe(
      '/pokemon-backgrounds/bg-grass.webp?retry=1',
    )
  })

  it('eager-loads the background with high fetch priority when priority is set', () => {
    const { container } = renderWithProviders(
      <PokemonCardMemoized pokemon={makePokemon()} priority />,
    )

    const background = container.querySelector<HTMLImageElement>(
      'img[src^="/pokemon-backgrounds/"]',
    )
    if (!background) throw new Error('background img not mounted')

    expect(background).toHaveAttribute('loading', 'eager')
    expect(background).toHaveAttribute('fetchpriority', 'high')
  })
})
