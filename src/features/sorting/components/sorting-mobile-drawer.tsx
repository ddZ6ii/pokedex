import { ArrowUpDownIcon } from 'lucide-react'

import { WithTooltip } from '@/shared/components'
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

export function SortingMobileDrawer({
  children,
  className,
  onOpen,
  onApply,
  onReset,
}: {
  className?: string
  children?: React.ReactNode
  onOpen?: () => void
  onApply?: () => void
  onReset?: () => void
}) {
  return (
    <Drawer
      onOpenChange={(open) => {
        if (open) {
          onOpen?.()
        }
      }}
    >
      <WithTooltip tooltip="Show sorting options">
        <DrawerTrigger asChild>
          <Button
            aria-label="Show sorting options"
            variant="outline"
            size="icon-md"
            className={className}
          >
            <ArrowUpDownIcon aria-hidden={true} />
          </Button>
        </DrawerTrigger>
      </WithTooltip>

      <DrawerContent>
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle>Sorting Options</DrawerTitle>
            <DrawerDescription>
              Choose a field to sort by and a direction.
            </DrawerDescription>
          </DrawerHeader>

          {children}

          <DrawerFooter className="mx-auto max-w-sm sm:max-w-lg sm:flex-row">
            <DrawerClose asChild>
              <Button
                className="sm:flex-1"
                onClick={() => {
                  onApply?.()
                }}
              >
                Apply
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="sm:flex-1"
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
