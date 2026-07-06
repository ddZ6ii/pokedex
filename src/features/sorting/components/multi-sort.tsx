import { PlusIcon, TrashIcon } from 'lucide-react'
import {
  createContext,
  Fragment,
  use,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useLayoutEffect,
} from 'react'

import {
  SORT_ORDER_OPTIONS,
  type SortingOrder,
} from '@/features/sorting/schemas/sorting.schema'
import { nth } from '@/shared/utilities/nth'
import { WithTooltip } from '@/shared/components'
import { Button } from '@/shared/components/ui/button'
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/shared/components/ui/field'
import { Select } from '@/shared/components/select'
import { cn } from '@/shared/lib/utils'
import type { SelectOption } from '@/shared/types'

type MultiSortContextValue<T extends string> = {
  criteria: [T | null, SortingOrder | null][]
  sortOptions: readonly SelectOption<T>[]
}

type SortItemContextValue<T extends string> = {
  index: number
  options: NonNullable<SelectOption<T>>[]
  selectedSortBy: T | null
  selectedSortOrder: SortingOrder | null
}

const MultiSortContext = createContext<MultiSortContextValue<string> | null>(
  null,
)

const MultiSortActionsContext = createContext<{
  addCriteria: () => void
  selectSortBy: (value: string | null, index: number) => void
  selectOrderBy: (value: SortingOrder, index: number) => void
  removeCriteria: (index: number) => void
} | null>(null)

const SortItemContext = createContext<SortItemContextValue<string> | null>(null)

const useMultiSortContext = <T extends string>() => {
  const ctx = use(MultiSortContext)
  if (!ctx) throw new Error('MultiSortContext was used outside of its provider')
  return ctx as MultiSortContextValue<T>
}
const useMultiSortActionsContext = () => {
  const ctx = use(MultiSortActionsContext)
  if (!ctx)
    throw new Error('MultiSortActionsContext was used outside of its provider')
  return ctx
}
const useSortItemContext = <T extends string>() => {
  const ctx = use(SortItemContext)
  if (!ctx) throw new Error('SortItemContext was used outside of its provider')
  return ctx as SortItemContextValue<T>
}

type Criterion<T extends string> = [T | null, SortingOrder | null]
type SetCriteria<T extends string> =
  Criterion<T>[] | ((prev: Criterion<T>[]) => Criterion<T>[])

type BaseProps<T extends string> = React.PropsWithChildren & {
  sortOptions: readonly SelectOption<T>[]
}
type UncontrolledProps<T extends string> = BaseProps<T> & {
  onChange?: (criteria: Criterion<T>[]) => void
  criteria?: never
  setCriteria?: never
}
type ControlledProps<T extends string> = BaseProps<T> & {
  onChange?: never
  criteria: Criterion<T>[]
  setCriteria: (value: SetCriteria<T>) => void
}
type MultiSortProps<T extends string> =
  UncontrolledProps<T> | ControlledProps<T>

function MultiSort<T extends string>({
  children,
  sortOptions,
  ...props
}: MultiSortProps<T>) {
  const [_criteria, _setCriteria] = useState<Criterion<T>[]>(
    props.criteria ?? [[null, null]],
  )

  const isControlled = props.criteria !== undefined

  const criteria = isControlled ? props.criteria : _criteria
  const setCriteria = isControlled ? props.setCriteria : _setCriteria

  const isMounted = useRef(false)
  const onChangeRef = useRef(props.onChange)

  // Keep the latest onChange callback in the ref up to date.
  // useLayoutEffect avoids potential race conditions with the
  // other useEffect: onChangeRef must be updated before the effect
  // that calls it runs.
  useLayoutEffect(() => {
    onChangeRef.current = props.onChange
  }, [props.onChange])

  // Keep the latest onChange callback in the ref and call it in a separate effect to avoid calling it during render or before the component is mounted.
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
      return
    }
    if (!isControlled) {
      onChangeRef.current?.(criteria)
    }
  }, [isControlled, criteria])

  const selectSortBy = useCallback(
    (value: string | null, index: number) => {
      setCriteria((prev) => {
        // Remove row when clearing selection on a non-last row
        if (!value && index > 0) {
          return prev.filter((_, i) => i !== index)
        }
        const current = nth(prev, index)
        return prev.map((criteria, i) => {
          if (i !== index) return criteria
          // Reset row when clearing selection
          if (!value) return [null, null]
          // Add new criteria when filling an empty row
          if (current[0] === null)
            return [value as T | null, 'asc'] as Criterion<T>
          // Update existing row
          return [value as T | null, current[1]] as Criterion<T>
        })
      })
    },
    [setCriteria],
  )
  const selectOrderBy = useCallback(
    (value: SortingOrder, index: number) => {
      setCriteria((prev) =>
        prev.map((criteria, i) =>
          i === index ? ([criteria[0], value] as Criterion<T>) : criteria,
        ),
      )
    },
    [setCriteria],
  )
  const addCriteria = useCallback(() => {
    setCriteria((prev) => [...prev, [null, null]])
  }, [setCriteria])
  const removeCriteria = useCallback(
    (index: number) => {
      setCriteria((prev) => prev.filter((_, i) => i !== index))
    },
    [setCriteria],
  )

  const context = useMemo(
    () => ({
      sortOptions,
      criteria,
    }),
    [criteria, sortOptions],
  )
  const actionsContext = useMemo(
    () => ({
      addCriteria,
      removeCriteria,
      selectOrderBy,
      selectSortBy,
    }),
    [addCriteria, removeCriteria, selectOrderBy, selectSortBy],
  )

  return (
    <MultiSortContext value={context}>
      <MultiSortActionsContext value={actionsContext}>
        {children}
      </MultiSortActionsContext>
    </MultiSortContext>
  )
}

