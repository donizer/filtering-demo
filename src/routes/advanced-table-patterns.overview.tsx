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

export const Route = createFileRoute('/advanced-table-patterns/overview')({
  loader: () => fetchAllUsers(),
  component: TableOverviewPage,
})

function TableOverviewPage() {
  const users = Route.useLoaderData()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
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
          Огляд TanStack Table
        </h2>
        <p className="max-w-3xl text-sm text-(--sea-ink-soft)">
          Це мінімальна корисна конфігурація таблиці для курсу: один датасет,
          одна модель колонок, локальний стан сортування та локальний стан
          пагінації. Вона навмисно проста, бо так легше пояснювати подальші
          розширення.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Рядків у датасеті" value={String(users.length)} />
        <MetricCard
          label="Видимі колонки"
          value={String(userTableColumns.length)}
        />
        <MetricCard label="Логіка фільтрації" value="Не входить" />
      </div>

      <UserRecordsPresentation
        table={table}
        colSpan={userTableColumns.length}
        pager={{
          page: table.getState().pagination.pageIndex + 1,
          pageCount: table.getPageCount(),
          pageSize: table.getState().pagination.pageSize,
          canPreviousPage: table.getCanPreviousPage(),
          canNextPage: table.getCanNextPage(),
          onPreviousPage: () => table.previousPage(),
          onNextPage: () => table.nextPage(),
          onPageChange: (page) => table.setPageIndex(page - 1),
          onPageSizeChange: (value) => table.setPageSize(Number(value)),
        }}
      />
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="feature-card rounded-2xl border border-(--line) p-5">
      <p className="island-kicker">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-(--sea-ink)">{value}</p>
    </article>
  )
}
