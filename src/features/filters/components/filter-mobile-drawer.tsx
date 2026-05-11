import { ListFilterIcon } from 'lucide-react'

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
import { cn } from '@/shared/lib/utils'

export function FilterMobileDrawer({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Drawer>
      <WithTooltip tooltip="Show filters">
        <DrawerTrigger asChild>
          <Button
            aria-label="Show filters"
            variant="outline"
            size="icon-md"
            className={cn('', className)}
            {...props}
          >
            <ListFilterIcon aria-hidden={true} />
          </Button>
        </DrawerTrigger>
      </WithTooltip>

      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Search Filters</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Clear All Filters</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
