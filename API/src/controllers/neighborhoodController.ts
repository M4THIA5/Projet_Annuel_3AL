import { NextFunction, Request, Response } from "express"
import { PrismaClient as PostgresClient } from "../../prisma/client/postgresClient"
import multer from "multer";
import path from "path";
import fs from "fs";

const postgresClient = new PostgresClient()

class NeighborhoodController {
    // Create a new neighborhood
    createNeighborhood = async (req:Request, res: Response, next: NextFunction) => {
        try {
            const neighborhood = await postgresClient.neighborhood.create({
                data: req.body,
            })
            res.status(201).json(neighborhood)
        } catch (error) {
            next(error)
        }
    }

    // Get all neighborhoods
    getAllNeighborhoods = async (req:Request, res: Response, next: NextFunction) => {
        try {
            const neighborhoods = await postgresClient.neighborhood.findMany()
            res.status(200).json(neighborhoods)
        } catch (error) {
            next(error)
        }
    }

    // Get one neighborhood by ID
    getNeighborhood = async (req:Request, res: Response, next: NextFunction) => {
        try {
            const neighborhood = await postgresClient.neighborhood.findUnique({
                where: { id: Number(req.params.id) },
            })
            if (!neighborhood) {
                res.status(404).json({ error: 'Neighborhood not found' })
                return
            }
            res.status(200).json(neighborhood)
        } catch (error) {
            next(error)
        }
    }

    // Update a neighborhood
    updateNeighborhood = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const body = req.body;
            const file = req.file

            const data: any = {
                ...body,
            };

            if (file) {
                const fileBuffer = fs.readFileSync(file.path);
                const base64 = fileBuffer.toString('base64');
                const mimeType = file.mimetype;
                data.image = `data:${mimeType};base64,${base64}`;
            }

            const updated = await postgresClient.neighborhood.update({
                where: { id: Number(req.params.id) },
                data,
            });

            res.status(200).json(updated);
        } catch (error) {
            next(error);
        }
    }

    // Delete a neighborhood
    deleteNeighborhood = async (req:Request, res: Response, next: NextFunction) => {
        try {
            const neighborhoodId = Number(req.params.id)

            // Supprimer toutes les relations UserNeighborhood liées à ce quartier
            await postgresClient.userNeighborhood.deleteMany({
                where: { neighborhoodId },
            })

            // Supprimer le quartier
            await postgresClient.neighborhood.delete({
                where: { id: neighborhoodId },
            })

            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }

}

export default NeighborhoodController
