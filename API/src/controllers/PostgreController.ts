import { PrismaClient } from '../../prisma/postgre/client'
import { RequestHandler, Request, Response } from "express"
import { Data } from '../types'

const prisma = new PrismaClient()

class PostgreController {
    createUser: RequestHandler = async (req: Request, res: Response, next) => {
        const data = req.body as Data
        try {
        const user = await prisma.data.create({ data })
        res.status(201).json(user)
        } catch (error) {
        next(error)
        }
    }

    getData: RequestHandler = async (req: Request, res: Response, next) => {
        try {
        const users = await prisma.data.findMany()
        res.status(200).json(users)
        } catch (error) {
        next(error)
        }
    }
}
export default PostgreController
