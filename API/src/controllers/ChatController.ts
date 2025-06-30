import {Request, RequestHandler, Response} from "express";
import {PrismaClient as MongoClient} from "../../prisma/client/mongoClient"
import {PrismaClient as PostGreClient} from "../../prisma/client/postgresClient"
import {createGroupValidator} from "../validators/chat";

const mdb = new MongoClient()
const pdb = new PostGreClient()

export default class ChatController {
    createGroupChat: RequestHandler = async (req: Request, res: Response) => {
        const validator = createGroupValidator.validate(req.body)
        if (validator.error) {
            res.status(400).send({"error": validator.error.message})
            return
        }
        await pdb.rooms.create({
            data:{
                nom:validator.value.name,
                users:{
                    connect:validator.value.users.map((id: string) => ({ id: Number(id) }))
                }
            }
        })
        res.status(204).send()
    }
    getUserGroups: RequestHandler = async (req: Request, res: Response) => {
        const user = (req as any).user
        const rooms = await pdb.user.findUnique({
                where: {
                    id: user.id
                }, select: {
                    rooms: true
                }
            }
        )
        res.status(200).send(rooms)
    }
    getAllChatUsers: RequestHandler = async (req: Request, res: Response) => {
        const users = await pdb.user.findMany({
                select: {
                    firstName: true,
                    lastName: true,
                    id: true
                }
            }
        )
        const finalArray = []
        for (const elem of users) {
            finalArray.push({id: elem.id, name: `${elem.firstName} ${elem.lastName}`})
        }
        res.status(200).send(finalArray)
    }
    deletechat: RequestHandler = async (req: Request, res: Response) => {

    }
}