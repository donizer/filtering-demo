import fs from 'node:fs/promises'
import path from 'node:path'

import { buildUserFacets, filterUsers } from '#/data/user-filters'
import { usersSchema } from '#/data/user-model'
import type { UserRecord, UsersQuery } from '#/data/user-model'

export type { UserRecord, UsersQuery } from '#/data/user-model'

export interface PaginatedUsersResult {
  items: UserRecord[]
  totalCount: number
  datasetCount: number
  pageCount: number
  page: number
  pageSize: number
  facets: ReturnType<typeof buildUserFacets>
}

const DB_FILE_PATH = path.join(process.cwd(), 'src/data/db.json')

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export async function readDB() {
  await delay()
  const file = await fs.readFile(DB_FILE_PATH, 'utf-8')
  const parsed = JSON.parse(file)
  return usersSchema.parse(parsed)
}

export async function queryUsers(
  params: UsersQuery,
): Promise<PaginatedUsersResult> {
  const allUsers = await readDB()
  const filtered = filterUsers(allUsers, params)
  const facets = buildUserFacets(allUsers, params)

  const safePageSize = Math.max(1, params.pageSize)
  const pageCount = Math.max(1, Math.ceil(filtered.length / safePageSize))
  const page = Math.min(Math.max(1, params.page), pageCount)
  const start = (page - 1) * safePageSize

  return {
    items: filtered.slice(start, start + safePageSize),
    totalCount: filtered.length,
    datasetCount: allUsers.length,
    pageCount,
    page,
    pageSize: safePageSize,
    facets,
  }
}
