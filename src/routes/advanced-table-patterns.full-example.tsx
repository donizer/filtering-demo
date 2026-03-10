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

type ExampleScenario = 'ready' | 'loading' | 'empty' | 'error'

export const Route = createFileRoute('/advanced-table-patterns/full-example')({
  loader: () => fetchAllUsers(),
  component: FullExamplePage,
})

function FullExamplePage() {
  const users = Route.useLoaderData()
  const [scenario, setScenario] = React.useState<ExampleScenario>('ready')
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
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
        header: 'Details',
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openUser(row.original)}
          >
            Open details
          </Button>
        ),
      },
    ],
    [openUser],
  )

  const data = scenario === 'empty' ? [] : viewModel

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

  React.useEffect(() => {
    if (scenario === 'empty') {
      setSelectedUserId(null)
    }
  }, [scenario])

  const table = useReactTable({
    data,
    columns,
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

  const selectedUser =
    viewModel.find((user) => user.id === selectedUserId) ?? null

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <h2 className="display-title text-2xl font-semibold md:text-3xl">
          Full first-section example
        </h2>
        <p className="max-w-3xl text-sm text-(--sea-ink-soft)">
          This page combines the lecture themes: shared columns, sorting,
          pagination, sticky headers, responsive cards, state handling, and a
          touch-friendly details drawer with a date picker.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-wrap gap-2">
          {(['ready', 'loading', 'empty', 'error'] as ExampleScenario[]).map(
            (item) => (
              <Button
                key={item}
                variant={scenario === item ? 'default' : 'outline'}
                onClick={() => setScenario(item)}
              >
                {item}
              </Button>
            ),
          )}
        </div>

        <article className="feature-card rounded-2xl border border-(--line) p-5">
          <p className="island-kicker">Lecture note</p>
          <p className="mt-2 text-sm text-(--sea-ink-soft)">
            The page deliberately stops before filtering. That keeps the first
            section focused on table mechanics and interaction design.
          </p>
        </article>
      </div>

      <UserRecordsPresentation
        table={table}
        colSpan={columns.length}
        stickyHeader
        loading={scenario === 'loading'}
        errorMessage={
          scenario === 'error'
            ? 'Simulated failure state for the combined example. This is where you explain retry UI and operational empathy.'
            : undefined
        }
        emptyTitle="No rows in the combined example"
        emptyDescription="The same layout should stay polished even when the dataset is intentionally empty."
        onRetry={() => setScenario('ready')}
        renderRowActions={(user) => (
          <Button variant="outline" size="sm" onClick={() => openUser(user)}>
            Open details
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
