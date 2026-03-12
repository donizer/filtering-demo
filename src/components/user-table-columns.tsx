import type { ColumnDef } from '@tanstack/react-table'

import { SortableColumnHeader } from '#/components/sortable-column-header'
import type { UserRecord } from '#/data/user-model'

const currencyFormatter = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
  dateStyle: 'medium',
})

const roleLabels: Record<UserRecord['role'], string> = {
  Developer: 'Розробник',
  DataAnalyst: 'Аналітик даних',
  QAEngineer: 'QA-інженер',
  ProductManager: 'Продуктовий менеджер',
  DevOps: 'DevOps',
  Designer: 'Дизайнер',
  HRManager: 'HR-менеджер',
  ProjectManager: 'Керівник проєкту',
}

const departmentLabels: Record<UserRecord['department'], string> = {
  Engineering: 'Інженерія',
  Analytics: 'Аналітика',
  Product: 'Продукт',
  Operations: 'Операції',
  People: 'Люди і культура',
}

const countryLabels: Record<UserRecord['country'], string> = {
  Ukraine: 'Україна',
  Poland: 'Польща',
  Germany: 'Німеччина',
  Spain: 'Іспанія',
  Netherlands: 'Нідерланди',
  Canada: 'Канада',
}

const statusLabels: Record<UserRecord['status'], string> = {
  active: 'Активний',
  inactive: 'Неактивний',
}

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

export function formatUserRole(role: UserRecord['role']) {
  return roleLabels[role]
}

export function formatUserDepartment(department: UserRecord['department']) {
  return departmentLabels[department]
}

export function formatUserCountry(country: UserRecord['country']) {
  return countryLabels[country]
}

export function formatUserStatus(status: UserRecord['status']) {
  return statusLabels[status]
}

export function formatUserStatusFilter(status: UserRecord['status'] | 'all') {
  if (status === 'all') {
    return 'Усі статуси'
  }

  return formatUserStatus(status)
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
    size: 48,
  },
  {
    accessorKey: 'name',
    header: sortableHeader('Ім’я'),
    size: 140,
  },
  {
    accessorKey: 'role',
    header: sortableHeader('Роль'),
    size: 132,
    cell: ({ row }) => formatUserRole(row.original.role),
  },
  {
    accessorKey: 'department',
    header: sortableHeader('Відділ'),
    size: 118,
    cell: ({ row }) => formatUserDepartment(row.original.department),
  },
  {
    accessorKey: 'country',
    header: sortableHeader('Країна'),
    size: 104,
    cell: ({ row }) => formatUserCountry(row.original.country),
  },
  {
    accessorKey: 'age',
    header: sortableHeader('Вік'),
    size: 56,
  },
  {
    accessorKey: 'salary',
    header: sortableHeader('Зарплата'),
    size: 98,
    cell: ({ row }) => formatUserSalary(row.original.salary),
  },
  {
    accessorKey: 'joinedAt',
    header: sortableHeader('Дата приєднання'),
    size: 118,
    cell: ({ row }) => formatUserJoinedAt(row.original.joinedAt),
  },
  {
    accessorKey: 'status',
    header: sortableHeader('Статус'),
    size: 104,
    cell: ({ row }) => (
      <span
        className={`inline-flex rounded-full border px-2 py-1 text-xs font-semibold ${getUserStatusTone(row.original.status)}`}
      >
        {formatUserStatus(row.original.status)}
      </span>
    ),
  },
]
