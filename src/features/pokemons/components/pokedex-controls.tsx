import { Filtering, SearchPokemon } from '@/features/filters/components'
import { Sorting } from '@/features/sorting/components'
import { cn } from '@/shared/lib/utils'

export function PokedexControls({ className }: { className?: string }) {
  const handleSubmit: React.SubmitEventHandler = (e) => {
    e.preventDefault()
  }

  return (
    <div
      className={cn(
        'sticky top-4 z-10 w-full max-w-78 rounded-lg backdrop-blur-sm md:max-w-125',
        className,
      )}
    >
      <form onSubmit={handleSubmit} className="flex gap-2">
        <SearchPokemon />

        <div className="flex items-center gap-1 lg:gap-4">
          <Filtering className="flex-1" />
          <Sorting className="flex-1" />
        </div>
      </form>
    </div>
  )
}
