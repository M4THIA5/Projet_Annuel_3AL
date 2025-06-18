import {NextFunction, Request, Response} from "express"
import {PrismaClient as PostgresClient} from "../../prisma/client/postgresClient"

const postgresClient = new PostgresClient()

class UserNeighborhoodController {
    // Link a user to a neighborhood
    linkUserToNeighborhood = async (req: Request, res: Response, next: NextFunction) => {
        const {userId, neighborhoodId, roleInArea} = req.body
        try {
            const link = await postgresClient.userNeighborhood.create({
                data: {
                    userId,
                    neighborhoodId,
                    roleInArea,
                },
            })
            res.status(201).json(link)
        } catch (error) {
            next(error)
        }
    }

    // Get all user-neighborhood links
    getAllUserNeighborhoods = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const links = await postgresClient.userNeighborhood.findMany({
                include: {user: true, neighborhood: true},
            })
            res.status(200).json(links)
        } catch (error) {
            next(error)
        }
    }

    getNeighborhoodsOfUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = Number(req.params.userId)

            if (isNaN(userId)) {
                res.status(400).json({error: 'Invalid userId'})
                return
            }

            const links = await postgresClient.userNeighborhood.findMany({
                where: {
                    userId: userId,
                },
                include: {
                    neighborhood: true,
                },
            })

            res.status(200).json(links)
        } catch (error) {
            next(error)
        }
    }

    getNearbyNeighborhoodsBasedOnUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const MAX_DISTANCE_KM = 10

        function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
            const R = 6371
            const dLat = (lat2 - lat1) * Math.PI / 180
            const dLon = (lon2 - lon1) * Math.PI / 180
            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) ** 2
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
            return R * c
        }

        try {
            const userId = Number(req.params.userId)
            const user = await postgresClient.user.findUnique({
                where: {id: userId},
                select: {latitude: true, longitude: true},
            })

            if (!user?.latitude || !user?.longitude) {
                res.status(400).json({message: 'User location is missing'})
                return
            }

            const userNeighborhoods = await postgresClient.userNeighborhood.findMany({
                where: {
                    userId: {not: userId},
                    user: {
                        latitude: {not: null},
                        longitude: {not: null},
                    },
                },
                include: {
                    user: true,
                    neighborhood: true,
                },
            })

            const neighborhoodsMap = new Map<number, typeof userNeighborhoods[0]['neighborhood']>()

            for (const link of userNeighborhoods) {
                const otherUser = link.user
                if (!otherUser.latitude || !otherUser.longitude) continue

                const distance = getDistanceFromLatLonInKm(
                    user.latitude,
                    user.longitude,
                    otherUser.latitude,
                    otherUser.longitude
                )

                if (distance <= MAX_DISTANCE_KM) {
                    neighborhoodsMap.set(link.neighborhood.id, link.neighborhood)
                }
            }

            const uniqueNeighborhoods = Array.from(neighborhoodsMap.values())

            res.status(200).json(uniqueNeighborhoods)
        } catch (error) {
            next(error)
        }
    }


    // Get users of a neighborhood
    getUsersOfNeighborhood = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const links = await postgresClient.userNeighborhood.findMany({
                where: {neighborhoodId: Number(req.params.neighborhoodId)},
                include: {user: true},
            })
            res.status(200).json(links)
        } catch (error) {
            next(error)
        }
    }

    // Remove a user from a neighborhood
    unlinkUserFromNeighborhood = async (req: Request, res: Response, next: NextFunction) => {
        const {userId, neighborhoodId} = req.body
        try {
            await postgresClient.userNeighborhood.deleteMany({
                where: {
                    userId: Number(userId),
                    neighborhoodId: Number(neighborhoodId),
                },
            })

            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }


}

export default UserNeighborhoodController
