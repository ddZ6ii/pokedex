import { Badge } from '@/shared/components/ui/badge'
import { cn } from '@/shared/lib/utils'

export function CountBadge({
  className,
  count,
  ...props
}: React.ComponentProps<typeof Badge> & { count: number }) {
  const displayCount = count > 9 ? '9+' : count.toString()

  return (
    <Badge
      variant="secondary"
      className={cn(
        'outline-primary absolute -top-2 -right-2 aspect-square rounded-full',
        className,
      )}
      {...props}
    >
      {displayCount}
    </Badge>
  )
}
