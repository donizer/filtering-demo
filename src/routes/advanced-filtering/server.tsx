import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from '@tanstack/react-router'
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'

import { TablePaginationBar } from '#/components/table-pagination'
import { UserFiltersPanel } from '#/components/user-filters-panel'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import { userTableColumns } from '#/components/user-table-columns'
import { getActiveFilterCount } from '#/data/user-filters'
import { usersQueryOptions } from '#/data/user-demo-server'
import { EMPTY_USER_FILTERS, usersQuerySchema } from '#/data/user-model'
import type { UserFilters } from '#/data/user-model'
import {
  areUserFiltersEqual,
  getUserSortFromState,
  toggleUserArrayFilter,
  updateUserStatusFilter,
  updateUserTextFilter,
  type UserArrayFilterKey,
  type UserTextFilterKey,
} from '#/data/user-filter-state'
import {
  buildDraftUsersQuery,
  buildEmptyUsersSearch,
  buildUsersSearchUpdate,
  getUserFiltersFromQuery,
  getUserSortingFromQuery,
} from '#/data/user-query-state'

export const Route = createFileRoute('/advanced-filtering/server')({
  validateSearch: usersQuerySchema,
  search: {
    middlewares: [stripSearchParams(usersQuerySchema.parse({}))],
  },
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    await context.queryClient.prefetchQuery(usersQueryOptions(deps))
  },
  component: ServerTablePage,
})

function ServerTablePage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const queryClient = useQueryClient()
  const sorting = React.useMemo(() => getUserSortingFromQuery(search), [search])
  const [draftFilters, setDraftFilters] = React.useState<UserFilters>(
    getUserFiltersFromQuery(search),
  )

  const dataQuery = useQuery({
    ...usersQueryOptions(search),
    placeholderData: keepPreviousData,
  })
  const data = dataQuery.data
  const draftPreviewQuery = React.useMemo(
    () => buildDraftUsersQuery(search, draftFilters),
    [search, draftFilters],
  )
  const draftPreviewData = useQuery({
    ...usersQueryOptions(draftPreviewQuery),
    placeholderData: keepPreviousData,
  }).data

  React.useEffect(() => {
    setDraftFilters(getUserFiltersFromQuery(search))
  }, [search])

  React.useEffect(() => {
    if (!dataQuery.data) return

    if (dataQuery.data.page < dataQuery.data.pageCount) {
      queryClient.prefetchQuery(
        usersQueryOptions({ ...search, page: dataQuery.data.page + 1 }),
      )
    }
    if (dataQuery.data.page > 1) {
      queryClient.prefetchQuery(
        usersQueryOptions({ ...search, page: dataQuery.data.page - 1 }),
      )
    }
  }, [search, dataQuery.data, queryClient])

  React.useEffect(() => {
    if (!data) {
      return
    }

    if (data.page !== search.page) {
      navigate({
        replace: true,
        resetScroll: false,
        search: buildUsersSearchUpdate(search, {
          page: data.page,
        }),
      })
    }
  }, [data, navigate, search.page])

  const updateTextFilter = (key: UserTextFilterKey, value: string) => {
    setDraftFilters((current) => updateUserTextFilter(current, key, value))
  }

  const updateStatusFilter = (value: UserFilters['status']) => {
    setDraftFilters((current) => updateUserStatusFilter(current, value))
  }

  const toggleArrayFilter = (key: UserArrayFilterKey, value: string) => {
    setDraftFilters((current) =>
      toggleUserArrayFilter(current, key, value as never),
    )
  }

  const applyFilters = () => {
    navigate({
      replace: true,
      resetScroll: false,
      search: buildUsersSearchUpdate(search, {
        ...draftFilters,
        page: 1,
      }),
    })
  }

  const table = useReactTable({
    data: data?.items ?? [],
    columns: userTableColumns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onSortingChange: (updater) => {
      const nextSorting =
        typeof updater === 'function' ? updater(sorting) : updater
      const nextSort = getUserSortFromState(nextSorting)

      navigate({
        resetScroll: false,
        search: buildUsersSearchUpdate(search, {
          ...nextSort,
          page: 1,
        }),
      })
    },
    pageCount: data?.pageCount ?? 0,
    state: {
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.pageSize,
      },
      sorting,
    },
  })

  const onPageSizeChange = (value: string) => {
    const pageSize = Number(value)

    navigate({
      resetScroll: false,
      search: buildUsersSearchUpdate(search, {
        pageSize,
        page: 1,
      }),
    })
  }

  const currentPage = data?.page ?? search.page
  const previewData = draftPreviewData ?? data
  const appliedFilters = React.useMemo(
    () => getUserFiltersFromQuery(search),
    [search],
  )
  const activeFilterCount = getActiveFilterCount(draftFilters)
  const isApplyPending = !areUserFiltersEqual(draftFilters, appliedFilters)

  if (!data) return null

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h2 className="display-title text-2xl font-semibold md:text-3xl">
          Серверна фільтрація
        </h2>
        <p className="text-sm text-(--sea-ink-soft)">
          URL керує фільтрами та пагінацією. Сервер застосовує ті самі
          предикати, що і клієнтський демо-режим, але повертає тільки потрібну
          сторінку даних.
        </p>
      </header>

      <div className="island-shell rounded-xl p-4 md:p-5">
        <UserFiltersPanel
          filters={draftFilters}
          facets={previewData?.facets ?? data.facets}
          activeFilterCount={activeFilterCount}
          resultCount={previewData?.totalCount ?? data.totalCount}
          totalCount={previewData?.datasetCount ?? data.datasetCount}
          modeLabel="Серверний стан запиту"
          isApplyPending={isApplyPending}
          onTextChange={updateTextFilter}
          onStatusChange={updateStatusFilter}
          onToggleArrayValue={toggleArrayFilter}
          onReset={() => {
            setDraftFilters(EMPTY_USER_FILTERS)
            navigate({
              replace: true,
              resetScroll: false,
              search: buildEmptyUsersSearch(),
            })
          }}
          onApply={applyFilters}
        />

        <div className="mt-5 rounded-xl border border-(--line) bg-white/65">
          <Table containerClassName="max-h-128 overflow-auto">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="sticky top-0 z-10 bg-(--header-bg) backdrop-blur-md shadow-[inset_0_-1px_0_var(--sticky-divider)]"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={userTableColumns.length}
                    className="h-20 text-center"
                  >
                    Користувачів не знайдено.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <TablePaginationBar
          className="mt-4"
          page={currentPage}
          pageCount={data.pageCount}
          pageSize={search.pageSize}
          canPreviousPage={currentPage > 1}
          canNextPage={currentPage < data.pageCount}
          onPreviousPage={() =>
            navigate({
              resetScroll: false,
              search: buildUsersSearchUpdate(search, {
                page: Math.max(1, currentPage - 1),
              }),
            })
          }
          onNextPage={() =>
            navigate({
              resetScroll: false,
              search: buildUsersSearchUpdate(search, {
                page: Math.min(data.pageCount, currentPage + 1),
              }),
            })
          }
          onPageChange={(page) =>
            navigate({
              resetScroll: false,
              search: buildUsersSearchUpdate(search, {
                page,
              }),
            })
          }
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[10, 20, 30]}
        />
      </div>
    </section>
  )
}
