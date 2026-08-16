import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useRetryableImage } from '@/features/pokemons/hooks/useRetryableImage'

beforeEach(() => {
  vi.useFakeTimers()
})
afterEach(() => {
  vi.useRealTimers()
})

describe('useRetryableImage', () => {
  it('starts with the given url, not loaded, not failed', () => {
    const { result } = renderHook(() => useRetryableImage('/img.webp'))

    expect(result.current.src).toBe('/img.webp')
    expect(result.current.loaded).toBe(false)
    expect(result.current.failed).toBe(false)
  })

  it('marks loaded on handleLoad', () => {
    const { result } = renderHook(() => useRetryableImage('/img.webp'))

    act(() => {
      result.current.handleLoad()
    })

    expect(result.current.loaded).toBe(true)
  })

  it('retries with a cache-busting query param after handleError, once the backoff delay elapses', () => {
    const { result } = renderHook(() => useRetryableImage('/img.webp'))

    act(() => {
      result.current.handleError()
    })
    // Unchanged until the backoff delay elapses.
    expect(result.current.src).toBe('/img.webp')
    expect(result.current.failed).toBe(false)

    act(() => {
      // Tier-0 delay is 500 * (1 + Math.random()), approaching but never
      // reaching 1000ms; advance well clear of that max.
      vi.advanceTimersByTime(1100)
    })
    expect(result.current.src).toBe('/img.webp?retry=1')
  })

  it('gives up and sets failed after MAX_RETRIES (3) failed attempts', () => {
    const { result } = renderHook(() => useRetryableImage('/img.webp'))

    for (let i = 0; i < 3; i++) {
      act(() => {
        result.current.handleError()
      })
      act(() => {
        vi.advanceTimersByTime(10000)
      })
    }
    expect(result.current.failed).toBe(false)

    act(() => {
      result.current.handleError()
    })
    expect(result.current.failed).toBe(true)
  })
})
