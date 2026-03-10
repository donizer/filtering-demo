import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'
import { createFileRoute } from '@tanstack/react-router'

import { UserFiltersPanel } from '#/components/user-filters-panel'
import { Button } from '#/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
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
import { EMPTY_USER_FILTERS } from '#/data/user-model'
import type { UserFilters, UserRecord } from '#/data/user-model'

export const Route = createFileRoute('/advanced-filtering/client')({
  loader: () => fetchAllUsers(),
  component: ClientTablePage,
})

function ClientTablePage() {
  const users = Route.useLoaderData()
  const [filters, setFilters] = React.useState<UserFilters>(EMPTY_USER_FILTERS)
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = React.useState<SortingState>([])
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
    onPaginationChange: setPagination,
    onSortingChange: (updater) => {
      setSorting(updater)
      resetToFirstPage()
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const resetToFirstPage = React.useCallback(() => {
    setPagination((current) =>
      current.pageIndex === 0 ? current : { ...current, pageIndex: 0 },
    )
  }, [])

  const updateFilters = React.useCallback(
    (updater: (current: UserFilters) => UserFilters) => {
      React.startTransition(() => {
        setFilters((current) => updater(current))
        resetToFirstPage()
      })
    },
    [resetToFirstPage],
  )

  const updateTextFilter = (key: keyof UserFilters, value: string) => {
    updateFilters((current) => ({ ...current, [key]: value }))
  }

  const updateStatusFilter = (value: UserFilters['status']) => {
    updateFilters((current) => ({ ...current, status: value }))
  }

  const toggleArrayFilter = (
    key: 'roles' | 'departments' | 'countries',
    value: string,
  ) => {
    updateFilters((current) => {
      switch (key) {
        case 'roles': {
          const nextValues = current.roles.includes(value as UserRecord['role'])
            ? current.roles.filter((item) => item !== value)
            : [...current.roles, value as UserRecord['role']]

          return {
            ...current,
            roles: nextValues,
          }
        }
        case 'departments': {
          const nextValues = current.departments.includes(
            value as UserRecord['department'],
          )
            ? current.departments.filter((item) => item !== value)
            : [...current.departments, value as UserRecord['department']]

          return {
            ...current,
            departments: nextValues,
          }
        }
        case 'countries': {
          const nextValues = current.countries.includes(
            value as UserRecord['country'],
          )
            ? current.countries.filter((item) => item !== value)
            : [...current.countries, value as UserRecord['country']]

          return {
            ...current,
            countries: nextValues,
          }
        }
      }
    })
  }

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h2 className="display-title text-2xl font-semibold md:text-3xl">
          Client-side filtering
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
          modeLabel="Client-side predicates"
          onTextChange={updateTextFilter}
          onStatusChange={updateStatusFilter}
          onToggleArrayValue={toggleArrayFilter}
          onReset={() => {
            React.startTransition(() => {
              setFilters(EMPTY_USER_FILTERS)
              setPagination((current) =>
                current.pageIndex === 0
                  ? current
                  : { ...current, pageIndex: 0 },
              )
            })
          }}
        />

        <div className="mt-5 overflow-x-auto rounded-xl border border-(--line) bg-white/65">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
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
                    No users found.
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

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </span>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-24 bg-white/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  )
}
