import { createRequire } from 'node:module'

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

export interface PrismaUserRecordEntity {
  id: number
  name: string
  role: string
  department: string
  country: string
  age: number
  salary: number
  joinedAt: Date
  status: string
}

export type PrismaUserWhereInput = Record<string, unknown>

interface PrismaUserDelegate {
  findMany(args?: {
    where?: PrismaUserWhereInput
    orderBy?: {
      id: 'asc' | 'desc'
    }
  }): Promise<PrismaUserRecordEntity[]>
  count(): Promise<number>
  deleteMany(): Promise<unknown>
  createMany(args: { data: PrismaUserRecordEntity[] }): Promise<unknown>
}

interface PrismaClientLike {
  user: PrismaUserDelegate
}

const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client') as {
  PrismaClient: new (options: {
    adapter: PrismaBetterSqlite3
  }) => PrismaClientLike
}

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClientLike
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
    }),
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
