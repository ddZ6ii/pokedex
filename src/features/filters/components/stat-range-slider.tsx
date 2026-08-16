import { useId } from 'react'

import { Label } from '@/shared/components/ui/label'
import { Slider } from '@/shared/components/ui/slider'
import { cn } from '@/shared/lib/utils'

export function StatRangeSlider<T extends string>({
  className,
  isActive,
  label,
  max = 100,
  min = 0,
  onValueChange,
  step = 1,
  value,
}: Omit<React.ComponentProps<typeof Slider>, 'onValueChange'> & {
  className?: string
  isActive: boolean
  label: T
  onValueChange: (value: number[], label: T) => void
}) {
  const id = useId()

  return (
    <div className={cn('grid gap-3', className)}>
      <Label htmlFor={id} className="capitalize">
        {label}
      </Label>

      <Slider
        id={id}
        value={value}
        onValueChange={(value) => {
          onValueChange(value, label)
        }}
        min={min}
        max={max}
        step={step}
        getThumbLabel={(index) =>
          `${label} ${index === 0 ? 'minimum' : 'maximum'}`
        }
        className={cn(
          '**:data-[slot=slider-range]:bg-muted-foreground/50',
          isActive && '**:data-[slot=slider-range]:bg-primary',
        )}
      />

      <div className="text-muted-foreground flex justify-between text-xs font-medium">
        <span>{value?.[0]?.toFixed()}</span>
        <span>{value?.[1]?.toFixed()}</span>
      </div>
    </div>
  )
}
