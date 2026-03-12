import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  createFileRoute,
  stripSearchParams,
  useNavigate,
} from '@tanstack/react-router'

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
import { fetchAllUsers } from '#/data/user-demo-server'
import {
  buildUserFacets,
  filterUsers,
  getActiveFilterCount,
} from '#/data/user-filters'
import type {
  UserArrayFilterKey,
  UserTextFilterKey,
} from '#/data/user-filter-state'
import {
  getUserSortFromState,
  toggleUserArrayFilter,
  updateUserStatusFilter,
  updateUserTextFilter,
} from '#/data/user-filter-state'
import { usersQuerySchema } from '#/data/user-model'
import type { UserFilters } from '#/data/user-model'
import {
  buildEmptyUsersSearch,
  buildUsersSearchUpdate,
  getUserFiltersFromQuery,
  getUserPaginationFromQuery,
  getUserSortingFromQuery,
} from '#/data/user-query-state'

export const Route = createFileRoute('/advanced-filtering/client')({
  validateSearch: usersQuerySchema,
  search: {
    middlewares: [stripSearchParams(usersQuerySchema.parse({}))],
  },
  loader: () => fetchAllUsers(),
  component: ClientTablePage,
})

function ClientTablePage() {
  const users = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const filters = React.useMemo(() => getUserFiltersFromQuery(search), [search])
  const pagination = React.useMemo(
    () => getUserPaginationFromQuery(search),
    [search],
  )
  const sorting = React.useMemo(() => getUserSortingFromQuery(search), [search])
  const deferredFilters = React.useDeferredValue(filters)

  const filteredUsers = React.useMemo(
    () => filterUsers(users, deferredFilters),
    [users, deferredFilters],
  )
  const facets = React.useMemo(
    () => buildUserFacets(users, deferredFilters),
    [users, deferredFilters],
  )
  const activeFilterCount = React.useMemo(
    () => getActiveFilterCount(deferredFilters),
    [deferredFilters],
  )

  const table = useReactTable({
    data: filteredUsers,
    columns: userTableColumns,
    autoResetPageIndex: false,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: (updater) => {
      const nextPagination =
        typeof updater === 'function' ? updater(pagination) : updater

      navigate({
        replace: true,
        resetScroll: false,
        search: buildUsersSearchUpdate(search, {
          page: nextPagination.pageIndex + 1,
          pageSize: nextPagination.pageSize,
        }),
      })
    },
    onSortingChange: (updater) => {
      const nextSorting =
        typeof updater === 'function' ? updater(sorting) : updater
      const nextSort = getUserSortFromState(nextSorting)

      navigate({
        replace: true,
        resetScroll: false,
        search: buildUsersSearchUpdate(search, {
          ...nextSort,
          page: 1,
        }),
      })
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const updateTextFilter = (key: UserTextFilterKey, value: string) => {
    navigate({
      replace: true,
      resetScroll: false,
      search: buildUsersSearchUpdate(search, {
        ...updateUserTextFilter(filters, key, value),
        page: 1,
      }),
    })
  }

  const updateStatusFilter = (value: UserFilters['status']) => {
    navigate({
      replace: true,
      resetScroll: false,
      search: buildUsersSearchUpdate(search, {
        ...updateUserStatusFilter(filters, value),
        page: 1,
      }),
    })
  }

  const toggleArrayFilter = (key: UserArrayFilterKey, value: string) => {
    const nextFilters = toggleUserArrayFilter(filters, key, value as never)

    navigate({
      replace: true,
      resetScroll: false,
      search: buildUsersSearchUpdate(search, {
        ...nextFilters,
        page: 1,
      }),
    })
  }

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h2 className="display-title text-2xl font-semibold md:text-3xl">
          Клієнтська фільтрація
        </h2>
        <p className="text-sm text-(--sea-ink-soft)">
          Дані завантажуються один раз. Далі всі фільтри застосовуються у
          браузері через явні JS-предикати, а fuzzy search працює локально.
        </p>
      </header>

      <div className="island-shell rounded-xl p-4 md:p-5">
        <UserFiltersPanel
          filters={filters}
          facets={facets}
          activeFilterCount={activeFilterCount}
          resultCount={filteredUsers.length}
          totalCount={users.length}
          modeLabel="Клієнтські предикати"
          onTextChange={updateTextFilter}
          onStatusChange={updateStatusFilter}
          onToggleArrayValue={toggleArrayFilter}
          onReset={() => {
            navigate({
              replace: true,
              resetScroll: false,
              search: buildEmptyUsersSearch(),
            })
          }}
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
          page={table.getState().pagination.pageIndex + 1}
          pageCount={table.getPageCount()}
          pageSize={table.getState().pagination.pageSize}
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
          onPreviousPage={() => table.previousPage()}
          onNextPage={() => table.nextPage()}
          onPageChange={(page) => table.setPageIndex(page - 1)}
          onPageSizeChange={(value) => table.setPageSize(Number(value))}
          pageSizeOptions={[10, 20, 30]}
        />
      </div>
    </section>
  )
}
