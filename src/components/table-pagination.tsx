import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '#/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { cn } from '#/lib/utils'

type TablePaginationBarProps = {
  page: number
  pageCount: number
  pageSize: number
  canPreviousPage: boolean
  canNextPage: boolean
  onPreviousPage: () => void
  onNextPage: () => void
  onPageChange: (page: number) => void
  onPageSizeChange: (value: string) => void
  pageSizeOptions?: number[]
  maxVisiblePages?: number
  className?: string
}

type PaginationItemModel = number | 'ellipsis'

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 20]

export function TablePaginationBar({
  page,
  pageCount,
  pageSize,
  canPreviousPage,
  canNextPage,
  onPreviousPage,
  onNextPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  maxVisiblePages = 7,
  className,
}: TablePaginationBarProps) {
  if (pageCount <= 0) {
    return null
  }

  const items = buildPaginationItems(page, pageCount, maxVisiblePages)

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-(--line) bg-white/60 px-4 py-3',
        className,
      )}
    >
      <Pagination className="mx-0 w-auto justify-start">
        <PaginationContent className="flex-wrap justify-start">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(event) => {
                event.preventDefault()

                if (canPreviousPage) {
                  onPreviousPage()
                }
              }}
              className={cn(
                !canPreviousPage && 'pointer-events-none opacity-50',
              )}
            >
              Попередня
            </PaginationPrevious>
          </PaginationItem>

          {items.map((item, index) => (
            <PaginationItem key={`${item}-${index}`}>
              {item === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={item === page}
                  onClick={(event) => {
                    event.preventDefault()

                    if (item !== page) {
                      onPageChange(item)
                    }
                  }}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(event) => {
                event.preventDefault()

                if (canNextPage) {
                  onNextPage()
                }
              }}
              className={cn(!canNextPage && 'pointer-events-none opacity-50')}
            >
              Наступна
            </PaginationNext>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="flex items-center gap-2 text-sm text-(--sea-ink-soft)">
        <span>
          Сторінка {page} з {pageCount}
        </span>
        <Select value={String(pageSize)} onValueChange={onPageSizeChange}>
          <SelectTrigger className="w-24 bg-white/80">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function buildPaginationItems(
  page: number,
  pageCount: number,
  maxVisiblePages: number,
): PaginationItemModel[] {
  const safeVisibleCount = Math.max(5, maxVisiblePages)

  if (pageCount <= safeVisibleCount) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  if (safeVisibleCount === 5) {
    if (page <= 3) {
      return [1, 2, 3, 'ellipsis', pageCount]
    }

    if (page >= pageCount - 2) {
      return [1, 'ellipsis', pageCount - 2, pageCount - 1, pageCount]
    }

    return [1, 'ellipsis', page, 'ellipsis', pageCount]
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis', pageCount]
  }

  if (page >= pageCount - 3) {
    return [
      1,
      'ellipsis',
      pageCount - 4,
      pageCount - 3,
      pageCount - 2,
      pageCount - 1,
      pageCount,
    ]
  }

  return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', pageCount]
}
