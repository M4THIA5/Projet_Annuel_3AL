import {PrismaClient} from './client'
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

async function main() {
    //data to create, exemple : users
    bcrypt.hash("admin", 10, async function (err, hash) {
        await prisma.user.upsert({
            where: {
                id: 1
            }, create: {
                email: "admin@admin.com",
                nom: "admin",
                prenom: "admin",
                password: hash
            }, update: {}
        })
    })
    bcrypt.hash("test", 10, async function (err, hash) {
        await prisma.user.upsert({
            where: {
                id: 2
            }, create: {
                email: "test@test.com",
                nom: "test",
                prenom: "test",
                password: hash
            }, update: {}
        })
    })
    bcrypt.hash("user", 10, async function (err, hash) {
        await prisma.user.upsert({
            where: {
                id: 3
            }, create: {
                email: "user@user.com",
                nom: "user",
                prenom: "user",
                password: hash
            }, update: {}
        })
    })

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
