import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'

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
import { getActiveFilterCount } from '#/data/user-filters'
import { usersQueryOptions } from '#/data/user-demo-server'
import { EMPTY_USER_FILTERS, usersQuerySchema } from '#/data/user-model'
import type { UserFilters, UserRecord, UsersQuery } from '#/data/user-model'
import {
  buildDraftUsersQuery,
  buildEmptyUsersSearch,
  buildUsersSearchUpdate,
  getUserFiltersFromQuery,
  getUserSortingFromQuery,
} from '#/data/user-query-state'

function areFiltersEqual(left: UserFilters, right: UserFilters) {
  return (
    left.global === right.global &&
    left.id === right.id &&
    left.name === right.name &&
    left.status === right.status &&
    left.ageMin === right.ageMin &&
    left.ageMax === right.ageMax &&
    left.salaryMin === right.salaryMin &&
    left.salaryMax === right.salaryMax &&
    left.joinedFrom === right.joinedFrom &&
    left.joinedTo === right.joinedTo &&
    left.roles.length === right.roles.length &&
    left.roles.every((value, index) => value === right.roles[index]) &&
    left.departments.length === right.departments.length &&
    left.departments.every(
      (value, index) => value === right.departments[index],
    ) &&
    left.countries.length === right.countries.length &&
    left.countries.every((value, index) => value === right.countries[index])
  )
}

export const Route = createFileRoute('/advanced-filtering/server')({
  validateSearch: usersQuerySchema,
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
      const nextSort = nextSorting[0]
      const sortBy = nextSort ? (nextSort.id as UsersQuery['sortBy']) : ''
      const sortDir = nextSort?.desc ? 'desc' : 'asc'

      navigate({
        resetScroll: false,
        search: buildUsersSearchUpdate(search, {
          sortBy,
          sortDir,
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
  const isApplyPending = !areFiltersEqual(draftFilters, appliedFilters)

  if (!data) return null

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h2 className="display-title text-2xl font-semibold md:text-3xl">
          Server-side filtering
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
          modeLabel="Server-side query state"
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
              onClick={() =>
                navigate({
                  resetScroll: false,
                  search: buildUsersSearchUpdate(search, {
                    page: Math.max(1, search.page - 1),
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
                  search: buildUsersSearchUpdate(search, {
                    page: Math.min(data.pageCount, search.page + 1),
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
