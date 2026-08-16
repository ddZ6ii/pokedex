import { useId } from 'react'

import { PER_PAGE_OPTIONS, type Filters } from '@/features/filters/schemas'
import { pokemonsRouteApi as routeApi } from '@/routes/(public)/-route-api'
import { Select } from '@/shared/components/select'
import { cn } from '@/shared/lib/utils'

export function PageSizePicker({ className }: { className?: string }) {
  const id = useId()
  const { perPage } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  return (
    <div className="flex items-center justify-center gap-2">
      <p id={id} className="hidden whitespace-nowrap lg:block">
        Per page:
      </p>

      <Select
        aria-labelledby={id}
        placeholder="Items per page"
        size="sm"
        options={PER_PAGE_OPTIONS}
        value={String(perPage)}
        onValueChange={(nextValue) => {
          void navigate({
            search: (prev) => ({
              ...prev,
              perPage: Number(nextValue) as Filters['perPage'],
              page: 1,
            }),
          })
        }}
        className={cn('w-full max-w-17', className)}
      />
    </div>
  )
}
