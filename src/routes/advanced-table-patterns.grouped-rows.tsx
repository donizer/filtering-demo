import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import {
  formatUserCountry,
  formatUserDepartment,
  formatUserJoinedAt,
  formatUserRole,
  formatUserSalary,
  formatUserStatus,
  getUserStatusTone,
} from '#/components/user-table-columns'
import { fetchAllUsers } from '#/data/user-demo-server'
import type { UserRecord } from '#/data/user-model'
import { cn } from '#/lib/utils'

type DepartmentRow = {
  id: string
  label: string
  summary: string
  countrySpread: string
  salaryValue: number
  joinedAt: string
  statusLabel: string
  statusTone?: UserRecord['status']
  subRows?: DepartmentRow[]
  isGroup: boolean
}

export const Route = createFileRoute('/advanced-table-patterns/grouped-rows')({
  loader: () => fetchAllUsers(),
  component: GroupedRowsPage,
})

const columns: ColumnDef<DepartmentRow>[] = [
  {
    accessorKey: 'label',
    header: 'Відділ / учасник',
    cell: ({ row, getValue }) => {
      const value = getValue<string>()

      return (
        <div
          className="flex items-center gap-2"
          style={{ paddingLeft: `${row.depth * 16}px` }}
        >
          {row.getCanExpand() ? (
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-md border border-(--line) bg-(--surface-strong)"
              onClick={row.getToggleExpandedHandler()}
            >
              {row.getIsExpanded() ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </button>
          ) : (
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-(--group-accent-bg) text-(--sea-ink-soft)">
              •
            </span>
          )}

          <div>
            <p className="font-medium text-(--sea-ink)">{value}</p>
            {row.original.isGroup ? (
              <p className="text-xs text-(--sea-ink-soft)">
                Підсумковий рядок групи
              </p>
            ) : null}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'summary',
    header: 'Підсумок',
  },
  {
    accessorKey: 'countrySpread',
    header: 'Покриття за країнами',
  },
  {
    accessorKey: 'salaryValue',
    header: 'Зарплата / середня зарплата',
    cell: ({ row }) => formatUserSalary(row.original.salaryValue),
  },
  {
    accessorKey: 'joinedAt',
    header: 'Дата приєднання / найраніша дата',
    cell: ({ row }) => formatUserJoinedAt(row.original.joinedAt),
  },
  {
    accessorKey: 'statusLabel',
    header: 'Зріз статусу',
    cell: ({ row }) => (
      <span
        className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${row.original.isGroup ? 'border-(--group-accent-border) bg-(--group-accent-bg) text-(--sea-ink)' : getUserStatusTone(row.original.statusTone ?? 'inactive')}`}
      >
        {row.original.statusLabel}
      </span>
    ),
  },
]

function GroupedRowsPage() {
  const users = Route.useLoaderData()
  const groupedRows = React.useMemo(() => buildDepartmentRows(users), [users])

  const table = useReactTable({
    data: groupedRows,
    columns,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  })

  return (
    <div className="space-y-4">
      <header className="space-y-2">
        <h2 className="display-title text-2xl font-semibold md:text-3xl">
          Липкі заголовки та згруповані рядки
        </h2>
        <p className="max-w-3xl text-sm text-(--sea-ink-soft)">
          Таблиця починається з плоских записів користувачів, а потім проєктує
          їх у розгортні групи відділів. Саме тут складні дані стають задачею
          моделювання, а не лише рендерингу.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="feature-card rounded-2xl border border-(--line) p-5">
          <p className="island-kicker">Батьківські групи</p>
          <p className="mt-2 text-sm text-(--sea-ink-soft)">
            Кожен рядок відділу агрегує метрики та володіє розгортними рядками
            учасників.
          </p>
        </article>
        <article className="feature-card rounded-2xl border border-(--line) p-5">
          <p className="island-kicker">Розгортна структура</p>
          <p className="mt-2 text-sm text-(--sea-ink-soft)">
            TanStack Table читає вкладені subRows напряму через getSubRows.
          </p>
        </article>
        <article className="feature-card rounded-2xl border border-(--line) p-5">
          <p className="island-kicker">Без фільтрів</p>
          <p className="mt-2 text-sm text-(--sea-ink-soft)">
            Групування тут використовується лише для пояснення форми даних і
            ієрархії рядків.
          </p>
        </article>
      </div>

      <div className="hidden rounded-2xl overflow-hidden border border-(--line) bg-white/70 lg:block">
        <Table containerClassName="max-h-128 overflow-auto">
          <TableHeader className="[&_tr]:border-b-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b-0">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="sticky top-0 z-20 bg-(--header-bg) backdrop-blur-md shadow-[inset_0_-1px_0_var(--sticky-divider)]"
                  >
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
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn({
                  'border-b-0 bg-(--group-row-bg)': row.depth === 0,
                })}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn({
                      'sticky top-10 z-5 bg-(--group-row-sticky-bg) backdrop-blur-md shadow-[inset_0_-1px_0_var(--sticky-divider)]':
                        row.depth === 0,
                    })}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 lg:hidden">
        {table
          .getRowModel()
          .rows.filter((row) => row.depth === 0)
          .map((row) => (
            <article
              key={row.id}
              className="feature-card rounded-2xl border border-(--line) p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-(--sea-ink)">
                    {row.original.label}
                  </p>
                  <p className="mt-1 text-sm text-(--sea-ink-soft)">
                    {row.original.summary}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={row.getToggleExpandedHandler()}
                >
                  {row.getIsExpanded() ? 'Сховати склад' : 'Показати склад'}
                </Button>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <MobileSummary
                  label="Покриття країн"
                  value={row.original.countrySpread}
                />
                <MobileSummary
                  label="Середня зарплата"
                  value={formatUserSalary(row.original.salaryValue)}
                />
                <MobileSummary
                  label="Найраніша дата"
                  value={formatUserJoinedAt(row.original.joinedAt)}
                />
                <MobileSummary
                  label="Статус"
                  value={row.original.statusLabel}
                />
              </dl>

              {row.getIsExpanded() ? (
                <div className="mt-4 space-y-2 rounded-xl border border-(--line) bg-white/65 p-3">
                  {row.subRows.map((subRow) => (
                    <div
                      key={subRow.id}
                      className="rounded-xl border border-(--line) bg-white/75 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-(--sea-ink)">
                            {subRow.original.label}
                          </p>
                          <p className="text-sm text-(--sea-ink-soft)">
                            {subRow.original.summary}
                          </p>
                        </div>
                        <span
                          className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold capitalize ${getUserStatusTone(subRow.original.statusTone ?? 'inactive')}`}
                        >
                          {subRow.original.statusLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
      </div>
    </div>
  )
}

function buildDepartmentRows(users: UserRecord[]): DepartmentRow[] {
  return Object.entries(
    users.reduce<Record<string, UserRecord[]>>((accumulator, user) => {
      accumulator[user.department] ??= []
      accumulator[user.department].push(user)
      return accumulator
    }, {}),
  ).map(([department, members]) => {
    const activeCount = members.filter(
      (member) => member.status === 'active',
    ).length
    const uniqueCountries = new Set(members.map((member) => member.country))
      .size
    const averageSalary = Math.round(
      members.reduce((sum, member) => sum + member.salary, 0) / members.length,
    )
    const earliestJoinedAt = [...members].sort((left, right) =>
      left.joinedAt.localeCompare(right.joinedAt),
    )[0]!.joinedAt

    return {
      id: department,
      label: formatUserDepartment(department as UserRecord['department']),
      summary: `${members.length} працівників · ${new Set(members.map((member) => member.role)).size} ролей`,
      countrySpread: `${uniqueCountries} країн`,
      salaryValue: averageSalary,
      joinedAt: earliestJoinedAt,
      statusLabel: `${activeCount} активних`,
      statusTone: undefined,
      isGroup: true,
      subRows: members.map((member) => ({
        id: `${department}-${member.id}`,
        label: member.name,
        summary: `${formatUserRole(member.role)} · ${formatUserDepartment(member.department)}`,
        countrySpread: formatUserCountry(member.country),
        salaryValue: member.salary,
        joinedAt: member.joinedAt,
        statusLabel: formatUserStatus(member.status),
        statusTone: member.status,
        isGroup: false,
      })),
    }
  })
}

function MobileSummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-(--line) bg-white/75 p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--sea-ink-soft)">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-(--sea-ink)">{value}</p>
    </div>
  )
}
