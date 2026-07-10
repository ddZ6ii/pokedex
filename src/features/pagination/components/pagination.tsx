import { useQueryClient } from '@tanstack/react-query'

import { getPages } from '@/features/pagination/utilities/get-pages'
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
  maxDisplayedPages = 7,
  maxPage,
}: {
  className?: string
  maxDisplayedPages?: number
  maxPage: number
}) {
  const queryClient = useQueryClient()
  const { page, ...queryParmas } = useQueryParams()
  const { setPage } = useFiltersActions()

  const handlePageChange = (nextPage: number) => {
    if (nextPage >= 1 && nextPage <= maxPage) {
      setPage(nextPage)
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
              disabled={page <= 1}
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
                  disabled={pageNumber > maxPage}
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
              disabled={page >= maxPage}
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
