import { Filtering } from '@/features/filters/components/filtering'
import { Search } from '@/features/filters/components/search'
import { Sorting } from '@/features/sorting/components'
import { Separator } from '@/shared/components/ui/separator'
import { cn } from '@/shared/lib/utils'

export function Filters({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex w-full max-w-78 gap-2 md:max-w-162 lg:max-w-none lg:flex-col lg:gap-6',
        className,
      )}
      {...props}
    >
      <Search
        id="search-pokemon"
        wrapperClassName="mx-auto w-full lg:max-w-sm"
      />

      <Separator orientation="vertical" className="lg:hidden" />

      <div className="flex items-center gap-4">
        <Filtering className="flex-1" />
        <Separator orientation="vertical" className="hidden lg:block" />
        <Sorting className="flex-1" />
      </div>
    </div>
  )
}
