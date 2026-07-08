import { Pokedex } from '@/features/pokemons/components'
import { PageLayout } from '@/shared/components'
import { TooltipProvider } from '@/shared/components/ui/tooltip'

export function App() {
  return (
    <TooltipProvider>
      <PageLayout>
        <Pokedex />
      </PageLayout>
    </TooltipProvider>
  )
}
