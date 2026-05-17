import { describe, expect, it } from 'vitest'

import { PER_PAGE_OPTIONS } from '@/features/filters/schemas'
import { MODES } from '@/shared/schemas/mode.schema'
import {
  StorageSchema,
  type PersistedStoreState,
} from '@/shared/schemas/store.schema'

const validInput: PersistedStoreState = {
  version: 1,
  state: { mode: 'light', perPage: 10, sort: [['name', 'asc']] },
}

describe('StorageSchema', () => {
  describe('valid input', () => {
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

    it.each(PER_PAGE_OPTIONS)('accepts perPage %s', (perPage) => {
      expect(() =>
        StorageSchema.parse({
          ...validInput,
          state: { ...validInput.state, perPage: Number(perPage.value) },
        }),
      ).not.toThrow()
    })

    it('accepts sortBy "name"', () => {
      expect(() =>
        StorageSchema.parse({
          ...validInput,
          state: { ...validInput.state, sort: [['name', 'asc']] },
        }),
      ).not.toThrow()
    })

    it('accepts sortOrder "desc"', () => {
      expect(() =>
        StorageSchema.parse({
          ...validInput,
          state: { ...validInput.state, sort: [['name', 'desc']] },
        }),
      ).not.toThrow()
    })
  })

  describe('default values', () => {
    it('defaults state.mode to "system"', () => {
      const { mode: _, ...stateWithoutMode } = validInput.state
      expect(
        StorageSchema.parse({ ...validInput, state: stateWithoutMode }).state
          .mode,
      ).toBe('system')
    })

    it('defaults state.perPage to "10"', () => {
      const { perPage: _, ...stateWithoutPerPage } = validInput.state
      expect(
        StorageSchema.parse({ ...validInput, state: stateWithoutPerPage }).state
          .perPage,
      ).toBe(10)
    })

    it('defaults state.sort to "[]"', () => {
      const { sort: _, ...stateWithoutSort } = validInput.state
      expect(
        StorageSchema.parse({ ...validInput, state: stateWithoutSort }).state
          .sort,
      ).toEqual([])
    })
  })

  describe('invalid input', () => {
    it('rejects missing version', () => {
      const { version: _, ...rest } = validInput
      expect(() => StorageSchema.parse(rest)).toThrow()
    })

    it('rejects non-number version', () => {
      expect(() =>
        StorageSchema.parse({ ...validInput, version: '1' }),
      ).toThrow()
    })

    it('rejects missing state', () => {
      const { state: _, ...rest } = validInput
      expect(() => StorageSchema.parse(rest)).toThrow()
    })

    it('rejects an invalid mode', () => {
      expect(() =>
        StorageSchema.parse({
          ...validInput,
          state: { ...validInput.state, mode: 'auto' },
        }),
      ).toThrow()
    })

    it('rejects an invalid perPage', () => {
      expect(() =>
        StorageSchema.parse({
          ...validInput,
          state: { ...validInput.state, perPage: 37 },
        }),
      ).toThrow()
    })

    it('rejects invalid sortBy', () => {
      expect(() =>
        StorageSchema.parse({
          ...validInput,
          state: { ...validInput.state, sort: [['weight', 'asc']] },
        }),
      ).toThrow()
    })
  })
})
