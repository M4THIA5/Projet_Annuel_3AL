import {PrismaClient} from '../../prisma/postgre/client'
import {RequestHandler, Request, Response, NextFunction} from "express"
import {UserCreated} from '../types'
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

class UserController {
    createUser: RequestHandler = async (req: Request, res: Response, next) => {
        let data = req.body as UserCreated
        if (!data.email || !data.password || !data.nom || !data.prenom) {
            res.status(400).json({error: 'Informations are missing'})
            return
        }
        try {
            bcrypt.hash(data.password, 10, async function (err, hash) {
                data.password = hash;
                const user = await prisma.user.create({data})
                res.status(201).json(user)
            })
        } catch (error) {
            next(error)
        }
    }

    getAllUsers: RequestHandler = async (req: Request, res: Response, next) => {
        try {
            const users = await prisma.user.findMany()
            res.status(200).json(users)
        } catch (error) {
            next(error)
        }
    }

    getUser: RequestHandler = async (req: Request, res: Response, next) => {
        try {
            const user = await prisma.user.findUnique({
                where: {id: Number(req.params.id)},
                select: {
                    id: true,
                    email: true,
                    nom: true,
                    prenom: true,
                    color: true,
                }
            })
            if (!user) {
                res.status(404).json({error: 'User not found'})
            }
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }


    updateUser: RequestHandler = async (req: Request, res: Response, next) => {
        try {
            const user = await prisma.user.update({
                where: {id: Number(req.params.id)},
                data: req.body,
            })
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    deleteUser: RequestHandler = async (req: Request, res: Response, next) => {
        try {
            await prisma.user.delete({where: {id: Number(req.params.id)}})
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}

export default UserController
