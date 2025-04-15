const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const tat = await prisma.user.upsert({
        where: { email: 'user@test.fr' },
        update: {
            updatedAt: new Date(),
        },
        create: {
            email: 'user@test.fr',
            nom: 'Toto',
            prenom: 'Tata',
            color: 'bada55',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    })

    const adm = await prisma.user.upsert({
        where: { email: 'admin@test.fr' },
        update: {
            updatedAt: new Date(),
        },
        create: {
            email: 'admin@test.fr',
            nom: 'Name',
            prenom: 'admin',
            color: 'c0ffee',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    })

    const adminRole = await prisma.role.upsert({
        where: { nom: 'admin' },
        update: {
            updatedAt: new Date(),
        },
        create: {
            name: 'admin',
        },
    })

    const userRole = await prisma.role.upsert({
        where: { nom: 'user' },
        update: {
            updatedAt: new Date(),
        },
        create: {
            name: 'user',
        },
    })

    await prisma.userRole.upsert({
        where: {
            userId_roleId: {
                userId: adm.id,
                roleId: adminRole.id,
            },
        },
        update: {
        },
        create: {
            userId: adm.id,
            roleId: adminRole.id,
        },
    })
    console.log({ tat, adm , adminRole, userRole })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })