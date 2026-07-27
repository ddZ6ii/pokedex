import { getRouteApi, Link } from '@tanstack/react-router'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { getPages } from '@/features/pagination/utilities/get-pages'
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'

const routeApi = getRouteApi('/(public)/pokemons')

export function Pagination({
  className,
  maxDisplayedPages = 7,
  maxPage,
}: {
  className?: string
  maxDisplayedPages?: number
  maxPage: number
}) {
  const { page } = routeApi.useSearch()

  const pages = getPages(page, maxDisplayedPages, maxPage)

  return (
    <div className={className}>
      <UIPagination>
        <PaginationContent>
          <PaginationItem>
            {page <= 1 ? (
              <PaginationPrevious disabled />
            ) : (
              <PaginationLink
                asChild
                aria-label="Go to previous page"
                size="default"
                className="pl-1.5!"
              >
                <Link
                  to="/pokemons"
                  search={(prev) => ({ ...prev, page: page - 1 })}
                >
                  <ChevronLeftIcon
                    aria-hidden={true}
                    data-icon="inline-start"
                  />
                  <span className="hidden md:block">Previous</span>
                </Link>
              </PaginationLink>
            )}
          </PaginationItem>

          {pages.map((pageNumber, i) =>
            isNaN(pageNumber) ? (
              <PaginationItem key={`ellipsis-${String(i)}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={pageNumber}>
                <PaginationLink asChild isActive={page === pageNumber}>
                  <Link
                    to="/pokemons"
                    search={(prev) => ({ ...prev, page: pageNumber })}
                  >
                    {pageNumber}
                  </Link>
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            {page >= maxPage ? (
              <PaginationNext disabled />
            ) : (
              <PaginationLink
                asChild
                aria-label="Go to next page"
                size="default"
                className="pr-1.5!"
              >
                <Link
                  to="/pokemons"
                  search={(prev) => ({ ...prev, page: page + 1 })}
                >
                  <span className="hidden md:block">Next</span>
                  <ChevronRightIcon aria-hidden={true} data-icon="inline-end" />
                </Link>
              </PaginationLink>
            )}
          </PaginationItem>
        </PaginationContent>
      </UIPagination>
    </div>
  )
}
