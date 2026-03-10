import type { PaginationState, SortingState } from '@tanstack/react-table'

import { EMPTY_USER_FILTERS, usersQuerySchema } from '#/data/user-model'
import type { UserFilters, UsersQuery } from '#/data/user-model'

const DEFAULT_USERS_QUERY = usersQuerySchema.parse({})

export function getUserFiltersFromQuery(query: UsersQuery): UserFilters {
  const {
    page: _page,
    pageSize: _pageSize,
    sortBy: _sortBy,
    sortDir: _sortDir,
    ...filters
  } = query

  return filters
}

export function getUserSortingFromQuery(query: UsersQuery): SortingState {
  if (!query.sortBy) {
    return []
  }

  return [{ id: query.sortBy, desc: query.sortDir === 'desc' }]
}

export function getUserPaginationFromQuery(query: UsersQuery): PaginationState {
  return {
    pageIndex: query.page - 1,
    pageSize: query.pageSize,
  }
}

export function buildUsersQuery(
  current: UsersQuery,
  patch: Partial<UsersQuery>,
): UsersQuery {
  return usersQuerySchema.parse({
    ...current,
    ...patch,
  })
}

export function buildDraftUsersQuery(
  current: UsersQuery,
  draftFilters: UserFilters,
): UsersQuery {
  return usersQuerySchema.parse({
    ...current,
    ...draftFilters,
    page: 1,
  })
}

export function normalizeUsersSearch(
  query: Partial<UsersQuery>,
): Partial<UsersQuery> {
  const parsed = usersQuerySchema.parse(query)
  const normalized: Partial<UsersQuery> = {}

  if (parsed.global) normalized.global = parsed.global
  if (parsed.id) normalized.id = parsed.id
  if (parsed.name) normalized.name = parsed.name
  if (parsed.roles.length > 0) normalized.roles = parsed.roles
  if (parsed.departments.length > 0) normalized.departments = parsed.departments
  if (parsed.countries.length > 0) normalized.countries = parsed.countries
  if (parsed.status !== DEFAULT_USERS_QUERY.status)
    normalized.status = parsed.status
  if (parsed.ageMin) normalized.ageMin = parsed.ageMin
  if (parsed.ageMax) normalized.ageMax = parsed.ageMax
  if (parsed.salaryMin) normalized.salaryMin = parsed.salaryMin
  if (parsed.salaryMax) normalized.salaryMax = parsed.salaryMax
  if (parsed.joinedFrom) normalized.joinedFrom = parsed.joinedFrom
  if (parsed.joinedTo) normalized.joinedTo = parsed.joinedTo
  if (parsed.page !== DEFAULT_USERS_QUERY.page) normalized.page = parsed.page
  if (parsed.pageSize !== DEFAULT_USERS_QUERY.pageSize) {
    normalized.pageSize = parsed.pageSize
  }
  if (parsed.sortBy) normalized.sortBy = parsed.sortBy
  if (parsed.sortBy && parsed.sortDir !== DEFAULT_USERS_QUERY.sortDir) {
    normalized.sortDir = parsed.sortDir
  }

  return normalized
}

export function buildUsersSearchUpdate(
  current: UsersQuery,
  patch: Partial<UsersQuery>,
): Partial<UsersQuery> {
  return normalizeUsersSearch(buildUsersQuery(current, patch))
}

export function buildEmptyUsersSearch(): Partial<UsersQuery> {
  return normalizeUsersSearch(EMPTY_USER_FILTERS)
}
