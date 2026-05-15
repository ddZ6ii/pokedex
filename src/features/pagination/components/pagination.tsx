import { useQueryClient } from '@tanstack/react-query'

import { getPages } from '@/features/pagination/utilities'
import { createPokemonsQueryOptions } from '@/features/pokemons/api'
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'
import { useFiltersActions, useQueryParams } from '@/shared/store'

export function Pagination({
  className,
  disabled,
  maxDisplayedPages = 7,
  maxPage,
  startTransition,
}: {
  className?: string
  disabled?: boolean
  maxDisplayedPages?: number
  maxPage: number
  startTransition: React.TransitionStartFunction
}) {
  const queryClient = useQueryClient()
  const { page, ...queryParmas } = useQueryParams()
  const { setPage } = useFiltersActions()

  const handlePageChange = (nextPage: number) => {
    if (nextPage >= 1 && nextPage <= maxPage) {
      // If this update suspends, don't hide the already displayed content
      startTransition(() => {
        setPage(nextPage)
      })
    }
  }
  const handlePageHover = async (nextPage: number) => {
    await queryClient.prefetchQuery(
      createPokemonsQueryOptions({
        page: nextPage,
        ...queryParmas,
      }),
    )
  }

  const pages = getPages(page, maxDisplayedPages, maxPage)

  return (
    <div className={className}>
      <UIPagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={page <= 1 || disabled}
              onClick={() => {
                handlePageChange(page - 1)
              }}
              onMouseEnter={() => {
                if (page > 1) {
                  void handlePageHover(page - 1)
                }
              }}
            />
          </PaginationItem>

          {pages.map((pageNumber, i) =>
            isNaN(pageNumber) ? (
              <PaginationItem key={`ellipsis-${String(i)}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  disabled={(disabled ?? false) || pageNumber > maxPage}
                  isActive={page === pageNumber}
                  onClick={() => {
                    handlePageChange(pageNumber)
                  }}
                  onMouseEnter={() => {
                    if (pageNumber !== page) {
                      void handlePageHover(pageNumber)
                    }
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              disabled={page >= maxPage || disabled}
              onClick={() => {
                handlePageChange(page + 1)
              }}
              onMouseEnter={() => {
                if (page < maxPage) {
                  void handlePageHover(page + 1)
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </UIPagination>
    </div>
  )
}
