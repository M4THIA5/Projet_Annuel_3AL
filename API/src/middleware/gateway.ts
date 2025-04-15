
import { PrismaClient as PostGrePrismaClient } from '@prisma/client'
import { PrismaClient as SqlitePrismaClient } from '../../prisma/sqlite/client/sqlite'

declare global {
    var postGrePrisma: PostGrePrismaClient | undefined
    var sqlitePrisma: SqlitePrismaClient | undefined
}

const postGreClient = globalThis.postGrePrisma || new PostGrePrismaClient()
const sqliteClient = globalThis.sqlitePrisma || new SqlitePrismaClient()

// Next.js hot reloading can cause issues with Prisma, so we store the clients globally.
if (process.env.NODE_ENV !== 'production') {
    globalThis.postGrePrisma = postGreClient
    globalThis.sqlitePrisma = sqliteClient
}

export { postGreClient, sqliteClient }
export default postGrePrisma
