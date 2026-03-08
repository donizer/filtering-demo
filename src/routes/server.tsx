import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useDebounceCallback } from 'usehooks-ts'
import { z } from 'zod'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
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

import type { UserRecord } from '#/data/db-utils'
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'

const searchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().optional(),
  status: z.enum(['active', 'inactive', 'all']).default('all'),
})

const fetchUsersPaginated = createServerFn({ method: 'GET' })
  .inputValidator(searchSchema)
  .handler(async ({ data }) => {
    const { queryUsers } = await import('#/data/db-utils')
    return queryUsers(data)
  })

function usersQueryOptions(params: z.infer<typeof searchSchema>) {
  return {
    queryKey: ['users', params] as const,
    queryFn: () => fetchUsersPaginated({ data: params }),
  }
}

export const Route = createFileRoute('/server')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps, context }) => {
    await context.queryClient.prefetchQuery(usersQueryOptions(deps))
  },
  component: ServerTablePage,
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
    accessorKey: 'status',
    header: 'Status',
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

  const dataQuery = useQuery({
    ...usersQueryOptions(search),
    placeholderData: keepPreviousData,
  })
  const data = dataQuery.data

  const [searchInput, setSearchInput] = React.useState(search.search ?? '')

  React.useEffect(() => {
    setSearchInput(search.search ?? '')
  }, [search.search])

  // Prefetch adjacent pages
  React.useEffect(() => {
    if (!dataQuery.data) return

    if (search.page < dataQuery.data.pageCount) {
      queryClient.prefetchQuery(
        usersQueryOptions({ ...search, page: search.page + 1 }),
      )
    }
    if (search.page > 1) {
      queryClient.prefetchQuery(
        usersQueryOptions({ ...search, page: search.page - 1 }),
      )
    }
  }, [search, dataQuery.data, queryClient])

  const debouncedSetSearch = useDebounceCallback((value: string) => {
    navigate({
      replace: true,
      search: (prev) => ({
        ...prev,
        search: value.trim() ? value : undefined,
        page: 1,
      }),
    })
  }, 450)

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualFiltering: true,
    manualPagination: true,
    pageCount: data?.pageCount ?? 0,
    state: {
      pagination: {
        pageIndex: search.page - 1,
        pageSize: search.pageSize,
      },
    },
  })

  const onStatusChange = (value: 'all' | 'active' | 'inactive') => {
    navigate({
      search: (prev) => ({
        ...prev,
        status: value,
        page: 1,
      }),
    })
  }

  const onPageSizeChange = (value: string) => {
    const pageSize = Number(value)

    navigate({
      search: (prev) => ({
        ...prev,
        pageSize,
        page: 1,
      }),
    })
  }

  const currentPage = search.page

  if (!data) return null

  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <h1 className="display-title text-3xl font-semibold">
          Server-side filtering
        </h1>
        <p className="text-sm text-(--sea-ink-soft)">
          URL керує пошуком, фільтрами та пагінацією. Сервер повертає тільки
          потрібну сторінку даних.
        </p>
      </header>

      <div className="island-shell rounded-xl p-4 md:p-5">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-col gap-3 md:max-w-xl md:flex-row">
            <Input
              value={searchInput}
              onChange={(event) => {
                const value = event.target.value
                setSearchInput(value)
                debouncedSetSearch(value)
              }}
              placeholder="Search by name, role or status..."
              className="bg-white/80"
            />

            <Select value={search.status} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full bg-white/80 md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-(--sea-ink-soft)">
            Showing {data.items.length} of {data.totalCount}
          </p>
        </div>

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

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() =>
                navigate({
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
