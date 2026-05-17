import { XIcon } from 'lucide-react'
import { Fragment, useState } from 'react'

import { Button } from '@/shared/components/ui/button'
import { WithTooltip } from '@/shared/components/with-tooltip'
import {
  Select as UISelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { cn } from '@/shared/lib/utils'
import type { SelectOption } from '@/shared/types'
import { capitalize, groupOptions } from '@/shared/utilities'

const DEFAULT_RENDER_OPTION = <T extends string>(option: SelectOption<T>) =>
  capitalize(option.label)

type CommonProps<T extends string> = Omit<
  React.ComponentProps<typeof SelectTrigger>,
  'value'
> & {
  options: SelectOption<T>[]
  placeholder?: string
  renderOption?: (option: SelectOption<T>) => React.ReactNode
  renderValue?: (value: T) => React.ReactNode
  tooltip?: string
}

type ClearableProps<T extends string> = {
  clearable: true
  value: T | null
  onValueChange: (value: T | null) => void
  wrapperClassName?: string
}

type NonClearableProps<T extends string> = {
  clearable?: false
  value: T | null
  onValueChange: (value: T) => void
  wrapperClassName?: never
}

type SelectProps<T extends string> = CommonProps<T> &
  (ClearableProps<T> | NonClearableProps<T>)

export function Select<T extends string>({
  clearable = false,
  className,
  onValueChange,
  options,
  placeholder = 'Select an option...',
  renderOption = DEFAULT_RENDER_OPTION,
  renderValue,
  tooltip,
  value,
  wrapperClassName,
  ...props
}: SelectProps<T>) {
  // Control both the select and tooltip components to ensure the tooltip doesn't show when the select dropdown is open
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)

  const selectContent = (
    <>
      <SelectTrigger className={className} {...props}>
        {renderValue && value !== null ? (
          <SelectValue>{renderValue(value)}</SelectValue>
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>

      <SelectContent position="popper" align="end">
        <SelectGroup>
          {groupOptions(options).map((group, groupIndex) => (
            <Fragment key={group.label ?? `ungrouped-${String(groupIndex)}`}>
              {groupIndex > 0 && <SelectSeparator />}
              {group.label && (
                <SelectLabel>{capitalize(group.label)}</SelectLabel>
              )}
              {group.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {renderOption(option)}
                </SelectItem>
              ))}
            </Fragment>
          ))}
        </SelectGroup>
      </SelectContent>
    </>
  )

  const SelectComponent = (
    <UISelect
      value={value ?? ''}
      onOpenChange={setIsSelectOpen}
      onValueChange={(nextValue) => {
        onValueChange(nextValue as T)
      }}
    >
      {tooltip ? (
        <WithTooltip
          tooltip={tooltip}
          open={isSelectOpen ? false : isTooltipOpen}
          onOpenChange={setIsTooltipOpen}
        >
          {selectContent}
        </WithTooltip>
      ) : (
        selectContent
      )}
    </UISelect>
  )

  if (clearable) {
    return (
      <div className={cn('flex items-center gap-1', wrapperClassName)}>
        {SelectComponent}

        {value !== null && (
          <WithTooltip tooltip="Clear selection">
            <Button
              aria-label="Clear selection"
              variant="destructive"
              size="icon-md"
              onClick={() => {
                ;(onValueChange as (value: T | null) => void)(null)
              }}
            >
              <XIcon
                aria-hidden={true}
                className="pointer-events-none size-3"
              />
            </Button>
          </WithTooltip>
        )}
      </div>
    )
  }

  return SelectComponent
}
