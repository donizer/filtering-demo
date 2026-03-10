import type { ReactNode } from 'react'
import { flexRender } from '@tanstack/react-table'
import type { Table as TanStackTable } from '@tanstack/react-table'
import { AlertTriangle, DatabaseZap, RefreshCw } from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#/components/ui/empty'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Skeleton } from '#/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import {
  formatUserJoinedAt,
  formatUserSalary,
  getUserStatusTone,
} from '#/components/user-table-columns'
import type { UserRecord } from '#/data/user-model'
import { cn } from '#/lib/utils'

interface PagerConfig {
  page: number
  pageCount: number
  pageSize: number
  canPreviousPage: boolean
  canNextPage: boolean
  onPreviousPage: () => void
  onNextPage: () => void
  onPageSizeChange: (value: string) => void
}

interface UserRecordsPresentationProps {
  table: TanStackTable<UserRecord>
  colSpan: number
  stickyHeader?: boolean
  loading?: boolean
  errorMessage?: string
  emptyTitle?: string
  emptyDescription?: string
  onRetry?: () => void
  pager?: PagerConfig
  renderRowActions?: (user: UserRecord) => ReactNode
}

const stickyTableHeadClass =
  'sticky top-21 z-10 bg-[rgba(251,255,248,0.95)] backdrop-blur-md'

export function UserRecordsPresentation({
  table,
  colSpan,
  stickyHeader = false,
  loading = false,
  errorMessage,
  emptyTitle = 'No rows to show',
  emptyDescription = 'Adjust the scenario or return to a populated dataset.',
  onRetry,
  pager,
  renderRowActions,
}: UserRecordsPresentationProps) {
  const rows = table.getRowModel().rows

  if (loading) {
    return <TableLoadingState />
  }

  if (errorMessage) {
    return <TableErrorState errorMessage={errorMessage} onRetry={onRetry} />
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-(--line) bg-white/60 p-4 md:p-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <DatabaseZap className="size-5" />
            </EmptyMedia>
            <EmptyTitle>{emptyTitle}</EmptyTitle>
            <EmptyDescription>{emptyDescription}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  return (
    <div className="space-y-4" data-col-span={colSpan}>
      <div className="hidden rounded-2xl border border-(--line) bg-white/70 lg:block">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(stickyHeader && stickyTableHeadClass)}
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
            {rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 lg:hidden">
        {rows.map((row) => {
          const user = row.original

          return (
            <article
              key={row.id}
              className="feature-card rounded-2xl border border-(--line) p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-(--sea-ink)">
                    {user.name}
                  </p>
                  <p className="mt-1 text-sm text-(--sea-ink-soft)">
                    {user.role} · {user.department}
                  </p>
                </div>

                <span
                  className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold capitalize ${getUserStatusTone(user.status)}`}
                >
                  {user.status}
                </span>
              </div>

              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <SummaryItem label="Country" value={user.country} />
                <SummaryItem label="Age" value={String(user.age)} />
                <SummaryItem
                  label="Salary"
                  value={formatUserSalary(user.salary)}
                />
                <SummaryItem
                  label="Joined"
                  value={formatUserJoinedAt(user.joinedAt)}
                />
              </dl>

              {renderRowActions ? (
                <div className="mt-4 flex justify-end">
                  {renderRowActions(user)}
                </div>
              ) : null}
            </article>
          )
        })}
      </div>

      {pager ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-(--line) bg-white/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={pager.onPreviousPage}
              disabled={!pager.canPreviousPage}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={pager.onNextPage}
              disabled={!pager.canNextPage}
            >
              Next
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-(--sea-ink-soft)">
            <span>
              Page {pager.page} of {pager.pageCount}
            </span>
            <Select
              value={String(pager.pageSize)}
              onValueChange={pager.onPageSizeChange}
            >
              <SelectTrigger className="w-24 bg-white/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function TableLoadingState() {
  return (
    <div className="space-y-4">
      <div className="hidden rounded-2xl border border-(--line) bg-white/70 p-4 lg:block">
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-(--line) bg-white/70 p-4"
          >
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="mt-3 h-4 w-1/2" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TableErrorState({
  errorMessage,
  onRetry,
}: {
  errorMessage: string
  onRetry?: () => void
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[rgba(185,87,73,0.35)] bg-[rgba(255,255,255,0.72)] p-4 md:p-6">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangle className="size-5" />
          </EmptyMedia>
          <EmptyTitle>Unable to render the table</EmptyTitle>
          <EmptyDescription>{errorMessage}</EmptyDescription>
        </EmptyHeader>
        {onRetry ? (
          <EmptyContent>
            <Button variant="outline" onClick={onRetry}>
              <RefreshCw className="size-4" />
              Retry scenario
            </Button>
          </EmptyContent>
        ) : null}
      </Empty>
    </div>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-(--line) bg-white/75 p-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-(--sea-ink-soft)">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-(--sea-ink)">{value}</dd>
    </div>
  )
}
