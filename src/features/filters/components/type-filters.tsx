import { POKEMON_TYPES, type PokemonType } from '@/features/pokemons/schemas'
import { CheckboxField } from '@/shared/components'
import { Button } from '@/shared/components/ui/button'
import {
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
} from '@/shared/components/ui/field'

export function TypeFilters({
  error,
  onSelectAllTypes,
  onUnselectAllTypes,
  onSelectType,
  types,
}: {
  error: Error | null
  onSelectType: (type: PokemonType, nextChecked: boolean) => void
  onSelectAllTypes: () => void
  onUnselectAllTypes: () => void
  types: Set<PokemonType>
}) {
  return (
    <FieldSet className="w-full">
      <FieldDescription>
        You can choose multiple types to narrow down your search results.
      </FieldDescription>

      <FieldGroup>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-x-4 gap-y-2">
          {POKEMON_TYPES.map((type) => (
            <CheckboxField
              key={type}
              label={type}
              checked={types.has(type)}
              onCheckedChange={(nextChecked) => {
                onSelectType(type, nextChecked as boolean)
              }}
            />
          ))}
        </div>

        {error && <FieldError>{error.message}</FieldError>}
      </FieldGroup>

      <div className="flex gap-x-4">
        <Button
          disabled={types.size === POKEMON_TYPES.length}
          variant="outline"
          onClick={() => {
            onSelectAllTypes()
          }}
          className="flex-1"
        >
          Select All
        </Button>

        <Button
          disabled={!!error || types.size === 0}
          variant="secondary"
          onClick={() => {
            onUnselectAllTypes()
          }}
          className="flex-1"
        >
          Unselect All
        </Button>
      </div>
    </FieldSet>
  )
}
