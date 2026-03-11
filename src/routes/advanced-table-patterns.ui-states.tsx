import * as React from 'react'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { SortingState } from '@tanstack/react-table'
import { createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { UserRecordsPresentation } from '#/components/user-records-presentation'
import { userTableColumns } from '#/components/user-table-columns'
import { fetchAllUsers } from '#/data/user-demo-server'

type TableScenario = 'ready' | 'loading' | 'empty' | 'error'

const scenarioLabels: Record<TableScenario, string> = {
  ready: 'Готово',
  loading: 'Завантаження',
  empty: 'Порожньо',
  error: 'Помилка',
}

export const Route = createFileRoute('/advanced-table-patterns/ui-states')({
  loader: () => fetchAllUsers(),
  component: TableUiStatesPage,
})

function TableUiStatesPage() {
  const users = Route.useLoaderData()
  const [scenario, setScenario] = React.useState<TableScenario>('ready')
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  })

  const data = scenario === 'empty' ? [] : users

  React.useEffect(() => {
    const maxPageIndex =
      data.length === 0 ? 0 : Math.ceil(data.length / pagination.pageSize) - 1

    if (pagination.pageIndex > maxPageIndex) {
      setPagination((current) =>
        current.pageIndex === maxPageIndex
          ? current
          : {
              ...current,
              pageIndex: maxPageIndex,
            },
      )
    }
  }, [data.length, pagination.pageIndex, pagination.pageSize])

  const table = useReactTable({
    data,
    columns: userTableColumns,
    autoResetPageIndex: false,
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
          UI-стани для таблиць
        </h2>
        <p className="max-w-3xl text-sm text-(--sea-ink-soft)">
          Якісна таблиця це більше, ніж таблиця з даними. Ці стани винесені
          окремо, щоб на лекції можна було обговорювати їх напряму, а не лише як
          побічні ефекти.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {(['ready', 'loading', 'empty', 'error'] as TableScenario[]).map(
          (item) => (
            <Button
              key={item}
              variant={scenario === item ? 'default' : 'outline'}
              onClick={() => setScenario(item)}
            >
              {scenarioLabels[item]}
            </Button>
          ),
        )}
      </div>

      <UserRecordsPresentation
        table={table}
        colSpan={userTableColumns.length}
        loading={scenario === 'loading'}
        errorMessage={
          scenario === 'error'
            ? 'Симульований таймаут API. Використайте цей стан, щоб пояснити сценарії повтору та тексти, які формують довіру.'
            : undefined
        }
        emptyTitle="Для цього сценарію немає рядків"
        emptyDescription="Порожній стан тут окремий навчальний приклад, а не лише побічний ефект фільтрації."
        onRetry={() => setScenario('ready')}
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
