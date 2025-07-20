import {RequestHandler, Request, Response} from "express";
import {PrismaClient as PostgresClient} from "../../prisma/client/postgresClient";
import {PrismaClient as MongoClient} from "../../prisma/client/mongoClient";
import {create} from "node:domain";

const postgresClient = new PostgresClient();
const mongoClient = new MongoClient()

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
                where: {
                    OR: [
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
            const user = await postgresClient.user.findUnique({
                where: {email: req.body.asker},
            });
            if (!user) {
                throw new Error("Utilisateur non trouvé");
            }

            const userNeighborhood = await postgresClient.userNeighborhood.findFirst({
                where: {userId: user.id},
            });
            if (!userNeighborhood) {
                throw new Error("Quartier non trouvé");
            }

            const newService = await postgresClient.service.create({
                data: {
                    ...req.body,
                    asker: {
                        connect: {
                            email: req.body.asker,
                        },
                    },
                },
            });

            const htmlContent = `
        <h2>${req.body.title}</h2>
        <p>${req.body.description}</p>
    `;

            const postData = {
                userId: user.id.toString(),
                type: "service",
                neighborhoodId: userNeighborhood.neighborhoodId.toString(),
                content: htmlContent,
                images: [],
            };

            await mongoClient.post.create({data: postData});

            const content = `<p>L’utilisateur <strong>${user.firstName} ${user.lastName}</strong> a effectué une demande de service.</p>`;

            await mongoClient.journalEntry.create({
                data: {
                    content,
                    types: ["Information", "Service"],
                    districtId: userNeighborhood.neighborhoodId,
                },
            });

            res.status(201).json(newService);
        } catch (error) {
            console.error("Error creating service:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    };

    acceptRequest: RequestHandler = async (req: Request, res: Response) => {
        const user = (req as any).user;
        const providerId = Number(user.id);

        try {
            const updateService = await postgresClient.service.update({
                where: { id: Number(req.params.id) },
                data: {
                    provider: { connect: { id: providerId } }
                }
            });

            const askerId = updateService.askerId;
            const users = [askerId, providerId];

            await postgresClient.rooms.create({
                data: {
                    nom: "Service - " + updateService.title,
                    users: {
                        connect: users.map((id) => ({ id: Number(id) }))
                    }
                }
            });

            const [asker, provider] = await Promise.all([
                postgresClient.user.findUnique({ where: { id: askerId } }),
                postgresClient.user.findUnique({ where: { id: providerId } }),
            ]);

            if (!asker || !provider) {
                throw new Error("Utilisateur manquant");
            }

            const providerNeighborhood = await postgresClient.userNeighborhood.findFirst({
                where: { userId: providerId }
            });

            if (!providerNeighborhood) {
                throw new Error("Quartier du provider non trouvé");
            }

            const journalContent = `<p>L’utilisateur <strong>${provider.firstName} ${provider.lastName}</strong> a accepté le service de l’utilisateur <strong>${asker.firstName} ${asker.lastName}</strong>.</p>`;

            await mongoClient.journalEntry.create({
                data: {
                    content: journalContent,
                    types: ["Information", "Service"],
                    districtId: providerNeighborhood.neighborhoodId,
                },
            });

            res.status(200).json({ message: "Service request accepted" });
        } catch (e) {
            console.error("Error with the request:", e);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };
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
