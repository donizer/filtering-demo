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

type UserListField = 'role' | 'department' | 'country'

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

function matchesOptionalRange<TValue extends number | string>(
  value: TValue,
  min: TValue | undefined,
  max: TValue | undefined,
) {
  if (min !== undefined && value < min) {
    return false
  }

  if (max !== undefined && value > max) {
    return false
  }

  return true
}

function matchesListFilter<TKey extends UserListField>(
  selectedValues: UserRecord[TKey][],
  value: UserRecord[TKey],
) {
  return selectedValues.length === 0 || selectedValues.includes(value)
}

function matchesUserFilters(user: UserRecord, filters: UserFilters) {
  const exactId = parseOptionalInteger(filters.id)
  const trimmedName = filters.name.trim()
  const ageMin = parseOptionalInteger(filters.ageMin)
  const ageMax = parseOptionalInteger(filters.ageMax)
  const salaryMin = parseOptionalInteger(filters.salaryMin)
  const salaryMax = parseOptionalInteger(filters.salaryMax)
  const joinedFrom = parseOptionalDate(filters.joinedFrom)
  const joinedTo = parseOptionalDate(filters.joinedTo)

  if (exactId !== undefined && user.id !== exactId) {
    return false
  }

  if (
    trimmedName &&
    !user.name.toLocaleLowerCase().includes(trimmedName.toLocaleLowerCase())
  ) {
    return false
  }

  if (filters.status !== 'all' && user.status !== filters.status) {
    return false
  }

  if (!matchesListFilter(filters.roles, user.role)) {
    return false
  }

  if (!matchesListFilter(filters.departments, user.department)) {
    return false
  }

  if (!matchesListFilter(filters.countries, user.country)) {
    return false
  }

  if (!matchesOptionalRange(user.age, ageMin, ageMax)) {
    return false
  }

  if (!matchesOptionalRange(user.salary, salaryMin, salaryMax)) {
    return false
  }

  if (!matchesOptionalRange(user.joinedAt, joinedFrom, joinedTo)) {
    return false
  }

  return true
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
  const exactFilteredUsers = users.filter((user) =>
    matchesUserFilters(user, filters),
  )

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
