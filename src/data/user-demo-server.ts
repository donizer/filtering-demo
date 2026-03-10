import { createServerFn } from '@tanstack/react-start'

import { usersQuerySchema } from '#/data/user-model'
import type { UsersQuery } from '#/data/user-model'

export const fetchAllUsers = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { readDB } = await import('#/data/db-utils')
    return readDB()
  },
)

export const fetchUsersPaginated = createServerFn({ method: 'GET' })
  .inputValidator(usersQuerySchema)
  .handler(async ({ data }) => {
    const { queryUsers } = await import('#/data/db-utils')
    return queryUsers(data)
  })

export function usersQueryOptions(params: UsersQuery) {
  return {
    queryKey: ['users', params] as const,
    queryFn: () => fetchUsersPaginated({ data: params }),
  }
}
