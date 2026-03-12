import type { SortingState } from '@tanstack/react-table'

import type {
  UserFilters,
  UserStatusFilter,
  UsersQuery,
} from '#/data/user-model'

export type UserTextFilterKey =
  | 'global'
  | 'id'
  | 'name'
  | 'ageMin'
  | 'ageMax'
  | 'salaryMin'
  | 'salaryMax'
  | 'joinedFrom'
  | 'joinedTo'

export type UserArrayFilterKey = 'roles' | 'departments' | 'countries'

type UserArrayFilterValueMap = {
  roles: UserFilters['roles'][number]
  departments: UserFilters['departments'][number]
  countries: UserFilters['countries'][number]
}

function sortFilterArrays(filters: UserFilters): UserFilters {
  return {
    ...filters,
    roles: [...filters.roles].sort(),
    departments: [...filters.departments].sort(),
    countries: [...filters.countries].sort(),
  }
}

function toggleArrayValue<TValue extends string>(
  values: TValue[],
  value: TValue,
) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value]
}

export function areUserFiltersEqual(left: UserFilters, right: UserFilters) {
  return (
    JSON.stringify(sortFilterArrays(left)) ===
    JSON.stringify(sortFilterArrays(right))
  )
}

export function updateUserTextFilter(
  filters: UserFilters,
  key: UserTextFilterKey,
  value: string,
): UserFilters {
  return {
    ...filters,
    [key]: value,
  }
}

export function updateUserStatusFilter(
  filters: UserFilters,
  status: UserStatusFilter,
): UserFilters {
  return {
    ...filters,
    status,
  }
}

export function toggleUserArrayFilter<TKey extends UserArrayFilterKey>(
  filters: UserFilters,
  key: TKey,
  value: UserArrayFilterValueMap[TKey],
): UserFilters {
  switch (key) {
    case 'roles':
      return {
        ...filters,
        roles: toggleArrayValue(
          filters.roles,
          value as UserArrayFilterValueMap['roles'],
        ),
      }
    case 'departments':
      return {
        ...filters,
        departments: toggleArrayValue(
          filters.departments,
          value as UserArrayFilterValueMap['departments'],
        ),
      }
    case 'countries':
      return {
        ...filters,
        countries: toggleArrayValue(
          filters.countries,
          value as UserArrayFilterValueMap['countries'],
        ),
      }
  }
}

export function getUserSortFromState(
  sorting: SortingState,
): Pick<UsersQuery, 'sortBy' | 'sortDir'> {
  if (sorting.length === 0) {
    return {
      sortBy: '',
      sortDir: 'asc',
    }
  }

  const nextSort = sorting[0]

  return {
    sortBy: nextSort.id as UsersQuery['sortBy'],
    sortDir: nextSort.desc ? 'desc' : 'asc',
  }
}
