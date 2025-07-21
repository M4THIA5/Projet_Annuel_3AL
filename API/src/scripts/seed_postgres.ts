import { PrismaClient as PostgresClient } from '../../prisma/client/postgresClient'
import { userRole } from '../config/utils'
import { hash } from 'argon2'
import fs from 'fs'
import path from 'path'

const postgresql = new PostgresClient()

export const seedPostgres = async () => {
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

  const usersPath = path.resolve(__dirname, './postgres_data/users.json')
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

  const neighborhoodsPath = path.resolve(__dirname, './postgres_data/neighborhoods.json')
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

  const userNeighborhoodsPath = path.resolve(__dirname, './postgres_data/userNeighborhoods.json')
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

  const sortiesPath = path.resolve(__dirname, './postgres_data/sorties.json')
  const sortiesData = JSON.parse(fs.readFileSync(sortiesPath, 'utf-8'))

  for (const sortie of sortiesData) {
    await postgresql.sortie.upsert({
      where: { id: sortie.id },
      update: {},
      create: {
        title: sortie.title,
        description: sortie.description,
        date: new Date(sortie.date),
        address: sortie.address,
        creatorId: sortie.creatorId,
        participants: {
          connect: sortie.participants.map((id: number) => ({ id }))
        },
      }
    })
  }

  const objetsPath = path.resolve(__dirname, './postgres_data/objets.json')
  const objetsData = JSON.parse(fs.readFileSync(objetsPath, 'utf-8'))

  for (const objet of objetsData) {
  const imagePath = path.resolve(__dirname, './postgres_data/', objet.image)
  const imageData = fs.readFileSync(imagePath, 'utf-8')
    await postgresql.objet.upsert({
      where: { id: objet.id },
      update: {},
      create: {
        nom: objet.nom,
        description: objet.description,
        userId: objet.userId,
        TrocId: objet.TrocId,
        image: imageData || null,
      }
    })
  }

  const roomsPath = path.resolve(__dirname, './postgres_data/rooms.json')
  const roomsData = JSON.parse(fs.readFileSync(roomsPath, 'utf-8'))

  for (const room of roomsData) {
    await postgresql.rooms.upsert({
      where: { id: room.id },
      update: {},
      create: {
        id: room.id,
        nom: room.nom,
        users: {
          connect: room.users.map((userId: number) => ({ id: userId }))
        }
      }
    })
  }

  console.log('PostgreSQL database seeded successfully.')
}