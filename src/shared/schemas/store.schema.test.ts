import { describe, expect, it } from 'vitest'

import { MODES } from '@/shared/schemas/mode.schema'
import {
  StorageSchema,
  type PersistedStoreState,
} from '@/shared/schemas/store.schema'

const validInput: PersistedStoreState = {
  version: 1,
  state: { mode: 'light' },
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
  })

  describe('default values', () => {
    it('defaults state.mode to "system"', () => {
      const { mode: _, ...stateWithoutMode } = validInput.state
      expect(
        StorageSchema.parse({ ...validInput, state: stateWithoutMode }).state
          .mode,
      ).toBe('system')
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
  })
})
