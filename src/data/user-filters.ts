import { matchSorter } from 'match-sorter'
import sift from 'sift'

import {
  EMPTY_USER_FILTERS,
  USER_COUNTRIES,
  USER_DEPARTMENTS,
  USER_ROLES,
  USER_STATUSES,
} from '#/data/user-model'
import type {
  UserCountry,
  UserDepartment,
  UserFilters,
  UserRecord,
  UserRole,
  UserSortDirection,
  UserSortField,
  UserStatus,
} from '#/data/user-model'

export interface FacetOption<TValue extends string> {
  value: TValue
  count: number
}

export interface UserFacets {
  roles: FacetOption<UserRole>[]
  departments: FacetOption<UserDepartment>[]
  countries: FacetOption<UserCountry>[]
  statuses: FacetOption<UserStatus>[]
}

const FILTERED_FACET_KEYS = {
  roles: 'role',
  departments: 'department',
  countries: 'country',
  statuses: 'status',
} as const

const GLOBAL_SEARCH_KEYS: ReadonlyArray<keyof UserRecord> = [
  'name',
  'role',
  'department',
  'country',
  'status',
]

function parseOptionalInteger(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseOptionalDate(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  const parsed = Date.parse(trimmed)
  return Number.isNaN(parsed) ? undefined : trimmed
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function buildUserMongoQuery(filters: UserFilters) {
  const conditions: Array<Record<string, unknown>> = []
  const exactId = parseOptionalInteger(filters.id)
  const trimmedName = filters.name.trim()
  const ageMin = parseOptionalInteger(filters.ageMin)
  const ageMax = parseOptionalInteger(filters.ageMax)
  const salaryMin = parseOptionalInteger(filters.salaryMin)
  const salaryMax = parseOptionalInteger(filters.salaryMax)
  const joinedFrom = parseOptionalDate(filters.joinedFrom)
  const joinedTo = parseOptionalDate(filters.joinedTo)

  if (exactId !== undefined) {
    conditions.push({ id: exactId })
  }

  if (trimmedName) {
    conditions.push({
      name: {
        $regex: escapeRegExp(trimmedName),
        $options: 'i',
      },
    })
  }

  if (filters.status !== 'all') {
    conditions.push({ status: filters.status })
  }

  if (filters.roles.length > 0) {
    conditions.push({ role: { $in: filters.roles } })
  }

  if (filters.departments.length > 0) {
    conditions.push({ department: { $in: filters.departments } })
  }

  if (filters.countries.length > 0) {
    conditions.push({ country: { $in: filters.countries } })
  }

  if (ageMin !== undefined || ageMax !== undefined) {
    conditions.push({
      age: {
        ...(ageMin !== undefined ? { $gte: ageMin } : null),
        ...(ageMax !== undefined ? { $lte: ageMax } : null),
      },
    })
  }

  if (salaryMin !== undefined || salaryMax !== undefined) {
    conditions.push({
      salary: {
        ...(salaryMin !== undefined ? { $gte: salaryMin } : null),
        ...(salaryMax !== undefined ? { $lte: salaryMax } : null),
      },
    })
  }

  if (joinedFrom !== undefined || joinedTo !== undefined) {
    conditions.push({
      joinedAt: {
        ...(joinedFrom !== undefined ? { $gte: joinedFrom } : null),
        ...(joinedTo !== undefined ? { $lte: joinedTo } : null),
      },
    })
  }

  if (conditions.length === 0) {
    return {}
  }

  return { $and: conditions }
}

function countValues<TValue extends string>(
  users: UserRecord[],
  key: keyof UserRecord,
  order: readonly TValue[],
) {
  return order.map((value) => ({
    value,
    count: users.filter((user) => user[key] === value).length,
  }))
}

export function filterUsers(users: UserRecord[], filters: UserFilters) {
  const globalSearch = filters.global.trim()
  const mongoQuery = buildUserMongoQuery(filters)
  const exactFilteredUsers = users.filter(sift<UserRecord>(mongoQuery))

  if (!globalSearch) {
    return exactFilteredUsers
  }

  return matchSorter(exactFilteredUsers, globalSearch, {
    keys: GLOBAL_SEARCH_KEYS,
  })
}

export function sortUsers(
  users: UserRecord[],
  sortBy: '' | UserSortField,
  sortDir: UserSortDirection,
) {
  if (!sortBy) {
    return users
  }

  return [...users].sort((left, right) => {
    const leftValue = left[sortBy]
    const rightValue = right[sortBy]

    let comparison = 0

    if (typeof leftValue === 'number' && typeof rightValue === 'number') {
      comparison = leftValue - rightValue
    } else {
      comparison = String(leftValue).localeCompare(String(rightValue), 'en', {
        sensitivity: 'base',
      })
    }

    if (comparison === 0) {
      return left.id - right.id
    }

    return sortDir === 'desc' ? comparison * -1 : comparison
  })
}

export function buildUserFacets(
  users: UserRecord[],
  filters: UserFilters,
): UserFacets {
  const filterlessFields: Record<keyof UserFacets, UserFilters> = {
    roles: { ...filters, roles: EMPTY_USER_FILTERS.roles },
    departments: { ...filters, departments: EMPTY_USER_FILTERS.departments },
    countries: { ...filters, countries: EMPTY_USER_FILTERS.countries },
    statuses: { ...filters, status: EMPTY_USER_FILTERS.status },
  }

  return {
    roles: countValues(
      filterUsers(users, filterlessFields.roles),
      FILTERED_FACET_KEYS.roles,
      USER_ROLES,
    ),
    departments: countValues(
      filterUsers(users, filterlessFields.departments),
      FILTERED_FACET_KEYS.departments,
      USER_DEPARTMENTS,
    ),
    countries: countValues(
      filterUsers(users, filterlessFields.countries),
      FILTERED_FACET_KEYS.countries,
      USER_COUNTRIES,
    ),
    statuses: countValues(
      filterUsers(users, filterlessFields.statuses),
      FILTERED_FACET_KEYS.statuses,
      USER_STATUSES,
    ),
  }
}

export function getActiveFilterCount(filters: UserFilters) {
  let count = 0

  if (filters.global) count += 1
  if (filters.id) count += 1
  if (filters.name) count += 1
  if (filters.roles.length > 0) count += 1
  if (filters.departments.length > 0) count += 1
  if (filters.countries.length > 0) count += 1
  if (filters.status !== 'all') count += 1
  if (filters.ageMin || filters.ageMax) count += 1
  if (filters.salaryMin || filters.salaryMax) count += 1
  if (filters.joinedFrom || filters.joinedTo) count += 1

  return count
}
