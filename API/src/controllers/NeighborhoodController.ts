import { PrismaClient } from '../../prisma/postgres/client'
import { RequestHandler } from 'express'

const prisma = new PrismaClient()

class NeighborhoodController {
    // Create a new neighborhood
    createNeighborhood: RequestHandler = async (req, res, next) => {
        try {
            const neighborhood = await prisma.neighborhood.create({
                data: req.body,
            })
            res.status(201).json(neighborhood)
        } catch (error) {
            next(error)
        }
    }

    // Get all neighborhoods
    getAllNeighborhoods: RequestHandler = async (_req, res, next) => {
        try {
            const neighborhoods = await prisma.neighborhood.findMany()
            res.status(200).json(neighborhoods)
        } catch (error) {
            next(error)
        }
    }

    // Get one neighborhood by ID
    // @ts-expect-error requestHandler
    getNeighborhood: RequestHandler = async (req, res, next) => {
        try {
            const neighborhood = await prisma.neighborhood.findUnique({
                where: { id: Number(req.params.id) },
            })
            if (!neighborhood) {
                return res.status(404).json({ error: 'Neighborhood not found' })
            }
            res.status(200).json(neighborhood)
        } catch (error) {
            next(error)
        }
    }

    // Update a neighborhood
    updateNeighborhood: RequestHandler = async (req, res, next) => {
        try {
            const updated = await prisma.neighborhood.update({
                where: { id: Number(req.params.id) },
                data: req.body,
            })
            res.status(200).json(updated)
        } catch (error) {
            next(error)
        }
    }

    // Delete a neighborhood
    deleteNeighborhood: RequestHandler = async (req, res, next) => {
        try {
            const neighborhoodId = Number(req.params.id)

            // Supprimer toutes les relations UserNeighborhood liées à ce quartier
            await prisma.userNeighborhood.deleteMany({
                where: { neighborhoodId },
            })

            // Supprimer le quartier
            await prisma.neighborhood.delete({
                where: { id: neighborhoodId },
            })

            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }

}

export default NeighborhoodController
