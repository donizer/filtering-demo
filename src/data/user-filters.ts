import { matchSorter } from 'match-sorter'

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
  return Number.isNaN(parsed) ? undefined : parsed
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
  const nameQuery = filters.name.trim().toLowerCase()
  const exactId = parseOptionalInteger(filters.id)
  const ageMin = parseOptionalInteger(filters.ageMin)
  const ageMax = parseOptionalInteger(filters.ageMax)
  const salaryMin = parseOptionalInteger(filters.salaryMin)
  const salaryMax = parseOptionalInteger(filters.salaryMax)
  const joinedFrom = parseOptionalDate(filters.joinedFrom)
  const joinedTo = parseOptionalDate(filters.joinedTo)

  const fuzzyScopedUsers = globalSearch
    ? matchSorter(users, globalSearch, {
        keys: ['name', 'role', 'department', 'country', 'status'],
      })
    : users

  return fuzzyScopedUsers.filter((user) => {
    if (exactId !== undefined && user.id !== exactId) {
      return false
    }

    if (nameQuery && !user.name.toLowerCase().includes(nameQuery)) {
      return false
    }

    if (filters.status !== 'all' && user.status !== filters.status) {
      return false
    }

    if (filters.roles.length > 0 && !filters.roles.includes(user.role)) {
      return false
    }

    if (
      filters.departments.length > 0 &&
      !filters.departments.includes(user.department)
    ) {
      return false
    }

    if (
      filters.countries.length > 0 &&
      !filters.countries.includes(user.country)
    ) {
      return false
    }

    if (ageMin !== undefined && user.age < ageMin) {
      return false
    }

    if (ageMax !== undefined && user.age > ageMax) {
      return false
    }

    if (salaryMin !== undefined && user.salary < salaryMin) {
      return false
    }

    if (salaryMax !== undefined && user.salary > salaryMax) {
      return false
    }

    const joinedAt = Date.parse(user.joinedAt)

    if (joinedFrom !== undefined && joinedAt < joinedFrom) {
      return false
    }

    if (joinedTo !== undefined && joinedAt > joinedTo) {
      return false
    }

    return true
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
