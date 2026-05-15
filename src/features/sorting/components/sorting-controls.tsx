import {
  SORT_BY_OPTIONS,
  SORT_ORDER_OPTIONS,
  type SelectSortByOptions,
  type SelectSortOrderOptions,
} from '@/features/sorting/schemas'
import { Select } from '@/shared/components/select'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/shared/components/ui/field'
import { cn } from '@/shared/lib/utils'

type SortingControlsProps = React.ComponentProps<'div'> & {
  disabled?: boolean
  className?: string
  onSortBySelect: (sortBy: SelectSortByOptions | null) => void
  onSortOrderSelect: (sortOrder: SelectSortOrderOptions | null) => void
  selectedSortBy: SelectSortByOptions | null
  selectedOrderBy: SelectSortOrderOptions | null
}

export function SortingControls({
  className,
  disabled,
  onSortBySelect,
  onSortOrderSelect,
  selectedSortBy,
  selectedOrderBy,
}: SortingControlsProps) {
  return (
    <FieldSet
      disabled={disabled}
      className={cn('mx-auto max-w-sm sm:max-w-lg', className)}
    >
      <FieldGroup>
        <Field orientation="responsive">
          <FieldContent className="w-full flex-2">
            <FieldLabel htmlFor="sort-by" className="whitespace-nowrap">
              Sort by:
            </FieldLabel>
            <Select
              clearable
              id="sort-by"
              aria-label="Select sorting criteria"
              placeholder="Select sorting criteria..."
              options={SORT_BY_OPTIONS}
              value={selectedSortBy}
              onValueChange={onSortBySelect}
              className={cn(
                'w-full flex-1',
                selectedSortBy !== null && 'lg:border-primary',
              )}
            />
          </FieldContent>

          <div className="flex flex-col gap-2">
            <FieldContent className="w-full flex-1">
              <FieldLabel htmlFor="order-by" className="whitespace-nowrap">
                Order by:
              </FieldLabel>
              <Select
                id="order-by"
                aria-label="Select sorting order..."
                placeholder="Select sorting order..."
                disabled={selectedSortBy === null}
                options={SORT_ORDER_OPTIONS}
                value={selectedOrderBy}
                onValueChange={onSortOrderSelect}
                className={cn(
                  'w-full min-w-45',
                  selectedSortBy !== null && 'lg:border-primary',
                )}
              />
            </FieldContent>
          </div>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
