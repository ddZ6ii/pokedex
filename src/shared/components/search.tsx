import { CircleXIcon, SearchIcon, type LucideIcon } from 'lucide-react'
import React, {
  createContext,
  use,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { Label } from '@/shared/components/ui/label'
import { cn } from '@/shared/lib/utils'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/shared/components/ui/input-group'
import { Spinner } from '@/shared/components/ui/spinner'

type SearchUpdater = (value: string | ((prev: string) => string)) => void

type BaseSearchProps = React.PropsWithChildren

type UncontrolledSearchProps = BaseSearchProps & {
  initialSearch?: string
  search?: never
  setSearch?: never
}

type ControlledSearchProps = BaseSearchProps & {
  initialSearch?: never
  search: string
  setSearch: SearchUpdater
}

type SearchProps = UncontrolledSearchProps | ControlledSearchProps

const SearchContext = createContext<{
  search: string
} | null>(null)

const SearchActionsContext = createContext<{
  setSearch: SearchUpdater
} | null>(null)

const useSearchContext = () => {
  const ctx = use(SearchContext)
  if (ctx === null) {
    throw new Error('useSearchContext was used outside of its provider')
  }
  return ctx
}

const useSearchActionsContext = () => {
  const ctx = use(SearchActionsContext)
  if (ctx === null) {
    throw new Error('useSearchActionsContext was used outside of its provider')
  }
  return ctx
}

function Search({ children, ...props }: SearchProps) {
  const [_search, _setSearch] = useState(props.initialSearch ?? '')

  const isControlled = props.search !== undefined
  const wasControlled = useRef(isControlled)
  const search = isControlled ? props.search : _search
  const setSearch = isControlled ? props.setSearch : _setSearch

  useEffect(() => {
    if (import.meta.env.PROD) return
    if (wasControlled.current !== isControlled) {
      console.warn(
        '[Search] Component changed from controlled to uncontrolled or vice versa.',
      )
    }
  }, [isControlled])

  const searchContext = useMemo(() => ({ search }), [search])
  const searchActionsContext = useMemo(() => ({ setSearch }), [setSearch])

  return (
    <SearchContext value={searchContext}>
      <SearchActionsContext value={searchActionsContext}>
        {children}
      </SearchActionsContext>
    </SearchContext>
  )
}

function SearchLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return <Label className={cn('sr-only', className)} {...props} />
}

function SearchInputGroup({
  className,
  ...props
}: React.ComponentProps<typeof InputGroup>) {
  return (
    <InputGroup
      className={cn(
        'has-[[data-slot=input-group-control]:focus-visible]:ring-primary/80',
        className,
      )}
      {...props}
    />
  )
}

function SearchInputIcon({ Icon = SearchIcon }: { Icon?: LucideIcon }) {
  return (
    <InputGroupAddon>
      <Icon aria-hidden="true" />
    </InputGroupAddon>
  )
}

function SearchInput({
  className,
  id,
  onValueChange,
  placeholder = 'Search...',
  ...props
}: Omit<React.ComponentProps<typeof InputGroupInput>, 'value' | 'onChange'> & {
  onValueChange?: (nextValue: string) => void
}) {
  const { search } = useSearchContext()
  const { setSearch } = useSearchActionsContext()

  return (
    <InputGroupInput
      id={id}
      type="search"
      placeholder={placeholder}
      value={search}
      onChange={(e) => {
        const nextValue = e.target.value
        setSearch(nextValue)
        onValueChange?.(nextValue)
      }}
      className={cn(
        '[&::-webkit-search-cancel-button]:appearance-none [type=search]:appearance-none',
        className,
      )}
      {...props}
    />
  )
}

function SearchResults(props: React.ComponentProps<typeof InputGroupAddon>) {
  return <InputGroupAddon align="inline-end" {...props} />
}

function SearchResetTrigger({
  className,
  Icon = CircleXIcon,
  loading,
  dataIcon: _dataIcon, // intentionally blocked — reset trigger should not display an additional icon
  asChild: _asChild, // intentionally blocked — reset trigger must be a button
  onSearchClear,
  ...props
}: Omit<
  React.ComponentProps<typeof InputGroupButton>,
  'onClick' | 'children'
> & {
  Icon?: LucideIcon
  onSearchClear?: () => void
}) {
  const { search } = useSearchContext()
  const { setSearch } = useSearchActionsContext()

  if (search.length === 0) {
    return null
  }

  return (
    <InputGroupAddon align="inline-end" className="size-8">
      <InputGroupButton
        aria-haspopup="false"
        variant={loading ? 'ghost' : 'secondary'}
        className={className}
        onClick={() => {
          setSearch('')
          onSearchClear?.()
        }}
        {...props}
      >
        {loading ? <Spinner /> : <Icon aria-hidden={true} />}
      </InputGroupButton>
    </InputGroupAddon>
  )
}

export {
  Search,
  SearchInput,
  SearchInputGroup,
  SearchInputIcon,
  SearchLabel,
  SearchResetTrigger,
  SearchResults,
}
