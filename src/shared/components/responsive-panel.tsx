import type { LucideIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { CountBadge, WithTooltip } from '@/shared/components'
import { Button } from '@/shared/components/ui/button'
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
import { useIsMobile } from '@/shared/hooks'

// Slightly longer than the dialog's close animation (`duration-100`), so the
// close has always painted before `onApply` runs — with a hard fallback in
// case the close animation doesn't fire (e.g. reduced motion, no animation
// support).
const APPLY_FALLBACK_DELAY_MS = 150

function PanelTrigger({
  asChild: TriggerComponent,
  className,
  count,
  Icon,
  label,
}: {
  asChild: React.ElementType
  className?: string
  count: number
  Icon: LucideIcon
  label: string
}) {
  const showCount = count > 0
  const triggerLabel = `Edit ${label}`

  return (
    <div className="relative">
      <WithTooltip tooltip={triggerLabel}>
        <TriggerComponent asChild>
          <Button
            variant="outline"
            size="icon-md"
            className={cn(
              className,
              showCount &&
                'dark:text-foreground! text-background bg-primary! hover:bg-primary/95! hover:text-background',
            )}
          >
            <span className="sr-only">{triggerLabel}</span>
            <Icon aria-hidden={true} />
          </Button>
        </TriggerComponent>
      </WithTooltip>

      {showCount && <CountBadge count={count} />}
    </div>
  )
}

export function ResponsivePanel({
  className,
  children,
  count,
  description,
  isApplyDisabled,
  Icon,
  label,
  onApply,
  onOpen,
  onReset,
}: React.PropsWithChildren & {
  className?: string
  count: number
  description?: string
  isApplyDisabled?: boolean
  Icon: LucideIcon
  label: string
  onApply?: () => void
  onOpen?: () => void
  onReset?: () => void
}) {
  const isMobile = useIsMobile()

  // Applying filters/sorting re-renders the (potentially near-fully-swapped)
  // list behind the dialog, which is expensive enough to block the main
  // thread and delay the dialog's own close-animation `animationend` event —
  // making the dialog appear to hang open, then vanish (a visual flash).
  // Deferring `onApply` until the close animation has genuinely finished
  // avoids that collision.
  const pendingApplyRef = useRef(false)
  const applyFallbackTimeoutRef =
    useRef<ReturnType<typeof setTimeout>>(undefined)

  const finishApply = () => {
    if (!pendingApplyRef.current) return
    pendingApplyRef.current = false
    clearTimeout(applyFallbackTimeoutRef.current)
    onApply?.()
  }

  useEffect(() => {
    return () => {
      clearTimeout(applyFallbackTimeoutRef.current)
    }
  }, [])

  if (isMobile) {
    return (
      <Drawer
        onOpenChange={(open) => {
          if (open) {
            onOpen?.()
          }
        }}
      >
        <PanelTrigger
          asChild={DrawerTrigger}
          className={className}
          count={count}
          Icon={Icon}
          label={label}
        />

        <DrawerContent className="items-center overflow-hidden">
          <div className="flex min-h-0 w-full flex-1 flex-col">
            <DrawerHeader className="mx-auto max-w-xl p-4 text-center">
              <DrawerTitle className="capitalize">{label}</DrawerTitle>
              {description && (
                <DrawerDescription>{description}</DrawerDescription>
              )}
            </DrawerHeader>

            {/* Content */}
            <div className="no-scrollbar mx-auto mb-4 w-full max-w-xl flex-1 overflow-y-auto p-4">
              {children}
            </div>

            <DrawerFooter className="bg-muted/50">
              <div className="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-2 sm:flex-row">
                <Button
                  variant="outline"
                  disabled={count === 0}
                  className="sm:flex-1"
                  onClick={() => {
                    onReset?.()
                  }}
                >
                  Reset
                </Button>
                <DrawerClose asChild>
                  <Button
                    disabled={isApplyDisabled}
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
      <PanelTrigger
        asChild={DialogTrigger}
        className={className}
        count={count}
        Icon={Icon}
        label={label}
      />

      <DialogContent
        className="h-fit w-fit min-w-lg items-center overflow-hidden"
        onAnimationEnd={(e) => {
          if (e.target !== e.currentTarget) return
          if (e.currentTarget.dataset.state === 'closed') {
            finishApply()
          }
        }}
      >
        <div className="flex min-h-0 w-full max-w-xl flex-1 flex-col">
          <DialogHeader className="p-4 text-center">
            <DialogTitle className="text-base capitalize">{label}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>

          {/* Content */}
          <div className="no-scrollbar mb-4 flex-1 overflow-y-auto p-4">
            {children}
          </div>

          <DialogFooter className="gap-4">
            <Button
              variant="outline"
              disabled={count === 0}
              onClick={() => {
                onReset?.()
              }}
            >
              Reset
            </Button>

            <DialogClose asChild>
              <Button
                disabled={isApplyDisabled}
                onClick={() => {
                  pendingApplyRef.current = true
                  applyFallbackTimeoutRef.current = setTimeout(
                    finishApply,
                    APPLY_FALLBACK_DELAY_MS,
                  )
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
