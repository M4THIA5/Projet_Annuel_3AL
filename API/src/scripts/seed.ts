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
      latitude: 48.9882, // Herblay
      longitude: 2.1576,
      address: '10 Rue de la République',
      city: 'Herblay',
      postalCode: '95220',
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
      otpCode: '123456',
      latitude: 48.8566, // Paris
      longitude: 2.3522,
      address: '1 Avenue des Champs-Élysées',
      city: 'Paris',
      postalCode: '75008',
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

  const neighborhoodsPath = path.resolve(__dirname, './neighborhoods.json')
  const neighborhoodsData = JSON.parse(fs.readFileSync(neighborhoodsPath, 'utf-8'))

  for (const neighborhood of neighborhoodsData) {
    await postgresql.neighborhood.upsert({
      where: { name: neighborhood.name },
      update: {},
      create: {
        name: neighborhood.name,
        city: neighborhood.city,
        postalCode: neighborhood.postalCode,
        description: neighborhood.description,
      }
    })
  }

  const userNeighborhoodsPath = path.resolve(__dirname, './userNeighborhoods.json')
  const userNeighborhoodsData = JSON.parse(fs.readFileSync(userNeighborhoodsPath, 'utf-8'))

  for (const userNeighborhood of userNeighborhoodsData) {
    const user = await postgresql.user.findUnique({
      where: { email: userNeighborhood.userEmail }
    })

    const neighborhood = await postgresql.neighborhood.findUnique({
      where: { name: userNeighborhood.neighborhoodName }
    })

    if (user && neighborhood) {
      // Find existing userNeighborhood by unique constraint (composite or id)
      const existingUserNeighborhood = await postgresql.userNeighborhood.findFirst({
        where: {
          userId: user.id,
          neighborhoodId: neighborhood.id
        }
      });

      await postgresql.userNeighborhood.upsert({
        where: existingUserNeighborhood
          ? { id: existingUserNeighborhood.id }
          : { id: -1 }, // -1 will never match, so create will be used
        update: {},
        create: {
          userId: user.id,
          neighborhoodId: neighborhood.id
        }
      })
    }
  }

  const copistesHerblayNeighborhood = await postgresql.neighborhood.findFirst({
    where: {
      name: 'Les Copistes',
      city: 'Herblay'
    }
  })

  if (mathias && copistesHerblayNeighborhood) {
    const existingRelation = await postgresql.userNeighborhood.findFirst({
      where: {
        userId: mathias.id,
        neighborhoodId: copistesHerblayNeighborhood.id
      }
    })

    if (!existingRelation) {
      await postgresql.userNeighborhood.create({
        data: {
          userId: mathias.id,
          neighborhoodId: copistesHerblayNeighborhood.id
        }
      })
    }
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
