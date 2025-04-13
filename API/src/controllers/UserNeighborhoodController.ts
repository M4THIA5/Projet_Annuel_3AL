import { PrismaClient } from '../../prisma/postgre/client';
import { RequestHandler, Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

class UserNeighborhoodController {
    // Link a user to a neighborhood
    linkUserToNeighborhood: RequestHandler = async (req, res, next) => {
        const { userId, neighborhoodId, roleInArea } = req.body;
        try {
            const link = await prisma.userNeighborhood.create({
                data: {
                    userId,
                    neighborhoodId,
                    roleInArea,
                },
            });
            res.status(201).json(link);
        } catch (error) {
            next(error);
        }
    };

    // Get all user-neighborhood links
    getAllUserNeighborhoods: RequestHandler = async (_req, res, next) => {
        try {
            const links = await prisma.userNeighborhood.findMany({
                include: { user: true, neighborhood: true },
            });
            res.status(200).json(links);
        } catch (error) {
            next(error);
        }
    };

    // Get neighborhoods of a user
    getNeighborhoodsOfUser: RequestHandler = async (req, res, next) => {
        try {
            const links = await prisma.userNeighborhood.findMany({
                where: { userId: Number(req.params.userId) },
                include: { neighborhood: true },
            });
            res.status(200).json(links);
        } catch (error) {
            next(error);
        }
    };

    // Get users of a neighborhood
    getUsersOfNeighborhood: RequestHandler = async (req, res, next) => {
        try {
            const links = await prisma.userNeighborhood.findMany({
                where: { neighborhoodId: Number(req.params.neighborhoodId) },
                include: { user: true },
            });
            res.status(200).json(links);
        } catch (error) {
            next(error);
        }
    };

    // Remove a user from a neighborhood
    unlinkUserFromNeighborhood: RequestHandler = async (req, res, next) => {
        const { userId, neighborhoodId } = req.body;
        try {
            await prisma.userNeighborhood.deleteMany({
                where: {
                    userId: Number(userId),
                    neighborhoodId: Number(neighborhoodId),
                },
            });

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

}

export default UserNeighborhoodController;
