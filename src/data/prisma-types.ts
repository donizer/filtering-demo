import type {
  Prisma as PrismaNamespace,
  User as PrismaUserRecordEntity,
  UserCountry as PrismaUserCountry,
  UserDepartment as PrismaUserDepartment,
  UserRole as PrismaUserRole,
  UserStatus as PrismaUserStatus,
} from '@prisma/client/index'

export type {
  PrismaUserCountry,
  PrismaUserDepartment,
  PrismaUserRecordEntity,
  PrismaUserRole,
  PrismaUserStatus,
}

export type PrismaUserWhereInput = PrismaNamespace.UserWhereInput
