import {PrismaClient} from '../../prisma/postgre/client'
import {RequestHandler, Request, Response} from "express"
import {UserCreated} from '../types'
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

class UserController {
    createUser: RequestHandler = async (req: Request, res: Response, next) => {
        const data = req.body as UserCreated
        if (!data.email || !data.password || !data.nom || !data.prenom) {
            res.status(400).json({error: 'Informations are missing'})
            return
        }
        try {
            bcrypt.hash(data.password, 10, async function (err, hash) {
                data.password = hash
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
            const userId = Number(req.params.id);

            // Supprimer toutes les relations UserNeighborhood associées à cet utilisateur
            await prisma.userNeighborhood.deleteMany({
                where: { userId },
            });

            // Supprimer l'utilisateur
            await prisma.user.delete({
                where: { id: userId },
            });

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

}

export default UserController
