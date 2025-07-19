import {RequestHandler, Request, Response} from "express";
import {PrismaClient as PostgresClient} from "../../prisma/client/postgresClient";
import {PrismaClient as MongoClient} from "../../prisma/client/mongoClient";
import {create} from "node:domain";
import {User} from "../types";

const postgresClient = new PostgresClient();
const mongoClient = new MongoClient()

export default class SortieController {
    getAllSorties: RequestHandler = async (req: Request, res: Response) => {
        try {
            const sorties = await postgresClient.sortie.findMany();
            res.status(200).json(sorties);
        } catch (error) {
            console.error("Error fetching sorties:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }
    getFutureSorties: RequestHandler = async (req: Request, res: Response) => {
        try {
            const sorties = await postgresClient.sortie.findMany({
                where: {
                    date: {
                        gte: new Date() // Fetch sorties with date greater than or equal to today
                    }
                }, include:{
                    participants: true,
                    creator: true,
                }
            });
            res.status(200).json(sorties);
        } catch (error) {
            console.error("Error fetching sorties:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }
    getSortieById: RequestHandler = async (req: Request, res: Response) => {
        const {id} = req.params;
        try {
            const sortie = await postgresClient.sortie.findUnique({
                where: {id: Number(id)}
                , include: {
                    participants: true,
                    creator: true,
                }
            });
            if (!sortie) {
                res.status(404).json({error: "Sortie not found"});
                return;
            }
            res.status(200).json(sortie);
        } catch (error) {
            console.error("Error fetching sortie by ID:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }
    createSortie: RequestHandler = async (req: Request, res: Response) => {
        try {
            const user = (req as any).user;
            const newSortie = await postgresClient.sortie.create({
                data: {
                    ...req.body,
                    creator: {
                        connect: {
                            id: user.id,
                        },
                    },
                    participants: {
                        connect: {
                            id: user.id,
                        },
                    }
                },
            });
            await postgresClient.rooms.create({
                data: {
                    nom: "Sortie :"+ req.body.title + " - " + newSortie.id,
                    users: {
                        connect: { id: user.id }
                    }
                }
            });

            const userNeighborhood = await postgresClient.userNeighborhood.findFirst({
                where: {
                    userId: user.id,
                },
            });
            if (!userNeighborhood) {
                res.status(404).json({error: "User neighborhood not found"});
                return
            }
            const formattedDate = new Date(req.body.createdAt || newSortie.createdAt).toLocaleString('fr-FR', {
                dateStyle: 'medium',
                timeStyle: 'short',
            });

            const htmlContent = `
        <h2>${req.body.title}</h2>
        <p>${req.body.description}</p>
    `;

            const postData = {
                userId: user.id.toString(),
                type: "sortie",
                neighborhoodId: String(userNeighborhood.neighborhoodId),
                createdAt: new Date(),
                content: htmlContent,
                images: [],
            };

            await mongoClient.post.create({data: postData});

            res.status(201).json(newSortie);
        } catch (error) {
            console.error("Error creating sortie:", error);
            res.status(500).json({error: "Internal Server Error:"});
        }
    };

    acceptRequest: RequestHandler = async (req: Request, res: Response) => {
        try {
            const updateSortie = await postgresClient.sortie.findUnique({
                where: {id: Number(req.params.id)},
                include: {
                    participants: true,
                }
            })
            if (!updateSortie) {
                res.status(404).json({error: "Sortie not found"});
                return;
            }
            const user = (req as any).user as User;

            const dbUser = await postgresClient.user.findUnique({
                where: {id: user.id}
            })
            if (!dbUser) {
                res.status(404).json({error: "User not found"});
                return;
            }
            if (updateSortie.participants.length >= updateSortie.maxParticipants) {
                res.status(400).json({error: "Sortie is full"});
                return;
            }
            if (updateSortie.participants.some(participant => participant.id === user.id)) {
                res.status(400).json({error: "User already accepted the sortie"});
                return;
            }
            await postgresClient.user.update({
                where: {id: user.id},
                data: {
                    sortiesAttended: {
                        connect: {id: updateSortie.id}
                    },
                }
            })
            const room = await postgresClient.rooms.findFirstOrThrow({
                where: {nom: "Sortie :" + updateSortie.title + " - " + updateSortie.id}
            });


            await postgresClient.rooms.update({
                where: {id:room.id},
                data: {
                    users: {
                        connect: { id: user.id }
                    }
                }
            });

            res.status(200).json({message: "Sortie request accepted"});
        } catch (e) {
            console.error("Error with the request : ", e)
            res.status(500).json({error: "Internal Server Error : "})
        }
    }
    deleteRequest: RequestHandler = async (req: Request, res: Response) => {
        try {
            await postgresClient.sortie.delete({
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
            const updatedSortie = await postgresClient.sortie.update({
                where: {id: Number(req.params.id)},
                data: req.body
            });
            res.status(200).json(updatedSortie);
        } catch (e) {
            console.error("Error with the request : ", e)
            res.status(500).json({error: "Internal Server Error"})
        }
    }

}
