import {Request, RequestHandler, Response} from "express";
import {PrismaClient as MongoClient} from "../../prisma/client/mongoClient"
import {createValidator, idValidator, updateValidator} from "../validators/Journalentry";


const db = new MongoClient()

export default class JournalController {
    getAll: RequestHandler = async (_: Request, res: Response) => {
        const journalEntries = await db.journalEntry.findMany()
        res.status(200).send(journalEntries)

    }
    getOne: RequestHandler = async (req: Request, res: Response) => {
        const Validator = idValidator.validate(req.params)
        if (Validator.error != undefined) {
            console.log("qsd")
            res.status(400).send(Validator.error.message)
            return
        }
        const id = Validator.value.id
        console.log(id)
        const journalEntries = await db.journalEntry.findUniqueOrThrow({
            where: {
                id: id
            }
        })
        res.status(200).send(journalEntries)
    }
    create: RequestHandler = async (req: Request, res: Response) => {
        const validator = createValidator.validate(req.body)
        if (validator.error != undefined) {
            res.status(400).send(validator.error.message)
            return
        }
        await db.journalEntry.create({
            data: {
                ...validator.value,
                createdAt: new Date(),
            },
        });
        res.status(201).send("Ressource created")
    }
    modify: RequestHandler = async (req: Request, res: Response) => {
        const validator = updateValidator.validate(req.body)
        if (validator.error != undefined) {
            res.status(400).send(validator.error.message)
            return
        }
        const Validator = idValidator.validate(req.params)
        if (Validator.error != undefined) {
            res.status(409).send(Validator.error.message)
            return
        }
        const id = Validator.value.id
        let journalEntries: {
            id?: string,
            types: string[],
            content: string,
            districtId: number,
        }
        try {
            journalEntries = await db.journalEntry.findUniqueOrThrow({
                where: {
                    id: id
                }
            })
        } catch (e) {
            res.status(404).send("Resource not found")
            return
        }
        journalEntries.content = validator.value.content ? validator.value.content : journalEntries.content
        journalEntries.types = validator.value.types ? validator.value.types : journalEntries.types
        journalEntries.districtId = validator.value.districtId ? validator.value.districtId : journalEntries.districtId
        delete journalEntries.id
        await db.journalEntry.update({
            where: {
                id: id
            },
            data: journalEntries
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
        await db.journalEntry.delete({
            where: {
                id: id
            }
        })
        res.status(204).send()
    }

}
