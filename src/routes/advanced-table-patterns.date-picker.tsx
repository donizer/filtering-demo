import * as React from 'react'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef, SortingState } from '@tanstack/react-table'
import { createFileRoute } from '@tanstack/react-router'

import { UserDateDetailsDrawer } from '#/components/user-date-details-drawer'
import { UserRecordsPresentation } from '#/components/user-records-presentation'
import { Button } from '#/components/ui/button'
import { userTableColumns } from '#/components/user-table-columns'
import { fetchAllUsers } from '#/data/user-demo-server'
import type { UserRecord } from '#/data/user-model'

export const Route = createFileRoute('/advanced-table-patterns/date-picker')({
  loader: () => fetchAllUsers(),
  component: MobileDatePickerPage,
})

function MobileDatePickerPage() {
  const users = Route.useLoaderData()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  })
  const [selectedUserId, setSelectedUserId] = React.useState<number | null>(
    null,
  )
  const [joinedDates, setJoinedDates] = React.useState<Record<number, string>>(
    {},
  )

  const viewModel = React.useMemo(
    () =>
      users.map((user) => ({
        ...user,
        joinedAt: joinedDates[user.id] ?? user.joinedAt,
      })),
    [joinedDates, users],
  )

  const openUser = React.useCallback((user: UserRecord) => {
    setSelectedUserId(user.id)
  }, [])

  const columns = React.useMemo<ColumnDef<UserRecord>[]>(
    () => [
      ...userTableColumns,
      {
        id: 'details',
        header: 'Деталі',
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openUser(row.original)}
          >
            Редагувати рядок
          </Button>
        ),
      },
    ],
    [openUser],
  )

  const table = useReactTable({
    data: viewModel,
    columns,
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

  const selectedUser =
    viewModel.find((user) => user.id === selectedUserId) ?? null

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <h2 className="display-title text-2xl font-semibold md:text-3xl">
          Мобільний вибір дати в деталях рядка
        </h2>
        <p className="max-w-3xl text-sm text-(--sea-ink-soft)">
          Ця сторінка показує вибір дати як частину сценарію деталей рядка. На
          мобільних пристроях він відкривається в drawer, тому touch-цілі та
          взаємодія з календарем лишаються зручними.
        </p>
      </header>

      <UserRecordsPresentation
        table={table}
        colSpan={columns.length}
        renderRowActions={(user) => (
          <Button variant="outline" size="sm" onClick={() => openUser(user)}>
            Редагувати рядок
          </Button>
        )}
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

      <UserDateDetailsDrawer
        user={selectedUser}
        open={selectedUser !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUserId(null)
          }
        }}
        onDateChange={(value) => {
          if (!selectedUser) {
            return
          }

          setJoinedDates((current) => ({
            ...current,
            [selectedUser.id]: value || selectedUser.joinedAt,
          }))
        }}
      />
    </div>
  )
}
