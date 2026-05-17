import { Filtering } from '@/features/filters/components/filtering'
import { SearchPokemon } from '@/features/filters/components/search-pokemon'
import { Sorting } from '@/features/sorting/components'
import { cn } from '@/shared/lib/utils'

export function Filters({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex w-full max-w-78 gap-2 md:max-w-162 2xl:max-w-330',
        className,
      )}
      {...props}
    >
      <SearchPokemon />

      <div className="flex items-center gap-1 lg:gap-4">
        <Filtering className="flex-1" />
        <Sorting className="flex-1" />
      </div>
    </div>
  )
}
