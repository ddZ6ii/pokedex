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

  it('settles without waiting on an evolves-from image that never mounts (stage "base" despite evolves_from being set — real data shape: Melmetal/#809)', () => {
    const { container } = renderWithProviders(
      <PokemonCardMemoized
        pokemon={makePokemon({
          stage: 'base',
          evolves_from: { id: 808, name: 'Meltan' },
        })}
      />,
    )

    // stage "base" means no evolves-from badge should render at all.
    expect(container.querySelector('img[alt="Meltan"]')).toBeNull()

    const background = container.querySelector<HTMLImageElement>(
      'img[src^="/pokemon-backgrounds/"]',
    )
    const artwork = container.querySelector<HTMLImageElement>(
      'img[src*="official-artwork"]',
    )
    if (!background || !artwork) throw new Error('images not mounted')

    fireEvent.load(background)
    fireEvent.load(artwork)

    expect(container.querySelector('[aria-hidden="true"]')).toBeNull()
  })
})
