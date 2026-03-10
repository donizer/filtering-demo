import * as React from 'react'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'
import { createFileRoute } from '@tanstack/react-router'

import { UserRecordsPresentation } from '#/components/user-records-presentation'
import { userTableColumns } from '#/components/user-table-columns'
import { fetchAllUsers } from '#/data/user-demo-server'

export const Route = createFileRoute('/advanced-table-patterns/responsive')({
  loader: () => fetchAllUsers(),
  component: ResponsiveTablePage,
})

function ResponsiveTablePage() {
  const users = Route.useLoaderData()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const table = useReactTable({
    data: users,
    columns: userTableColumns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <h2 className="display-title text-2xl font-semibold md:text-3xl">
          Mobile layout without horizontal scroll
        </h2>
        <p className="max-w-3xl text-sm text-(--sea-ink-soft)">
          Desktop keeps the dense table. Smaller screens switch to prioritised
          cards with the same data, so the page stays readable without forcing
          sideways scrolling.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <PrincipleCard
          title="Prioritise fields"
          body="Name, role, status, salary, and joined date stay visible on small screens."
        />
        <PrincipleCard
          title="Change the container"
          body="A card stack is often a better mobile table than an overflow container."
        />
        <PrincipleCard
          title="Keep desktop dense"
          body="Large screens still get the full table with sticky headers for scanning."
        />
      </div>

      <UserRecordsPresentation
        table={table}
        colSpan={userTableColumns.length}
        stickyHeader
        pager={{
          page: table.getState().pagination.pageIndex + 1,
          pageCount: table.getPageCount(),
          pageSize: table.getState().pagination.pageSize,
          canPreviousPage: table.getCanPreviousPage(),
          canNextPage: table.getCanNextPage(),
          onPreviousPage: () => table.previousPage(),
          onNextPage: () => table.nextPage(),
          onPageSizeChange: (value) => table.setPageSize(Number(value)),
        }}
      />
    </div>
  )
}

function PrincipleCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="feature-card rounded-2xl border border-(--line) p-5">
      <h3 className="text-base font-semibold text-(--sea-ink)">{title}</h3>
      <p className="mt-2 text-sm text-(--sea-ink-soft)">{body}</p>
    </article>
  )
}
