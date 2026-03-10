import type { ColumnDef } from '@tanstack/react-table'

import { SortableColumnHeader } from '#/components/sortable-column-header'
import type { UserRecord } from '#/data/user-model'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
  dateStyle: 'medium',
})

function sortableHeader(label: string): ColumnDef<UserRecord>['header'] {
  return ({ column }) => (
    <SortableColumnHeader
      label={label}
      sortDirection={column.getIsSorted()}
      onClick={column.getToggleSortingHandler()}
    />
  )
}

export function formatUserSalary(salary: number) {
  return currencyFormatter.format(salary)
}

export function formatUserJoinedAt(joinedAt: string) {
  return dateFormatter.format(new Date(joinedAt))
}

export function getUserStatusTone(status: UserRecord['status']) {
  return status === 'active'
    ? 'border-[rgba(47,106,74,0.22)] bg-[rgba(47,106,74,0.08)] text-[color:var(--palm)]'
    : 'border-[rgba(23,58,64,0.14)] bg-[rgba(23,58,64,0.06)] text-(--sea-ink-soft)'
}

export const userTableColumns: ColumnDef<UserRecord>[] = [
  {
    accessorKey: 'id',
    header: sortableHeader('ID'),
  },
  {
    accessorKey: 'name',
    header: sortableHeader('Name'),
  },
  {
    accessorKey: 'role',
    header: sortableHeader('Role'),
  },
  {
    accessorKey: 'department',
    header: sortableHeader('Department'),
  },
  {
    accessorKey: 'country',
    header: sortableHeader('Country'),
  },
  {
    accessorKey: 'age',
    header: sortableHeader('Age'),
  },
  {
    accessorKey: 'salary',
    header: sortableHeader('Salary'),
    cell: ({ row }) => formatUserSalary(row.original.salary),
  },
  {
    accessorKey: 'joinedAt',
    header: sortableHeader('Joined'),
    cell: ({ row }) => formatUserJoinedAt(row.original.joinedAt),
  },
  {
    accessorKey: 'status',
    header: sortableHeader('Status'),
    cell: ({ row }) => (
      <span
        className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold capitalize ${getUserStatusTone(row.original.status)}`}
      >
        {row.original.status}
      </span>
    ),
  },
]
