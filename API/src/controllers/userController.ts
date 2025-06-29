import {PrismaClient as PostgresClient} from '../../prisma/client/postgresClient'
import {RequestHandler, Request, Response} from "express"
import {User} from '../types'
import { getUserFriends } from '../neo4j/neo-driver'
import { User as NeoUser } from '../neo4j/neogma'

const postgresClient = new PostgresClient()

class UserController {
    createUser: RequestHandler = async (req: Request, res: Response, next) => {
        const data = req.body as User
        try {
            const user = await postgresClient.user.create({data})
            res.status(201).json(user)
        } catch (error) {
            next(error)
        }
    }

    getAllUsers: RequestHandler = async (req: Request, res: Response, next) => {
        try {
            const {page = 1, pageSize = 10, ...filters} = req.query

            const pageNumber = Number(page)
            const pageSizeNumber = Number(pageSize)

            const where: any = {}
            if (filters.firstName) {
                where.firstName = {contains: String(filters.firstName), mode: 'insensitive'}
            }
            if (filters.lastName) {
                where.lastName = {contains: String(filters.lastName), mode: 'insensitive'}
            }
            if (filters.email) {
                where.email = {contains: String(filters.email), mode: 'insensitive'}
            }
            const [users, total] = await Promise.all([
                postgresClient.user.findMany({
                    where,
                    skip: Math.max(0, (pageNumber - 1) * pageSizeNumber),
                    take: pageSizeNumber,
                }),
                postgresClient.user.count({where}),
            ])

            res.status(200).json({
                users,
                total,
                page: pageNumber,
                pageSize: pageSizeNumber,
                totalPages: Math.ceil(total / pageSizeNumber),
            })
        } catch (error) {
            next(error)
        }
    }

    getUser: RequestHandler = async (req: Request, res: Response, next) => {
        try {
            const user = await postgresClient.user.findUnique({where: {id: Number(req.params.id)}})
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
            const user = await postgresClient.user.update({
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
            await postgresClient.user.delete({where: {id: Number(req.params.id)}})
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }

    me: RequestHandler = async (req: Request, res: Response, next) => {
        try {
            const {email} = (req as any).user
            const user = await postgresClient.user.findUnique({where: {email: email}})
            if (!user) {
                res.status(404).json({error: 'User not found'})
                return
            }
            res.status(200).json({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                roles: user.roles,
            })
        } catch (error) {
            next(error)
        }
    }

    getFriends: RequestHandler = async (req: Request, res: Response, next) => {
        try {
            const userId = (req as any).user.id
            const friendsNodes = await getUserFriends(userId)

            const friends = await postgresClient.user.findMany({
                where: {
                    id: {
                        in: friendsNodes.friends.map(friendNode => friendNode.userId)
                    }
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            })

            const pending = await postgresClient.user.findMany({
                where: {
                    id: {
                        in: friendsNodes.pending.map(friendNode => friendNode.userId)
                    }
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            })

            const friendRequests = await postgresClient.user.findMany({
                where: {
                    id: {
                        in: friendsNodes.friend_requests.map(friendNode => friendNode.userId)
                    }
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            })

            res.status(200).json({
                friends,
                pending,
                friend_requests: friendRequests
            })
        } catch (error) {
            next(error)
        }
    }

    addFriend: RequestHandler = async (req: Request, res: Response, next) => {
        try {
            const userId = (req as any).user.id
            const friendId = Number(req.params.friendId)

            const node = await NeoUser.findOne({where: {userId: userId}})
            const friendNode = await NeoUser.findOne({where: {userId: friendId}})

            if (!node || !friendNode) {
                res.status(404).json({error: 'User or friend not found'})
                return
            }

            node.relateTo({
                alias: "friends",
                properties: undefined,
                where: {userId: friendId}
            })

            res.status(200).json({message: 'Friend added successfully'})
        } catch (error) {
            next(error)
        }
    }


}

export default UserController
