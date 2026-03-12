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
          Мобільний макет без горизонтального скролу
        </h2>
        <p className="max-w-3xl text-sm text-(--sea-ink-soft)">
          На десктопі лишається щільна таблиця. На менших екранах сторінка
          переходить до пріоритизованих карток із тими самими даними, щоб
          інтерфейс залишався читабельним без бокового скролу.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <PrincipleCard
          title="Пріоритизуйте поля"
          body="Ім’я, роль, статус, зарплата й дата приєднання залишаються видимими на малих екранах."
        />
        <PrincipleCard
          title="Змінюйте контейнер"
          body="Стос карток часто є кращою мобільною таблицею, ніж контейнер з overflow."
        />
        <PrincipleCard
          title="Зберігайте щільність на десктопі"
          body="На великих екранах залишається повна таблиця з липкими заголовками для швидкого сканування."
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
          onPageChange: (page) => table.setPageIndex(page - 1),
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
