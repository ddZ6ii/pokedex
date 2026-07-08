import { Filtering, SearchPokemon } from '@/features/filters/components'
import { Sorting } from '@/features/sorting/components'
import { cn } from '@/shared/lib/utils'

export function PokedexControls({ className }: { className?: string }) {
  const handleSubmit: React.SubmitEventHandler = (e) => {
    e.preventDefault()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'flex w-full max-w-78 gap-2 md:max-w-162 2xl:max-w-330',
        className,
      )}
    >
      <SearchPokemon />

      <div className="flex items-center gap-1 lg:gap-4">
        <Filtering className="flex-1" />
        <Sorting className="flex-1" />
      </div>
    </form>
  )
}
