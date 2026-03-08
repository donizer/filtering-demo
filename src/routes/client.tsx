import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

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

import {
  buildUserFacets,
  filterUsers,
  getActiveFilterCount,
} from '#/data/user-filters'
import { EMPTY_USER_FILTERS } from '#/data/user-model'
import type { UserFilters, UserRecord } from '#/data/user-model'

const fetchAllUsers = createServerFn({ method: 'GET' }).handler(async () => {
  const { readDB } = await import('#/data/db-utils')
  return readDB()
})

export const Route = createFileRoute('/client')({
  loader: () => fetchAllUsers(),
  component: ClientTablePage,
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
  dateStyle: 'medium',
})

const columns: ColumnDef<UserRecord>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'department',
    header: 'Department',
  },
  {
    accessorKey: 'country',
    header: 'Country',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    accessorKey: 'salary',
    header: 'Salary',
    cell: ({ row }) => currencyFormatter.format(row.original.salary),
  },
  {
    accessorKey: 'joinedAt',
    header: 'Joined',
    cell: ({ row }) => dateFormatter.format(new Date(row.original.joinedAt)),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <span className="rounded-full border border-(--line) px-2 py-1 text-xs font-semibold capitalize">
        {row.original.status}
      </span>
    ),
  },
]

function ClientTablePage() {
  const users = Route.useLoaderData()
  const [filters, setFilters] = React.useState<UserFilters>(EMPTY_USER_FILTERS)
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
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
    columns,
    autoResetPageIndex: false,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
        <h1 className="display-title text-3xl font-semibold">
          Client-side filtering
        </h1>
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
                    colSpan={columns.length}
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
