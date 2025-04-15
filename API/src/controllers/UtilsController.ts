import {PrismaClient as PostGre} from '../../prisma/postgre/client'
import {RequestHandler, Request, Response} from "express"
import {Credentials} from '../types'
import UserController from "./userController"
import bcrypt from 'bcrypt'


const prisma = new PostGre()

class UtilsController {
    login: RequestHandler = async (req: Request, res: Response) => {
        const credentials = req.body as Credentials
        if (!credentials.email || !credentials.password) {
            res.status(400).json({error: 'Informations are missing'})
            return
        }
        try {
            const user = await prisma.user.findUnique(
                {where: {email: credentials.email}, select: {id: true, email: true, password: true}}
            )
            if (!user) {
                res.status(401).json("Invalid credentials")
                return
            }
            bcrypt.compare(credentials.password, user.password, function (err: Error | undefined, result) {
                if (!result) {
                    res.status(401).json("Invalid credentials")
                    return
                }
                res.status(200).json({message: "ok", id: user.id, username: user.email})
            })
        } catch (e) {
            res.status(500).json("An error has occured. Please try again later.")
            console.log(e)
        }
    }
    register: RequestHandler = async (req: Request, res: Response, next) => {
        try {
            const email: string = req.body.email
            if (email === "") {
                res.status(400).json("Bad request")
            }
            const user = await prisma.user.findUnique({
                where:
                    {
                        email: email
                    }
            })
            if (user) {
                res.status(401).json("User with this email already exists")
                return
            }
        } catch (e) {
            res.status(500).json("An error has occured while trying to parse the email.")
            console.log(e)
            return
        }
        const userController = new UserController()

        await userController.createUser(req, res, next)
    }
    home: RequestHandler = (_req: Request, res: Response): void => {
        res.status(200).json({message: "Hello World !"})
    }
    healthCheck: RequestHandler = (_req: Request, res: Response): void => {
        res.status(200).json({message: "Server is up and running !"})
    }
}

export default UtilsController
