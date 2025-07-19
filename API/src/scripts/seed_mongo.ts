import { PrismaClient as MongoClient } from '../../prisma/client/mongoClient'
import fs from 'fs'
import path from 'path'

const mongo = new MongoClient()

export const seedMongo = async () => {
  const datasPath = path.join(__dirname, 'mongo_data/datas.json')
  const datas = JSON.parse(fs.readFileSync(datasPath, 'utf-8'))
  
  for (const data of datas) {
    await mongo.data.create({
      data: { data: data.data },
    })
  }

  const journalEntriesPath = path.join(__dirname, 'mongo_data/journalEntries.json')
  const journalEntries = JSON.parse(fs.readFileSync(journalEntriesPath, 'utf-8'))

  for (const entry of journalEntries) {
    await mongo.journalEntry.create({
      data: {
        types: entry.types,
        content: entry.content,
        districtId: entry.districtId,
      },
    })
  }

  const messagesPath = path.join(__dirname, 'mongo_data/messages.json')
  const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'))

  for (const message of messages) {
    await mongo.message.create({
      data: {
        id: message.id, // It isn't the message Id
        name: message.name,
        socketID: message.socketID,
        text: message.text,
        createdAt: new Date(message.createdAt),
        room: message.room,
      },
    })
  }

  const trocsPath = path.join(__dirname, 'mongo_data/trocs.json')
  const trocs = JSON.parse(fs.readFileSync(trocsPath, 'utf-8'))

  for (const troc of trocs) {
    await mongo.troc.create({
      data: {
        asker: troc.asker,
        description: troc.description,
        userId: troc.userId,
        helperId: troc.helperId ?? null,
        createdAt: new Date(troc.createdAt),
        needsConfirmation: troc.needsConfirmation ?? false,
        isOpen: troc.isOpen ?? true,
        isDone: troc.isDone ?? false,
      },
    })
  }

  const postsPath = path.join(__dirname, 'mongo_data/posts.json')
  const posts = JSON.parse(fs.readFileSync(postsPath, 'utf-8'))

  for (const post of posts) {
    await mongo.post.create({
      data: {
        userId: String(post.userId),
        neighborhoodId: post.neighborhoodId,
        content: post.content,
        type: post.type,
        createdAt: new Date(post.createdAt),
        updatedAt: post.updatedAt ? new Date(post.updatedAt) : null,
        images: post.images,
      },
    })
  }

  console.log('MongoDB seeded successfully')
}