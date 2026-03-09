import fs from 'node:fs/promises'
import path from 'node:path'

import { faker } from '@faker-js/faker'

const DB_FILE_PATH = path.join(process.cwd(), 'src/data/db.json')
const TOTAL_USERS = 2400

const roleProfiles = [
  {
    role: 'Developer',
    departments: ['Engineering'],
    salary: { min: 3200, max: 8600 },
    age: { min: 22, max: 47 },
  },
  {
    role: 'Data Analyst',
    departments: ['Analytics', 'Product'],
    salary: { min: 2200, max: 6200 },
    age: { min: 23, max: 45 },
  },
  {
    role: 'QA Engineer',
    departments: ['Engineering', 'Operations'],
    salary: { min: 1800, max: 5100 },
    age: { min: 22, max: 43 },
  },
  {
    role: 'Product Manager',
    departments: ['Product'],
    salary: { min: 3000, max: 7600 },
    age: { min: 27, max: 52 },
  },
  {
    role: 'DevOps',
    departments: ['Engineering', 'Operations'],
    salary: { min: 3400, max: 9000 },
    age: { min: 25, max: 49 },
  },
  {
    role: 'Designer',
    departments: ['Product'],
    salary: { min: 1900, max: 5400 },
    age: { min: 22, max: 44 },
  },
  {
    role: 'HR Manager',
    departments: ['People'],
    salary: { min: 1700, max: 4600 },
    age: { min: 25, max: 54 },
  },
  {
    role: 'Project Manager',
    departments: ['Operations', 'Product'],
    salary: { min: 2400, max: 6500 },
    age: { min: 26, max: 53 },
  },
]

const countries = [
  'Ukraine',
  'Poland',
  'Germany',
  'Spain',
  'Netherlands',
  'Canada',
]

function createUserRecord(id) {
  const profile = faker.helpers.arrayElement(roleProfiles)
  const joinedAt = faker.date.between({
    from: new Date('2017-01-01'),
    to: new Date(),
  })

  return {
    id,
    name: faker.person.fullName(),
    role: profile.role,
    department: faker.helpers.arrayElement(profile.departments),
    country: faker.helpers.arrayElement(countries),
    age: faker.number.int(profile.age),
    salary: faker.number.int(profile.salary),
    joinedAt: joinedAt.toISOString().slice(0, 10),
    status: faker.helpers.weightedArrayElement([
      { value: 'active', weight: 7 },
      { value: 'inactive', weight: 3 },
    ]),
  }
}

async function main() {
  const users = Array.from({ length: TOTAL_USERS }, (_, index) =>
    createUserRecord(index + 1),
  )

  await fs.writeFile(
    DB_FILE_PATH,
    `${JSON.stringify(users, null, 2)}\n`,
    'utf8',
  )
  console.log(`Generated ${users.length} demo users at ${DB_FILE_PATH}`)
}

main().catch((error) => {
  console.error('Failed to generate demo data')
  console.error(error)
  process.exitCode = 1
})
