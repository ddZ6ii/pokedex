import { describe, expect, it, vi, beforeEach } from 'vitest'
import { create } from 'zustand'

import { createModeSlice, type ModeSlice } from '@/shared/store/mode-slice'
import { getSystemPreference, toggleMode } from '@/shared/utilities'

vi.mock('@/shared/utilities', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/shared/utilities')>()
  return {
    ...actual,
    getSystemPreference: vi.fn(),
    toggleMode: vi.fn(),
  }
})

function makeStore() {
  return create<ModeSlice>()((...a) => createModeSlice(...a))
}

beforeEach(() => {
  vi.mocked(getSystemPreference).mockReturnValue('light')
})

describe('initial state', () => {
  it('defaults mode to system', () => {
    const store = makeStore()
    expect(store.getState().mode).toBe('system')
  })

  it('sets isDarkMode based on system preference', () => {
    vi.mocked(getSystemPreference).mockReturnValue('dark')
    const store = makeStore()
    expect(store.getState().isDarkMode).toBe(true)
  })

  it('sets isDarkMode to false when system preference is light', () => {
    const store = makeStore()
    expect(store.getState().isDarkMode).toBe(false)
  })
})

describe('setMode', () => {
  it('sets mode to dark and isDarkMode to true', () => {
    const store = makeStore()
    store.getState().modeActions.setMode('dark')
    expect(store.getState().mode).toBe('dark')
    expect(store.getState().isDarkMode).toBe(true)
  })

  it('sets mode to light and isDarkMode to false', () => {
    const store = makeStore()
    store.getState().modeActions.setMode('light')
    expect(store.getState().mode).toBe('light')
    expect(store.getState().isDarkMode).toBe(false)
  })

  it('sets isDarkMode to true when mode is system and preference is dark', () => {
    vi.mocked(getSystemPreference).mockReturnValue('dark')
    const store = makeStore()
    store.getState().modeActions.setMode('system')
    expect(store.getState().isDarkMode).toBe(true)
  })

  it('sets isDarkMode to false when mode is system and preference is light', () => {
    const store = makeStore()
    store.getState().modeActions.setMode('system')
    expect(store.getState().isDarkMode).toBe(false)
  })

  it('calls toggleMode with the new mode', () => {
    const store = makeStore()
    store.getState().modeActions.setMode('dark')
    expect(toggleMode).toHaveBeenCalledWith('dark')
  })
})
