import { NextFunction, Request, Response } from "express"
import { PrismaClient as PostgresClient } from "../../prisma/client/postgresClient"

const postgresClient = new PostgresClient()

class UserNeighborhoodController {
  // Link a user to a neighborhood
  linkUserToNeighborhood = async (req:Request, res: Response, next: NextFunction) => {
      const { userId, neighborhoodId, roleInArea } = req.body
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
  getAllUserNeighborhoods = async (req:Request, res: Response, next: NextFunction) => {
      try {
          const links = await postgresClient.userNeighborhood.findMany({
              include: { user: true, neighborhood: true },
          })
          res.status(200).json(links)
      } catch (error) {
          next(error)
      }
  }

  // Get neighborhoods of a user
  getNeighborhoodsOfUser = async (req:Request, res: Response, next: NextFunction) => {
      try {
          const links = await postgresClient.userNeighborhood.findMany({
              where: { userId: Number(req.params.userId) },
              include: { neighborhood: true },
          })
          res.status(200).json(links)
      } catch (error) {
          next(error)
      }
  }

  // Get users of a neighborhood
  getUsersOfNeighborhood = async (req:Request, res: Response, next: NextFunction) => {
      try {
          const links = await postgresClient.userNeighborhood.findMany({
              where: { neighborhoodId: Number(req.params.neighborhoodId) },
              include: { user: true },
          })
          res.status(200).json(links)
      } catch (error) {
          next(error)
      }
  }

  // Remove a user from a neighborhood
  unlinkUserFromNeighborhood = async (req:Request, res: Response, next: NextFunction) => {
      const { userId, neighborhoodId } = req.body
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