import {
  type FacetOption,
  type UserFacets,
  filterUsers,
  sortUsers,
} from '#/data/user-filters'
import { prisma } from '#/data/prisma'
import {
  EMPTY_USER_FILTERS,
  USER_COUNTRIES,
  USER_DEPARTMENTS,
  USER_ROLES,
  USER_STATUSES,
} from '#/data/user-model'
import type { UserFilters, UserRecord, UsersQuery } from '#/data/user-model'
import {
  buildStructuredUserWhere,
  mapPrismaUserRecord,
} from '#/data/user-prisma'

export type { UserRecord, UsersQuery } from '#/data/user-model'

export interface PaginatedUsersResult {
  items: UserRecord[]
  totalCount: number
  datasetCount: number
  pageCount: number
  page: number
  pageSize: number
  facets: UserFacets
}

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

async function findUsers(filters: UserFilters) {
  const users = await prisma.user.findMany({
    where: buildStructuredUserWhere(filters),
    orderBy: { id: 'asc' },
  })

  return users.map(mapPrismaUserRecord)
}

function countValues<TValue extends string>(
  users: UserRecord[],
  key: keyof UserRecord,
  order: readonly TValue[],
): FacetOption<TValue>[] {
  return order.map((value) => ({
    value,
    count: users.filter((user) => user[key] === value).length,
  }))
}

async function buildUserFacets(filters: UserFilters): Promise<UserFacets> {
  const roleFilters = { ...filters, roles: EMPTY_USER_FILTERS.roles }
  const departmentFilters = {
    ...filters,
    departments: EMPTY_USER_FILTERS.departments,
  }
  const countryFilters = { ...filters, countries: EMPTY_USER_FILTERS.countries }
  const statusFilters = { ...filters, status: EMPTY_USER_FILTERS.status }

  const [roleUsers, departmentUsers, countryUsers, statusUsers] =
    await Promise.all([
      findUsers(roleFilters),
      findUsers(departmentFilters),
      findUsers(countryFilters),
      findUsers(statusFilters),
    ])

  return {
    roles: countValues(filterUsers(roleUsers, roleFilters), 'role', USER_ROLES),
    departments: countValues(
      filterUsers(departmentUsers, departmentFilters),
      'department',
      USER_DEPARTMENTS,
    ),
    countries: countValues(
      filterUsers(countryUsers, countryFilters),
      'country',
      USER_COUNTRIES,
    ),
    statuses: countValues(
      filterUsers(statusUsers, statusFilters),
      'status',
      USER_STATUSES,
    ),
  }
}

export async function readDB() {
  await delay(150)
  const users = await prisma.user.findMany({
    orderBy: { id: 'asc' },
  })

  return users.map(mapPrismaUserRecord)
}

export async function queryUsers(
  params: UsersQuery,
): Promise<PaginatedUsersResult> {
  await delay(150)

  const [datasetCount, prefilteredUsers, facets] = await Promise.all([
    prisma.user.count(),
    findUsers(params),
    buildUserFacets(params),
  ])

  const filtered = filterUsers(prefilteredUsers, params)
  const sorted = sortUsers(filtered, params.sortBy, params.sortDir)

  const safePageSize = Math.max(1, params.pageSize)
  const pageCount = Math.max(1, Math.ceil(filtered.length / safePageSize))
  const page = Math.min(Math.max(1, params.page), pageCount)
  const start = (page - 1) * safePageSize

  return {
    items: sorted.slice(start, start + safePageSize),
    totalCount: filtered.length,
    datasetCount,
    pageCount,
    page,
    pageSize: safePageSize,
    facets,
  }
}
