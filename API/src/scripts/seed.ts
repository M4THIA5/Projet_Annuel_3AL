import { hash } from 'argon2'
import { PrismaClient as PostgresClient } from '../../prisma/client/postgresClient'
import { userRole } from '../config/utils'
import fs from 'fs'
import path from 'path'

const postgresql = new PostgresClient()

async function main() {
  const mathias = await postgresql.user.upsert({
    where: { email: 'mathias@admin.io' },
    update: {},
    create: {
      firstName: 'Mathias',
      lastName: 'Collas-Jourdan',
      email: 'mathias@admin.io',
      password: await hash('Azerty1234!'),
      roles: [ userRole.admin, userRole.classic ],
    }
  })

  const admin = await postgresql.user.upsert({
    where: { email: 'admin@admin.io' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'Admin',
      email: 'admin@admin.io',
      password: await hash('admin'),
      roles: [ userRole.admin, userRole.classic ],
    }
  })

  const usersPath = path.resolve(__dirname, './users.json')
  const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'))

  for (const user of usersData) {
    await postgresql.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: await hash(user.password),
        roles: user.roles,
      }
    })
  }
}



main()
  .then(async () => {
    await postgresql.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await postgresql.$disconnect()
    process.exit(1)
  })
