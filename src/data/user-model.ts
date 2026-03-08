import { z } from 'zod'

export const USER_ROLES = [
  'Developer',
  'Data Analyst',
  'QA Engineer',
  'Product Manager',
  'DevOps',
  'Designer',
  'HR Manager',
  'Project Manager',
] as const

export const USER_DEPARTMENTS = [
  'Engineering',
  'Analytics',
  'Product',
  'Operations',
  'People',
] as const

export const USER_COUNTRIES = [
  'Ukraine',
  'Poland',
  'Germany',
  'Spain',
  'Netherlands',
  'Canada',
] as const

export const USER_STATUSES = ['active', 'inactive'] as const
export const USER_STATUS_FILTERS = ['all', ...USER_STATUSES] as const

export const userRecordSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  role: z.enum(USER_ROLES),
  department: z.enum(USER_DEPARTMENTS),
  country: z.enum(USER_COUNTRIES),
  age: z.number().int().min(18).max(70),
  salary: z.number().int().min(400).max(25000),
  joinedAt: z.string().date(),
  status: z.enum(USER_STATUSES),
})

export const usersSchema = z.array(userRecordSchema)

export const userFiltersSchema = z.object({
  global: z.string().trim().default(''),
  id: z.string().trim().default(''),
  name: z.string().trim().default(''),
  roles: z.array(z.enum(USER_ROLES)).default([]),
  departments: z.array(z.enum(USER_DEPARTMENTS)).default([]),
  countries: z.array(z.enum(USER_COUNTRIES)).default([]),
  status: z.enum(USER_STATUS_FILTERS).default('all'),
  ageMin: z.string().trim().default(''),
  ageMax: z.string().trim().default(''),
  salaryMin: z.string().trim().default(''),
  salaryMax: z.string().trim().default(''),
  joinedFrom: z.string().trim().default(''),
  joinedTo: z.string().trim().default(''),
})

export const usersQuerySchema = userFiltersSchema.extend({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
})

export type UserRecord = z.infer<typeof userRecordSchema>
export type UserFilters = z.infer<typeof userFiltersSchema>
export type UsersQuery = z.infer<typeof usersQuerySchema>
export type UserRole = UserRecord['role']
export type UserDepartment = UserRecord['department']
export type UserCountry = UserRecord['country']
export type UserStatus = UserRecord['status']
export type UserStatusFilter = UserFilters['status']

export const EMPTY_USER_FILTERS: UserFilters = {
  global: '',
  id: '',
  name: '',
  roles: [],
  departments: [],
  countries: [],
  status: 'all',
  ageMin: '',
  ageMax: '',
  salaryMin: '',
  salaryMax: '',
  joinedFrom: '',
  joinedTo: '',
}
