import { Spinner } from '@/shared/components/ui/spinner'
import { cn } from '@/shared/lib/utils'

export function DefaultPendingComponent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-1 flex-col items-center justify-center',
        className,
      )}
    >
      <Spinner />
    </div>
  )
}
