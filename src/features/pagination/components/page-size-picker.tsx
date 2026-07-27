import { getRouteApi } from '@tanstack/react-router'

import { PER_PAGE_OPTIONS, type Filters } from '@/features/filters/schemas'
import { Select } from '@/shared/components/select'
import { cn } from '@/shared/lib/utils'

const routeApi = getRouteApi('/(public)/pokemons')

export function PageSizePicker({ className }: { className?: string }) {
  const { perPage } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  return (
    <div className="flex items-center justify-center gap-2">
      <p className="hidden whitespace-nowrap lg:block">Per page:</p>

      <Select
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
