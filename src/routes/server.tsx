import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { SortableColumnHeader } from '#/components/sortable-column-header'
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

import { getActiveFilterCount } from '#/data/user-filters'
import { EMPTY_USER_FILTERS, usersQuerySchema } from '#/data/user-model'
import type { UserFilters, UserRecord, UsersQuery } from '#/data/user-model'
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
  dateStyle: 'medium',
})

function getFiltersFromQuery(query: UsersQuery): UserFilters {
  const {
    page: _page,
    pageSize: _pageSize,
    sortBy: _sortBy,
    sortDir: _sortDir,
    ...filters
  } = query
  return filters
}

function getSortingFromQuery(query: UsersQuery): SortingState {
  if (!query.sortBy) {
    return []
  }

  return [{ id: query.sortBy, desc: query.sortDir === 'desc' }]
}

function buildDraftPreviewQuery(
  search: UsersQuery,
  draftFilters: UserFilters,
): UsersQuery {
  return {
    ...search,
    ...draftFilters,
    page: 1,
  }
}

function sortableHeader(label: string) {
  return ({
    column,
  }: {
    column: {
      getIsSorted: () => false | 'asc' | 'desc'
      getToggleSortingHandler: () =>
        | React.MouseEventHandler<HTMLButtonElement>
        | undefined
    }
  }) => (
    <SortableColumnHeader
      label={label}
      sortDirection={column.getIsSorted()}
      onClick={column.getToggleSortingHandler()}
    />
  )
}

const fetchUsersPaginated = createServerFn({ method: 'GET' })
  .inputValidator(usersQuerySchema)
  .handler(async ({ data }) => {
    const { queryUsers } = await import('#/data/db-utils')
    return queryUsers(data)
  })

function usersQueryOptions(params: UsersQuery) {
  return {
    queryKey: ['users', params] as const,
    queryFn: () => fetchUsersPaginated({ data: params }),
  }
}

export const Route = createFileRoute('/server')({
  validateSearch: usersQuerySchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    await context.queryClient.prefetchQuery(usersQueryOptions(deps))
  },
  component: ServerTablePage,
})

const columns: ColumnDef<UserRecord>[] = [
  {
    accessorKey: 'id',
    header: sortableHeader('ID'),
  },
  {
    accessorKey: 'name',
    header: sortableHeader('Name'),
  },
  {
    accessorKey: 'role',
    header: sortableHeader('Role'),
  },
  {
    accessorKey: 'department',
    header: sortableHeader('Department'),
  },
  {
    accessorKey: 'country',
    header: sortableHeader('Country'),
  },
  {
    accessorKey: 'age',
    header: sortableHeader('Age'),
  },
  {
    accessorKey: 'salary',
    header: sortableHeader('Salary'),
    cell: ({ row }) => currencyFormatter.format(row.original.salary),
  },
  {
    accessorKey: 'joinedAt',
    header: sortableHeader('Joined'),
    cell: ({ row }) => dateFormatter.format(new Date(row.original.joinedAt)),
  },
  {
    accessorKey: 'status',
    header: sortableHeader('Status'),
    cell: ({ row }) => (
      <span className="rounded-full border border-(--line) px-2 py-1 text-xs font-semibold capitalize">
        {row.original.status}
      </span>
    ),
  },
]

function ServerTablePage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const queryClient = useQueryClient()
  const sorting = React.useMemo(() => getSortingFromQuery(search), [search])
  const [draftFilters, setDraftFilters] = React.useState<UserFilters>(
    getFiltersFromQuery(search),
  )

  const dataQuery = useQuery({
    ...usersQueryOptions(search),
    placeholderData: keepPreviousData,
  })
  const data = dataQuery.data
  const draftPreviewQuery = React.useMemo(
    () => buildDraftPreviewQuery(search, draftFilters),
    [search, draftFilters],
  )
  const draftPreviewData = useQuery({
    ...usersQueryOptions(draftPreviewQuery),
    placeholderData: keepPreviousData,
  }).data

  React.useEffect(() => {
    setDraftFilters(getFiltersFromQuery(search))
  }, [search])

  // Prefetch adjacent pages
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
        search: (prev) => ({
          ...prev,
          page: data.page,
        }),
      })
    }
  }, [data, navigate, search.page])

  const updateTextFilter = (key: keyof UserFilters, value: string) => {
    setDraftFilters((current) => ({ ...current, [key]: value }))
  }

  const updateStatusFilter = (value: UserFilters['status']) => {
    setDraftFilters((current) => ({ ...current, status: value }))
  }

  const toggleArrayFilter = (
    key: 'roles' | 'departments' | 'countries',
    value: string,
  ) => {
    setDraftFilters((current) => {
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

  const applyFilters = () => {
    navigate({
      replace: true,
      resetScroll: false,
      search: (prev) => ({
        ...prev,
        ...draftFilters,
        page: 1,
      }),
    })
  }

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onSortingChange: (updater) => {
      const nextSorting =
        typeof updater === 'function' ? updater(sorting) : updater
      const nextSort = nextSorting[0]

      navigate({
        resetScroll: false,
        search: (prev) => ({
          ...prev,
          sortBy: (nextSort?.id as UsersQuery['sortBy']) ?? '',
          sortDir: nextSort?.desc ? 'desc' : 'asc',
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
      search: (prev) => ({
        ...prev,
        pageSize,
        page: 1,
      }),
    })
  }

  const currentPage = data?.page ?? search.page
  const previewData = draftPreviewData ?? data
  const activeFilterCount = getActiveFilterCount(draftFilters)

  if (!data) return null

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h1 className="display-title text-3xl font-semibold">
          Server-side filtering
        </h1>
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
          modeLabel="Server-side query state"
          onTextChange={updateTextFilter}
          onStatusChange={updateStatusFilter}
          onToggleArrayValue={toggleArrayFilter}
          onReset={() => {
            setDraftFilters(EMPTY_USER_FILTERS)
            navigate({
              replace: true,
              resetScroll: false,
              search: (prev) => ({
                ...prev,
                ...EMPTY_USER_FILTERS,
                page: 1,
              }),
            })
          }}
          onApply={applyFilters}
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
              onClick={() =>
                navigate({
                  resetScroll: false,
                  search: (prev) => ({
                    ...prev,
                    page: Math.max(1, prev.page - 1),
                  }),
                })
              }
              disabled={currentPage <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                navigate({
                  resetScroll: false,
                  search: (prev) => ({
                    ...prev,
                    page: Math.min(data.pageCount, prev.page + 1),
                  }),
                })
              }
              disabled={currentPage >= data.pageCount}
            >
              Next
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span>
              Page {currentPage} of {data.pageCount}
            </span>
            <Select
              value={String(search.pageSize)}
              onValueChange={onPageSizeChange}
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
