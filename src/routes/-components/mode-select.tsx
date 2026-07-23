import { CogIcon, MoonIcon, SunIcon, type LucideIcon } from 'lucide-react'

import { Select } from '@/shared/components/select'
import { cn } from '@/shared/lib/utils'
import { MODE_OPTIONS, type Mode } from '@/shared/schemas'
import { useMode, useModeActions } from '@/shared/store'
import { capitalize } from '@/shared/utilities'

const ICONS = new Map<Mode, LucideIcon>([
  ['dark', MoonIcon],
  ['light', SunIcon],
  ['system', CogIcon],
])

const getIconForMode = (mode: Mode): LucideIcon => {
  const Icon = ICONS.get(mode)
  if (!Icon) {
    throw new Error(
      `No icon found for mode "${mode}". Please ensure that all modes have a corresponding icon defined in the ICONS map.`,
    )
  }
  return Icon
}

export function ModeSelect({ className }: { className?: string }) {
  const mode = useMode()
  const { setMode } = useModeActions()

  const Icon = getIconForMode(mode)
  const tooltip = `Select mode (${mode})`

  return (
    <Select
      id="mode-select"
      aria-label={tooltip}
      className={cn(
        'w-9 justify-center px-2 md:w-fit md:px-3 [&>svg:last-of-type]:hidden md:[&>svg:last-of-type]:block',
        className,
      )}
      tooltip={tooltip}
      options={MODE_OPTIONS}
      value={mode}
      renderValue={(value) => (
        <>
          <Icon aria-hidden={true} />
          <span className="hidden md:block">{capitalize(value)}</span>
        </>
      )}
      onValueChange={(nextValue) => {
        setMode(nextValue)
      }}
    />
  )
}
