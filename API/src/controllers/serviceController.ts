import {RequestHandler, Request, Response} from "express";
import {PrismaClient as PostgresClient} from "../../prisma/client/postgresClient";

const postgresClient = new PostgresClient();

export default class ServiceController {
    getAllServices: RequestHandler = async (req: Request, res: Response) => {
        try {
            const services = await postgresClient.service.findMany();
            res.status(200).json(services);
        } catch (error) {
            console.error("Error fetching services:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }
    getAvailableServices: RequestHandler = async (req: Request, res: Response) => {
        try {
            const services = await postgresClient.service.findMany({
                where:{OR:[
                        {provider: undefined},
                        {providerId: null},
                        {provider: null},
                        {providerId: undefined},
                    ]
                }
            });
            res.status(200).json(services);
        } catch (error) {
            console.error("Error fetching services:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }
    getServiceById: RequestHandler = async (req: Request, res: Response) => {
        const {id} = req.params;
        try {
            const service = await postgresClient.service.findUnique({
                where: {id: Number(id)}
            });
            if (!service) {
                res.status(404).json({error: "Service not found"});
                return;
            }
            res.status(200).json(service);
        } catch (error) {
            console.error("Error fetching service by ID:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }
    createService: RequestHandler = async (req: Request, res: Response) => {
        try {
            const newService = await postgresClient.service.create({
                data: {
                    ...req.body, asker: {
                        connect: {
                            email: req.body.asker
                        }
                    }
                }

            });
            res.status(201).json(newService);
        } catch (error) {
            console.error("Error creating service:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }
    acceptRequest: RequestHandler = async (req: Request, res: Response) => {
        const user = (req as any).user
        const id = user.id
        try {
            await postgresClient.service.update({
                where: {id: Number(req.params.id)},
                data: {
                    provider: {connect: {id: Number(id)}}
                }
            })
            res.status(200).json({message: "Service request accepted"});
        } catch (e) {
            console.error("Error with the request : ", e)
            res.status(500).json({error: "Internal Server Error"})
        }
    }
    deleteRequest: RequestHandler = async (req: Request, res: Response) => {
        try {
            await postgresClient.service.delete({
                where: {id: Number(req.params.id)}
            });
            res.status(204).send();
        } catch (e) {
            console.error("Error with the request : ", e)
            res.status(500).json({error: "Internal Server Error"})
        }
    }
    updateRequest: RequestHandler = async (req: Request, res: Response) => {
        try {
            const updatedService = await postgresClient.service.update({
                where: {id: Number(req.params.id)},
                data: req.body
            });
            res.status(200).json(updatedService);
        } catch (e) {
            console.error("Error with the request : ", e)
            res.status(500).json({error: "Internal Server Error"})
        }
    }
    getUserServices: RequestHandler = async (req: Request, res: Response) => {
        const user = (req as any).user
        const id = user.id

        try {
            const services = await postgresClient.service.findMany({
                where: {
                    asker: {
                        id: Number(id)
                    }
                },
                include: {
                    provider: true
                }
            });
            res.status(200).json(services);
        } catch (e) {
            console.error("Error with the request : ", e)
            res.status(500).json({error: "Internal Server Error"})
        }
    }
}