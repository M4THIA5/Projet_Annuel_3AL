import { hash } from 'argon2'
import { PrismaClient as PostgresClient } from '../../prisma/client/postgresClient'
import { userRole } from '../config/utils'
import fs from 'fs'
import path from 'path'
import { User } from '../neo4j/neogma'

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
      otpVerified: true,
      otpCode: '123456',
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
      otpVerified: true,
      otpCode: '123456'
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
        otpVerified: true,
        otpCode: '123456',
      }
    })
  }

  const allUsers = await postgresql.user.findMany({
    select: {
      id: true,
      email: true
    }
  })

  await User.createMany(
    allUsers.map(user => ({
      userId: user.id,
      email: user.email
    }))
  )
  const friend1 = await User.findOne({ where: { userId: 1 } })
  const friend2 = await User.findOne({ where: { userId: 2 } })

  if (!friend1 || !friend2) {
    console.error('Friend not found')
    return
  }

  await friend1.relateTo({
    alias: "friends",
    properties: undefined,
    where: { userId: friend2.userId }
  })

  await friend2.relateTo({
    alias: "friends",
    properties: undefined,
    where: { userId: friend1.userId }
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
