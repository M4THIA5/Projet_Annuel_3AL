import { PrismaClient as PostgresClient } from '../../prisma/client/postgresClient'
import { PrismaClient as MongoClient } from '../../prisma/client/mongoClient'
import { User } from '../neo4j/neogma'
import { seedMongo } from './seed_mongo'
import { seedPostgres } from './seed_postgres'

const postgresql = new PostgresClient()
const mongo = new MongoClient()

async function main() {
  await seedPostgres()
  await seedMongo()

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
    await mongo.$disconnect()
    process.exit(0)
  })
  .catch(async (e) => {
    console.error(e)
    await postgresql.$disconnect()
    process.exit(1)
  })
