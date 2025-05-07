import { hash } from 'argon2'
import { PrismaClient as PostgresClient } from '../../prisma/client/postgresClient'
import { userRole } from '../config/utils'

const postgresql = new PostgresClient()

async function main() {
  const mathias = await postgresql.user.upsert({
    where: { email: 'mathias@admin.io' },
    update: {},
    create: {
      firstName: 'Mathias',
      lastName: 'Collas-Jourdan',
      email: 'mathias@admin.io',
      password: await hash('admin'),
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
