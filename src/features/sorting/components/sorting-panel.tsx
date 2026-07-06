import { ArrowUpDownIcon } from 'lucide-react'

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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog'
import { cn } from '@/shared/lib/utils'
import { useIsMobile } from '@/shared/hooks'

const LABEL = 'Edit sorting options'

export function SortingTrigger({
  appliedCriteriaCount,
  asChild: TriggerComponent,
  className,
}: {
  appliedCriteriaCount: number
  className?: string
  asChild: React.ElementType
}) {
  const hasCriteriaSelected = appliedCriteriaCount > 0

  return (
    <div className="relative">
      <WithTooltip tooltip={LABEL}>
        <TriggerComponent asChild>
          <Button
            aria-label={LABEL}
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
        </TriggerComponent>
      </WithTooltip>

      {hasCriteriaSelected && <CountBadge count={appliedCriteriaCount} />}
    </div>
  )
}

export function SortingPanel({
  appliedCriteriaCount,
  children,
  className,
  hasSortingChange,
  onApply,
  onOpen,
  onReset,
}: React.PropsWithChildren & {
  appliedCriteriaCount: number
  className?: string
  hasSortingChange: boolean
  onApply?: () => void
  onOpen?: () => void
  onReset?: () => void
}) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Drawer
        onOpenChange={(open) => {
          if (open) {
            onOpen?.()
          }
        }}
      >
        <SortingTrigger
          appliedCriteriaCount={appliedCriteriaCount}
          asChild={DrawerTrigger}
          className={className}
        />

        <DrawerContent className="items-center overflow-hidden">
          <div className="flex min-h-0 w-full flex-1 flex-col">
            <DrawerHeader className="mx-auto max-w-xl p-4 text-center">
              <DrawerTitle>Sorting Options</DrawerTitle>
              <DrawerDescription>
                Choose a field to sort by and a direction.
              </DrawerDescription>
            </DrawerHeader>

            {/* Content */}
            <div className="no-scrollbar mx-auto mb-4 w-full max-w-xl flex-1 overflow-y-auto p-4">
              {children}
            </div>

            <DrawerFooter className="bg-muted/50">
              <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-2 sm:flex-row">
                <Button
                  variant="outline"
                  className="sm:flex-1"
                  disabled={appliedCriteriaCount === 0}
                  onClick={() => {
                    onReset?.()
                  }}
                >
                  Reset
                </Button>
                <DrawerClose asChild>
                  <Button
                    className="sm:flex-1"
                    disabled={!hasSortingChange}
                    onClick={() => {
                      onApply?.()
                    }}
                  >
                    Apply
                  </Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (open) {
          onOpen?.()
        }
      }}
    >
      <SortingTrigger
        asChild={DialogTrigger}
        className={className}
        appliedCriteriaCount={appliedCriteriaCount}
      />

      <DialogContent className="h-fit w-fit min-w-lg items-center overflow-hidden p-0">
        <div className="flex min-h-0 w-full max-w-xl flex-1 flex-col">
          <DialogHeader className="p-4 text-center">
            <DialogTitle className="text-base">Sorting Options</DialogTitle>
            <DialogDescription>
              Choose a field to sort by and a direction.
            </DialogDescription>
          </DialogHeader>

          {/* Content */}
          <div className="no-scrollbar flex-1 overflow-y-auto p-4">
            {children}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              disabled={appliedCriteriaCount === 0}
              onClick={() => {
                onReset?.()
              }}
            >
              Reset
            </Button>

            <DialogClose asChild>
              <Button
                disabled={!hasSortingChange}
                onClick={() => {
                  onApply?.()
                }}
              >
                Apply
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
