import {PrismaClient as PostgresClient} from '../../prisma/client/postgresClient'
import {RequestHandler, Request, Response} from "express"
import {User} from '../types'
import { getUserFriends } from '../neo4j/neo-driver'
import { User as NeoUser, removeFriendRelation } from '../neo4j/neogma'
import { z } from "zod"

const postgresClient = new PostgresClient()

class UserController {
    createUser: RequestHandler = async (req: Request, res: Response, next) => {
        const data = req.body as User
        try {
            // Convert image string to Uint8Array if present, otherwise set to null
            let image: Uint8Array | null | undefined = undefined
            if (typeof data.image === 'string') {
                // If image is a base64 string, decode it
                try {
                    image = Buffer.from(data.image, 'base64')
                } catch {
                    image = undefined
                }
            } else if (data.image === undefined) {
                image = undefined
            } else {
                image = null
            }
            const user = await postgresClient.user.create({ data: { ...data, image } })
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
            const body = req.body as Partial<User>
            const updateUserSchema = z.object({
                firstName: z.string().optional(),
                lastName: z.string().optional(),
                address: z.string().optional(),
                city: z.string().optional(),
                postalCode: z.string().optional(),
                image: z.union([z.string(), z.instanceof(Buffer)]).optional(),
            })

            const parsed = updateUserSchema.safeParse(body)
            if (!parsed.success) {
                res.status(400).json({ error: "Invalid input", details: parsed.error.errors })
                return
            }
            const updateData = parsed.data

            // Convert image string to Uint8Array if present, ensure type compatibility
            let image: Uint8Array | null | undefined = undefined;
            if (typeof updateData.image === "string") {
                try {
                    image = Buffer.from(updateData.image, "base64");
                } catch {
                    image = undefined;
                }
            } else if (updateData.image instanceof Buffer || updateData.image instanceof Uint8Array) {
                image = new Uint8Array(updateData.image);
            } else if (updateData.image === undefined) {
                image = undefined;
            } else {
                image = null;
            }

            const data = {
                ...updateData,
                image,
            };
            const user = await postgresClient.user.update({
                where: {id: Number(req.params.id)},
                data,
            })

            res.status(200).json({id: user.id})
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
            const user = await postgresClient.user.findUnique({where: {email: email}, include: {userNeighborhoods: true, sortiesAttended:true }})
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
                neighborhoods: user.userNeighborhoods ,
                image: user.image,
                latitude: user.latitude,
                longitude: user.longitude,
                address: user.address,
                city: user.city,
                postalCode: user.postalCode,
                sorties: user.sortiesAttended,
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
                    lastName: true,
                    image: true
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
                    lastName: true,
                    image: true
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
                    lastName: true,
                    image: true
                }
            })

            res.status(200).json({
                friends: friends.map(friend => ({ ...friend, status: 'accepted' })),
                pending: pending.map(friend => ({ ...friend, status: 'pending' })),
                friend_requests: friendRequests.map(friend => ({ ...friend, status: 'requested' })),
            })
        } catch (error) {
            next(error)
        }
    }

    getFriendByEmail: RequestHandler = async (req: Request, res: Response, next) => {
        try {
            const currentUserId = (req as any).user.id;
            const user = await postgresClient.user.findUnique({ where: { email: req.params.email } });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            // Default status
            let status: 'none' | 'accepted' | 'pending' | 'requested' = 'none';

            // Get friend relationship status from Neo4j
            const currentNode = await NeoUser.findOne({ where: { userId: currentUserId } });
            const targetNode = await NeoUser.findOne({ where: { userId: user.id } });

            if (currentNode && targetNode) {
                // Get all friends, pending, and requests for current user
                const friendsNodes = await getUserFriends(currentUserId);

                if (friendsNodes.friends.some(f => f.userId === user.id)) {
                    status = 'accepted';
                } else if (friendsNodes.pending.some(f => f.userId === user.id)) {
                    status = 'pending';
                } else if (friendsNodes.friend_requests.some(f => f.userId === user.id)) {
                    status = 'requested';
                } else {
                    status = 'none';
                }
            }

            res.status(200).json({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                image: user.image,
                status,
            });
        } catch (error) {
            next(error);
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

    sendFriendRequest: RequestHandler = async (req: Request, res: Response, next) => {
        try {
            const userId = (req as any).user.id
            const friendId = Number(req.params.friendId)

            const userNode = await NeoUser.findOne({ where: { userId } })
            const friendNode = await NeoUser.findOne({ where: { userId: friendId } })

            if (!userNode || !friendNode) {
                res.status(404).json({ error: 'User or friend not found' })
                return
            }

            await userNode.relateTo({
                alias: "friends",
                properties: undefined,
                where: { userId: friendId }
            })

            res.status(200).json({ message: 'Friend request sent' })
        } catch (error) {
            next(error)
        }
    }

    acceptFriendRequest: RequestHandler = async (req: Request, res: Response, next) => {
        try {
            const userId = (req as any).user.id
            const friendId = Number(req.params.friendId)

            const userNode = await NeoUser.findOne({ where: { userId } })
            const friendNode = await NeoUser.findOne({ where: { userId: friendId } })

            if (!userNode || !friendNode) {
                res.status(404).json({ error: 'User or friend not found' })
                return
            }

            await friendNode.relateTo({
                alias: "friends",
                properties: undefined,
                where: { userId: userId }
            })

            res.status(200).json({ message: 'Friend request accepted' })
        } catch (error) {
            next(error)
        }
    }

    rejectFriendRequest: RequestHandler = async (req: Request, res: Response, next) => {
        try {
            const userId = (req as any).user.id as number
            const friendId = Number(req.params.friendId)

            const userNode = await NeoUser.findOne({ where: { userId } })
            const friendNode = await NeoUser.findOne({ where: { userId: friendId } })

            if (!userNode || !friendNode) {
                res.status(404).json({ error: 'User or friend not found' })
                return
            }

            await removeFriendRelation(friendId, userId)

            res.status(200).json({ message: 'Friend request rejected' })
        } catch (error) {
            next(error)
        }
    }

    removeFriend: RequestHandler = async (req: Request, res: Response, next) => {
        try {
            const userId = (req as any).user.id
            const friendId = Number(req.params.friendId)

            const userNode = await NeoUser.findOne({ where: { userId } })
            const friendNode = await NeoUser.findOne({ where: { userId: friendId } })

            if (!userNode || !friendNode) {
                res.status(404).json({ error: 'User or friend not found' })
                return
            }

            await removeFriendRelation(userId, friendId)
            await removeFriendRelation(friendId, userId) // Ensure bidirectional removal

            res.status(200).json({ message: 'Friend removed' })
        } catch (error) {
            next(error)
        }
    }

    cancelFriendRequest: RequestHandler = async (req: Request, res: Response, next) => {
        try {
            const userId = (req as any).user.id
            const friendId = Number(req.params.friendId)

            const userNode = await NeoUser.findOne({ where: { userId } })
            const friendNode = await NeoUser.findOne({ where: { userId: friendId } })

            if (!userNode || !friendNode) {
                res.status(404).json({ error: 'User or friend not found' })
                return
            }

            await removeFriendRelation(userId, friendId)

            res.status(200).json({ message: 'Friend request cancelled' })
        } catch (error) {
            next(error)
        }
    }


}

export default UserController
