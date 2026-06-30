import { ListFilterIcon } from 'lucide-react'

import { CountBadge, WithTooltip } from '@/shared/components'
import { Button } from '@/shared/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/components/ui/drawer'
import { Separator } from '@/shared/components/ui/separator'
import { cn } from '@/shared/lib/utils'

const LABEL = 'Edit filtering options'

export function FilteringDrawer({
  appliedFilterCount,
  children,
  className,
  hasFiltersChange,
  error,
  onApply,
  onOpen,
  onReset,
}: React.PropsWithChildren & {
  appliedFilterCount: number
  className?: string
  hasFiltersChange: boolean
  error?: Error | null
  onApply?: () => void
  onOpen?: () => void
  onReset?: () => void
}) {
  const hasFiltersApplied = appliedFilterCount > 0

  return (
    <Drawer
      onOpenChange={(open) => {
        if (open) {
          onOpen?.()
        }
      }}
    >
      <div className="relative">
        <WithTooltip tooltip={LABEL}>
          <DrawerTrigger asChild>
            <Button
              aria-label={LABEL}
              variant="outline"
              size="icon-md"
              className={cn(
                className,
                hasFiltersApplied &&
                  'dark:text-foreground! text-background bg-primary! hover:bg-primary/95! hover:text-background',
              )}
            >
              <ListFilterIcon aria-hidden={true} />
            </Button>
          </DrawerTrigger>
        </WithTooltip>

        {hasFiltersApplied && <CountBadge count={appliedFilterCount} />}
      </div>

      <DrawerContent className="items-center overflow-hidden">
        <div className="@container/drawer-content flex min-h-0 w-full max-w-xl flex-1 flex-col">
          <DrawerHeader>
            <DrawerTitle>Filtering Options</DrawerTitle>
            <DrawerDescription>
              Select criteria to filter the Pokémon list.
            </DrawerDescription>
          </DrawerHeader>

          {/* Content */}
          <div className="no-scrollbar flex-1 overflow-y-auto p-4">
            {children}
          </div>

          <Separator className="mx-auto my-2 max-w-1/2" />

          <DrawerFooter className="gap-x-4 @md/drawer-content:flex-row">
            <DrawerClose asChild>
              <Button
                disabled={!!error || !hasFiltersChange}
                className="@md/drawer-content:flex-1"
                onClick={() => {
                  onApply?.()
                }}
              >
                Apply
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button
                disabled={!hasFiltersChange}
                variant="outline"
                className="@md/drawer-content:flex-1"
                onClick={() => {
                  onReset?.()
                }}
              >
                Reset
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
