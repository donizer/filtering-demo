import type { UserFilters, UserRecord } from '#/data/user-model'
import type {
  PrismaUserRecordEntity,
  PrismaUserWhereInput,
} from '#/data/prisma'

function parseOptionalInteger(value: string) {
  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : undefined
}

function parseOptionalDate(value: string, boundary: 'start' | 'end') {
  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  const parsed = Date.parse(trimmed)

  if (Number.isNaN(parsed)) {
    return undefined
  }

  return new Date(
    boundary === 'start'
      ? `${trimmed}T00:00:00.000Z`
      : `${trimmed}T23:59:59.999Z`,
  )
}

export function mapPrismaUserRecord(user: PrismaUserRecordEntity): UserRecord {
  return {
    id: user.id,
    name: user.name,
    role: user.role as UserRecord['role'],
    department: user.department as UserRecord['department'],
    country: user.country as UserRecord['country'],
    age: user.age,
    salary: user.salary,
    joinedAt: user.joinedAt.toISOString().slice(0, 10),
    status: user.status as UserRecord['status'],
  }
}

export function buildStructuredUserWhere(
  filters: UserFilters,
): PrismaUserWhereInput {
  const exactId = parseOptionalInteger(filters.id)
  const ageMin = parseOptionalInteger(filters.ageMin)
  const ageMax = parseOptionalInteger(filters.ageMax)
  const salaryMin = parseOptionalInteger(filters.salaryMin)
  const salaryMax = parseOptionalInteger(filters.salaryMax)
  const joinedFrom = parseOptionalDate(filters.joinedFrom, 'start')
  const joinedTo = parseOptionalDate(filters.joinedTo, 'end')
  const conditions: PrismaUserWhereInput[] = []

  if (exactId !== undefined) {
    conditions.push({ id: exactId })
  }

  if (filters.status !== 'all') {
    conditions.push({ status: filters.status })
  }

  if (filters.roles.length > 0) {
    conditions.push({
      role: {
        in: [...filters.roles],
      },
    })
  }

  if (filters.departments.length > 0) {
    conditions.push({
      department: {
        in: [...filters.departments],
      },
    })
  }

  if (filters.countries.length > 0) {
    conditions.push({
      country: {
        in: [...filters.countries],
      },
    })
  }

  if (ageMin !== undefined || ageMax !== undefined) {
    conditions.push({
      age: {
        gte: ageMin,
        lte: ageMax,
      },
    })
  }

  if (salaryMin !== undefined || salaryMax !== undefined) {
    conditions.push({
      salary: {
        gte: salaryMin,
        lte: salaryMax,
      },
    })
  }

  if (joinedFrom !== undefined || joinedTo !== undefined) {
    conditions.push({
      joinedAt: {
        gte: joinedFrom,
        lte: joinedTo,
      },
    })
  }

  if (conditions.length === 0) {
    return {}
  }

  return { AND: conditions }
}
