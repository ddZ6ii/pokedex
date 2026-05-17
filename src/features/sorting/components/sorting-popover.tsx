import { ArrowUpDownIcon } from 'lucide-react'

import { CountBadge, WithTooltip } from '@/shared/components'
import { Button } from '@/shared/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/shared/components/ui/popover'
import { Separator } from '@/shared/components/ui/separator'
import { cn } from '@/shared/lib/utils'

export function SortingPopover({
  children,
  className,
  selectedCount,
  onApply,
  onOpen,
  onReset,
}: React.PropsWithChildren & {
  className?: string
  selectedCount?: number
  onApply?: () => void
  onOpen?: () => void
  onReset?: () => void
}) {
  const hasCriteriaSelected = selectedCount !== undefined && selectedCount > 0

  return (
    <Popover
      onOpenChange={(open) => {
        if (open) {
          onOpen?.()
        }
      }}
    >
      <div className="relative">
        <WithTooltip tooltip="Edit sorting options">
          <PopoverTrigger asChild>
            <Button
              aria-label="Edit sorting options"
              variant="outline"
              size="icon-md"
              className={cn(
                className,
                hasCriteriaSelected &&
                  'dark:text-foreground! text-background bg-primary! hover:bg-primary/95! hover:text-background',
              )}
            >
              <ArrowUpDownIcon aria-hidden={true} />
            </Button>
          </PopoverTrigger>
        </WithTooltip>

        {hasCriteriaSelected && <CountBadge count={selectedCount} />}
      </div>

      <PopoverContent
        align="end"
        className="h-fit w-fit min-w-lg items-center overflow-hidden p-0"
      >
        <div className="@container/popover-content flex min-h-0 w-full max-w-xl flex-1 flex-col">
          <PopoverHeader className="p-4 text-center">
            <PopoverTitle className="text-base">Sorting Options</PopoverTitle>
            <PopoverDescription>
              Choose a field to sort by and a direction.
            </PopoverDescription>
          </PopoverHeader>

          {/* Content */}
          <div className="no-scrollbar flex-1 overflow-y-auto p-4">
            {children}
          </div>

          <Separator className="mx-auto my-2 max-w-1/2" />

          <PopoverFooter className="gap-x-4 p-4 @md/popover-content:flex-row">
            <Button
              className="@md/popover-content:flex-1"
              onClick={() => {
                onApply?.()
              }}
            >
              Apply
            </Button>
            <Button
              variant="outline"
              className="@md/popover-content:flex-1"
              onClick={() => {
                onReset?.()
              }}
            >
              Reset
            </Button>
          </PopoverFooter>
        </div>
      </PopoverContent>
    </Popover>
  )
}
