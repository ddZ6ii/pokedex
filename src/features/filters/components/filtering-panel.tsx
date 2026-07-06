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

const LABEL = 'Edit filtering options'

function FilteringTrigger({
  appliedFilterCount,
  asChild: TriggerComponent,
  className,
}: {
  appliedFilterCount: number
  asChild: React.ElementType
  className?: string
}) {
  const hasFiltersApplied = appliedFilterCount > 0

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
              hasFiltersApplied &&
                'dark:text-foreground! text-background bg-primary! hover:bg-primary/95! hover:text-background',
            )}
          >
            <ListFilterIcon aria-hidden={true} />
          </Button>
        </TriggerComponent>
      </WithTooltip>

      {hasFiltersApplied && <CountBadge count={appliedFilterCount} />}
    </div>
  )
}

export function FilteringPanel({
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
        <FilteringTrigger
          appliedFilterCount={appliedFilterCount}
          asChild={DrawerTrigger}
          className={className}
        />
        <DrawerContent className="items-center overflow-hidden">
          <div className="flex min-h-0 w-full flex-1 flex-col">
            <DrawerHeader className="mx-auto max-w-xl p-4 text-center">
              <DrawerTitle>Filtering Options</DrawerTitle>
              <DrawerDescription>
                Select criteria to filter the Pokémon list.
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
                  disabled={appliedFilterCount === 0}
                  className="sm:flex-1"
                  onClick={() => {
                    onReset?.()
                  }}
                >
                  Reset
                </Button>
                <DrawerClose asChild>
                  <Button
                    disabled={!!error || !hasFiltersChange}
                    className="sm:flex-1"
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
      <FilteringTrigger
        appliedFilterCount={appliedFilterCount}
        asChild={DialogTrigger}
        className={className}
      />

      <DialogContent className="h-fit w-fit min-w-lg items-center overflow-hidden">
        <div className="flex min-h-0 w-full max-w-xl flex-1 flex-col">
          <DialogHeader className="p-4 text-center">
            <DialogTitle className="text-base">Filtering Options</DialogTitle>
            <DialogDescription>
              Choose a field to sort by and a direction.
            </DialogDescription>
          </DialogHeader>

          {/* Content */}
          <div className="no-scrollbar mb-4 flex-1 overflow-y-auto p-4">
            {children}
          </div>

          <DialogFooter className="gap-4">
            <Button
              variant="outline"
              disabled={appliedFilterCount === 0}
              onClick={() => {
                onReset?.()
              }}
            >
              Reset
            </Button>

            <DialogClose asChild>
              <Button
                disabled={!!error || !hasFiltersChange}
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
