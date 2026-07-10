import { PaginationRangeDisplay } from '@/features/pagination/components/pagination-range-display'
import { PageSizePicker } from '@/features/pagination/components/page-size-picker'
import { Separator } from '@/shared/components/ui/separator'
import { cn } from '@/shared/lib/utils'

export function PageSizeControl({
  className,
  totalItems,
}: {
  className?: string
  totalItems: number
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <PageSizePicker />

      <Separator
        orientation="vertical"
        className="h-6 data-vertical:self-center"
      />

      <PaginationRangeDisplay totalItems={totalItems} />
    </div>
  )
}