function MultiSortAddTrigger({
  children,
  className,
}: React.PropsWithChildren & { className?: string }) {
  const { criteria, sortOptions } = useMultiSortContext()
  const { addCriteria } = useMultiSortActionsContext()

  const isFull = criteria.length === sortOptions.length
  const hasEmptyCriteria = criteria.some(([sortBy]) => sortBy === null)
  const tooltip = isFull
    ? 'Maximum number of sorting criteria reached'
    : hasEmptyCriteria
      ? 'Please fill out the existing empty criteria before adding a new one'
      : undefined

  return (
    <WithTooltip tooltip={tooltip} className="mx-auto block">
      <Button
        aria-label="Add new criteria"
        disabled={isFull || hasEmptyCriteria}
        variant="outline"
        size={children ? 'default' : 'icon-md'}
        onClick={() => {
          addCriteria()
        }}
        className={cn(
          'mx-auto mt-8 w-fit',
          children && 'flex items-center gap-2',
          className,
        )}
      >
        <PlusIcon size={16} aria-hidden={true} />
        {children}
      </Button>
    </WithTooltip>
  )
}

function MultiSortList({
  className,
  children,
}: React.PropsWithChildren & {
  className?: string
}) {
  const { criteria, sortOptions } = useMultiSortContext()

  const takenOptions = criteria.map(([sortBy]) => sortBy)

  return (
    <FieldSet className={className}>
      <FieldGroup className="gap-6">
        {criteria.map(([selectedSortBy, selectedSortOrder], index) => {
          const availableOptions = sortOptions.filter(
            (option) =>
              !takenOptions.includes(option.value) ||
              option.value === selectedSortBy,
          )
          return (
            <Fragment key={selectedSortBy ?? `__empty__-${String(index)}`}>
              <SortItemContext
                value={{
                  index,
                  options: availableOptions,
                  selectedSortBy,
                  selectedSortOrder,
                }}
              >
                {children}
              </SortItemContext>
            </Fragment>
          )
        })}
      </FieldGroup>
    </FieldSet>
  )
}

function MultiSortItem({
  className,
  children,
}: React.PropsWithChildren & {
  className?: string
}) {
  const { removeCriteria } = useMultiSortActionsContext()
  const { index } = useSortItemContext()

  return (
    <Field orientation="responsive" className={cn('gap-y-2', className)}>
      {children}

      <WithTooltip tooltip="Remove criteria" className="self-end">
        <Button
          aria-label="Remove criteria"
          variant="destructive"
          size="icon-md"
          className={cn(
            index > 0
              ? 'mx-auto mt-2 flex items-center gap-2 self-end'
              : 'hidden @md/field-group:invisible @md/field-group:block',
          )}
          onClick={() => {
            removeCriteria(index)
          }}
        >
          <TrashIcon aria-hidden={true} size={16} />
        </Button>
      </WithTooltip>
    </Field>
  )
}

function MultiSortBySelect({ className }: { className?: string }) {
  const { selectSortBy } = useMultiSortActionsContext()
  const { index, options, selectedSortBy } = useSortItemContext()

  const id = `sort-by-select-${String(index)}`

  return (
    <FieldContent className={cn('@md/field-group:flex-2', className)}>
      <FieldLabel htmlFor={id} className="whitespace-nowrap">
        Sort by:
      </FieldLabel>

      <Select
        clearable
        id={id}
        aria-label="Select sorting criteria"
        placeholder="Select sorting criteria..."
        options={options}
        value={selectedSortBy}
        onValueChange={(nextValue) => {
          selectSortBy(nextValue, index)
        }}
        className={cn(
          'w-full flex-1',
          selectedSortBy !== null && 'lg:border-primary',
        )}
      />
    </FieldContent>
  )
}

function MultiSortOrderSelect({ className }: { className?: string }) {
  const { selectOrderBy } = useMultiSortActionsContext()
  const { index, selectedSortBy, selectedSortOrder } = useSortItemContext()

  const id = `order-by-select-${String(index)}`

  return (
    <FieldContent className={cn('@md/field-group:flex-1', className)}>
      <FieldLabel htmlFor={id} className="whitespace-nowrap">
        Order by:
      </FieldLabel>

      <Select
        id={id}
        aria-label="Select sorting order"
        placeholder="Select sorting order..."
        disabled={selectedSortBy === null}
        options={SORT_ORDER_OPTIONS}
        value={selectedSortOrder}
        onValueChange={(nextOrderBy) => {
          selectOrderBy(nextOrderBy, index)
        }}
        className={cn(
          'w-full min-w-45',
          selectedSortBy !== null && 'lg:border-primary',
        )}
      />
    </FieldContent>
  )
}

export {
  MultiSort,
  MultiSortAddTrigger,
  MultiSortList,
  MultiSortItem,
  MultiSortBySelect,
  MultiSortOrderSelect,
}
