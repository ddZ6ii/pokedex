import * as z from 'zod'

import type { SelectOption } from '@/shared/types'

const MODES = ['light', 'dark', 'system'] as const

const MODE_OPTIONS = MODES.map((mode) => ({
  group: 'mode',
  label: mode,
  value: mode,
})) satisfies SelectOption<(typeof MODES)[number]>[]

const ModeSchema = z.enum(MODES).default('system')

type Mode = z.infer<typeof ModeSchema>

export { MODES, MODE_OPTIONS, ModeSchema, type Mode }
