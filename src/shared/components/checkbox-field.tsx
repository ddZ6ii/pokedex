import { useId } from 'react'

import { Checkbox } from '@/shared/components/ui/checkbox'
import { Field } from '@/shared/components/ui/field'
import { Label } from '@/shared/components/ui/label'
import { cn } from '@/shared/lib/utils'

export function CheckboxField({
  label,
  className,
  orientation = 'horizontal',
  wrapperClassName,
  ...props
}: Omit<React.ComponentProps<typeof Checkbox>, 'id'> & {
  label: string
  orientation?: React.ComponentProps<typeof Field>['orientation']
  wrapperClassName?: string
}) {
  const id = useId()

  return (
    <Field orientation={orientation} className={wrapperClassName}>
      <Checkbox id={id} className={cn('rounded-xs', className)} {...props} />
      <Label
        htmlFor={id}
        className="text-muted-foreground peer-data-[state=checked]:text-foreground"
      >
        {label}
      </Label>
    </Field>
  )
}
