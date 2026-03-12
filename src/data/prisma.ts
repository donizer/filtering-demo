import { createRequire } from 'node:module'

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import type { PrismaClient as GeneratedPrismaClient } from '@prisma/client/index'

const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client') as {
  PrismaClient: new (options: {
    adapter: PrismaBetterSqlite3
  }) => GeneratedPrismaClient
}

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: GeneratedPrismaClient
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
