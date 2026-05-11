import { describe, expect, it } from 'vitest'

import { PER_PAGE_OPTIONS } from '@/features/filters/schemas'
import { POKEMON_SKILLS } from '@/features/pokemons/schemas'
import { MODES } from '@/shared/schemas/mode.schema'
import {
  StorageSchema,
  type PersistedStoreState,
} from '@/shared/schemas/store.schema'

const validInput: PersistedStoreState = {
  version: 1,
  state: { mode: 'light', perPage: 10, sortBy: 'name', sortOrder: 'asc' },
}

describe('StorageSchema', () => {
  it('parses a valid object', () => {
    const result = StorageSchema.safeParse(validInput)
    expect(result.success).toBe(true)
    expect(result.data).toBeDefined()
    expect(result.data).toEqual(validInput)
  })

  it.each(MODES)('accepts mode "%s"', (mode) => {
    expect(() =>
      StorageSchema.parse({
        ...validInput,
        state: { ...validInput.state, mode },
      }),
    ).not.toThrow()
  })

  it('rejects an invalid mode', () => {
    expect(() =>
      StorageSchema.parse({
        ...validInput,
        state: { ...validInput.state, mode: 'auto' },
      }),
    ).toThrow()
  })

  it('defaults state.mode to "system"', () => {
    const { mode: _, ...stateWithoutMode } = validInput.state
    expect(
      StorageSchema.parse({ ...validInput, state: stateWithoutMode }).state
        .mode,
    ).toBe('system')
  })

  it.each(PER_PAGE_OPTIONS)('accepts perPage %s', (perPage) => {
    expect(() =>
      StorageSchema.parse({
        ...validInput,
        state: { ...validInput.state, perPage: Number(perPage.value) },
      }),
    ).not.toThrow()
  })

  it('defaults state.perPage to "10"', () => {
    const { perPage: _, ...stateWithoutPerPage } = validInput.state
    expect(
      StorageSchema.parse({ ...validInput, state: stateWithoutPerPage }).state
        .perPage,
    ).toBe(10)
  })

  it('rejects an invalid perPage', () => {
    expect(() =>
      StorageSchema.parse({
        ...validInput,
        state: { ...validInput.state, perPage: 37 },
      }),
    ).toThrow()
  })

  it('rejects missing state', () => {
    const { state: _, ...rest } = validInput
    expect(() => StorageSchema.parse(rest)).toThrow()
  })

  it('rejects missing version', () => {
    const { version: _, ...rest } = validInput
    expect(() => StorageSchema.parse(rest)).toThrow()
  })

  it('rejects non-number version', () => {
    expect(() => StorageSchema.parse({ ...validInput, version: '1' })).toThrow()
  })

  it('defaults state.sortBy to null', () => {
    const { sortBy: _, ...stateWithoutSortBy } = validInput.state
    expect(
      StorageSchema.parse({ ...validInput, state: stateWithoutSortBy }).state
        .sortBy,
    ).toBeNull()
  })

  it('accepts sortBy "name"', () => {
    expect(() =>
      StorageSchema.parse({
        ...validInput,
        state: { ...validInput.state, sortBy: 'name' },
      }),
    ).not.toThrow()
  })

  it.each(POKEMON_SKILLS)('accepts sortBy skill "%s"', (skill) => {
    expect(() =>
      StorageSchema.parse({
        ...validInput,
        state: { ...validInput.state, sortBy: skill },
      }),
    ).not.toThrow()
  })

  it('rejects invalid sortBy', () => {
    expect(() =>
      StorageSchema.parse({
        ...validInput,
        state: { ...validInput.state, sortBy: 'weight' },
      }),
    ).toThrow()
  })

  it('defaults state.sortOrder to null', () => {
    const { sortOrder: _, ...stateWithoutSortOrder } = validInput.state
    expect(
      StorageSchema.parse({ ...validInput, state: stateWithoutSortOrder }).state
        .sortOrder,
    ).toBeNull()
  })

  it('accepts sortOrder "desc"', () => {
    expect(() =>
      StorageSchema.parse({
        ...validInput,
        state: { ...validInput.state, sortOrder: 'desc' },
      }),
    ).not.toThrow()
  })

  it('rejects invalid sortOrder', () => {
    expect(() =>
      StorageSchema.parse({
        ...validInput,
        state: { ...validInput.state, sortOrder: 'random' },
      }),
    ).toThrow()
  })
})
