import {Request, RequestHandler, Response} from "express";
import {PrismaClient as MongoClient} from "../../prisma/client/mongoClient"
import {PrismaClient as PostgreClient} from "../../prisma/client/postgresClient"
import {idValidator} from "../validators/objets"
import {CurrentUser} from "../types";

const pgdb = new PostgreClient()
const db = new MongoClient()

export default class TrocController {
    getAll: RequestHandler = async (_: Request, res: Response) => {
        const trocEntries = await db.troc.findMany({where: {
            isOpen: true
            }})
        res.status(200).send(trocEntries)

    }
    getOne: RequestHandler = async (req: Request, res: Response) => {
        const Validator = idValidator.validate(req.query)
        if (Validator.error != undefined) {
            res.status(400).send(Validator.error.message)
            return
        }
        const id = Validator.value.id
        const trocEntries = await db.troc.findUniqueOrThrow({
            where: {
                id: id
            }
        })
        res.status(200).send(trocEntries)
    }
    create: RequestHandler = async (req: Request, res: Response) => {
        const user:CurrentUser = (req as any).user

        if (!user) {
            res.status(401).send("Unauthorized")
            return
        }
        const full = await pgdb.user.findUniqueOrThrow({
            where: {
                id: user.id
            }
        })
        if (!full){
            res.status(404).send("User not found")
            return
        }
        const t = await db.troc.findUnique({
            where: {
                id: user.id.toString()
            }
        })
        if (t) {
            res.status(403).send("Troc already exists for this user")
            return
        }
        await db.troc.create({
            data: {
                asker: full.firstName + " " + full.lastName,
                userId: full.id
            }
        })
        res.status(201).send("Ressource created")
    }
    modify: RequestHandler = async (req: Request, res: Response) => {
        const Validator = idValidator.validate(req.params)
        if (Validator.error != undefined) {
            res.status(400).send(Validator.error.message)
            return
        }
        const id = Validator.value.id
        await db.troc.update({
            where: {
                id: id
            },
            data: req.body
        })
        res.status(200).send("Resource modified successfully.")
    }
    delete: RequestHandler = async (req: Request, res: Response) => {
        const Validator = idValidator.validate(req.params)
        if (Validator.error != undefined) {
            res.status(400).send(Validator.error.message)
            return
        }
        const id = Validator.value.id
        await db.troc.delete({
            where: {
                id: id
            }
        })
        res.status(204).send()
    }

}
