import fs from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'

export const userRecordSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  role: z.string(),
  status: z.enum(['active', 'inactive']),
})

const usersSchema = z.array(userRecordSchema)

export type UserRecord = z.infer<typeof userRecordSchema>
export type UserStatusFilter = UserRecord['status'] | 'all'

export interface UsersQuery {
  page: number
  pageSize: number
  search?: string
  status: UserStatusFilter
}

export interface PaginatedUsersResult {
  items: UserRecord[]
  totalCount: number
  pageCount: number
  page: number
  pageSize: number
}

const DB_FILE_PATH = path.join(process.cwd(), 'src/data/db.json')

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export async function readDB() {
  await delay()
  const file = await fs.readFile(DB_FILE_PATH, 'utf-8')
  const parsed = JSON.parse(file)
  return usersSchema.parse(parsed)
}

export function filterUsers(
  users: UserRecord[],
  params: Pick<UsersQuery, 'search' | 'status'>
) {
  const normalizedSearch = params.search?.trim().toLowerCase()

  return users.filter((user) => {
    if (params.status !== 'all' && user.status !== params.status) {
      return false
    }

    if (!normalizedSearch) {
      return true
    }

    return [user.name, user.role, user.status]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch)
  })
}

export async function queryUsers(params: UsersQuery): Promise<PaginatedUsersResult> {
  const allUsers = await readDB()
  const filtered = filterUsers(allUsers, {
    search: params.search,
    status: params.status,
  })

  const safePageSize = Math.max(1, params.pageSize)
  const pageCount = Math.max(1, Math.ceil(filtered.length / safePageSize))
  const page = Math.min(Math.max(1, params.page), pageCount)
  const start = (page - 1) * safePageSize

  return {
    items: filtered.slice(start, start + safePageSize),
    totalCount: filtered.length,
    pageCount,
    page,
    pageSize: safePageSize,
  }
}
