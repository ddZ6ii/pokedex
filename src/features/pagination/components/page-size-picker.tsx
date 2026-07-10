import { PER_PAGE_OPTIONS, type Filters } from '@/features/filters/schemas'
import { Select } from '@/shared/components/select'
import { cn } from '@/shared/lib/utils'
import { useFiltersActions, usePerPage } from '@/shared/store'

export function PageSizePicker({ className }: { className?: string }) {
  const perPage = usePerPage()
  const { setPerPage } = useFiltersActions()

  return (
    <div className="flex items-center justify-center gap-2">
      <p className="hidden whitespace-nowrap lg:block">Per page:</p>

      <Select
        placeholder="Items per page"
        size="sm"
        options={PER_PAGE_OPTIONS}
        value={String(perPage)}
        onValueChange={(nextValue) => {
          setPerPage(Number(nextValue) as Filters['perPage'])
        }}
        className={cn('w-full max-w-17', className)}
      />
    </div>
  )
}
