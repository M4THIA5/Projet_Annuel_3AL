import {NextFunction, Request, RequestHandler, Response} from "express";
import {PrismaClient as MongoClient} from "../../prisma/client/mongoClient"
import {PrismaClient as PostgreClient} from "../../prisma/client/postgresClient"
import {idValidator} from "../validators/objets"
import {CurrentUser} from "../types";

const pgdb = new PostgreClient()
const db = new MongoClient()

export default class TrocController {

    getAll: RequestHandler = async (_req: Request, res: Response) => {
        try {
            let trocEntries: {
                id: string
                asker: string
                description: string
                userId: number
                helperId: number | null
                createdAt: Date
                needsConfirmation: boolean
                isOpen: boolean
                isDone: boolean
                objets?: unknown
            }[] = await db.troc.findMany({
                where: {
                    isOpen: true,
                },
            });
            for (let troc of trocEntries) {
                troc.objets = await pgdb.objet.findMany({
                    where: {
                        TrocId: troc.id
                    }
                })
            }
            res.status(200).json(trocEntries);
        } catch (error) {
            console.error('Error fetching troc entries:', error);
            res.status(500).json({error: 'Failed to fetch troc entries'});
        }
    };
    getOne: RequestHandler = async (req: Request, res: Response) => {
        const {error, value} = idValidator.validate(req.params);
        if (error) {
            res.status(400).send(error.message);
            return
        }
        const user = (req as any).user

        try {
            const trocEntry = await db.troc.findUniqueOrThrow({
                where: {id: value.id},
            });
            if (trocEntry.isDone) {
                res.status(400).send("done");
                return
            }
            if (user.id != trocEntry.helperId && user.id != trocEntry.userId && !trocEntry.isOpen) {
                res.status(403).send("unable");
                return
            }
            res.status(200).json(trocEntry);
        } catch (err) {
            res.status(404).send("Troc entry not found.");
        }
    };

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = (req as any).user as CurrentUser;
            console.log(req.body)

            if (!user) {
                res.status(401).send("Unauthorized");
                return
            }

            // Récupère l'utilisateur complet
            const full = await pgdb.user.findUniqueOrThrow({
                where: {id: user.id},
            });

            const existingTroc = await db.troc.findFirst({
                where: {userId: user.id},
            });

            if (existingTroc) {
                res.status(403).send("Troc already exists for this user");
                return
            }

            const {description} = req.body;
            // Crée le troc
            const troc = await db.troc.create({
                data: {
                    asker: `${full.firstName} ${full.lastName}`,
                    userId: full.id,
                    description: description,
                },
            });

            const items = JSON.parse(req.body.items)
            for (const id of items) {
                await pgdb.objet.update({
                    where: {id: id},
                    data: {
                        TrocId: troc.id
                    }
                })
            }

            const userNeighborhood = await pgdb.userNeighborhood.findFirst({
                where: {userId: user.id},
            });
            if (!userNeighborhood) {
                throw new Error("Quartier non trouvé");
            }

            const htmlContent = `
                <h2>${req.body.nom}</h2>
                <p>${req.body.description}</p>
            `;

            const postData = {
                userId: user.id.toString(),
                type: "troc",
                neighborhoodId: userNeighborhood.neighborhoodId.toString(),
                createdAt: new Date(),
                content: htmlContent,
                images: [],
            };

            const content = `<p>L’utilisateur <strong>${full.firstName} ${full.lastName}</strong> a lancé un troc.</p>`;

            await db.journalEntry.create({
                data: {
                    content,
                    types: ["Information", "Troc"],
                    districtId: userNeighborhood.neighborhoodId,
                    createdAt: new Date(),
                },
            });

            await db.post.create({data: postData});

            res.status(201).json({message: "Troc created successfully"});
        } catch (error) {
            console.error("Error creating Troc:", error);
            next(error); // Passe l'erreur au middleware de gestion des erreurs
        }
    };


    modify: RequestHandler = async (req: Request, res: Response) => {
        const Validator = idValidator.validate(req.params)
        if (Validator.error != undefined) {
            res.status(400).send(Validator.error.message)
            return
        }
        const id = Validator.value.id
        await db.troc.update({
            where: {
                id: id
            },
            data: req.body
        })
        res.status(200).send("Resource modified successfully.")
    }
    cancel: RequestHandler = async (req: Request, res: Response) => {
        const Validator = idValidator.validate(req.params)
        if (Validator.error != undefined) {
            res.status(400).send(Validator.error.message)
            return
        }
        const id = Validator.value.id


        const troc = await db.troc.findUniqueOrThrow({
            where: {
                id: id
            }
        })
        const user = (req as any).user
        if (troc.userId !== user.id) {
            res.status(403).send("You are not allowed to do this action")
            return
        }
        const items = await pgdb.objet.findMany({
            where: {TrocId: troc.id}
        })
        for (const item of items) {
            if (item.userId === troc.helperId) {
                await pgdb.objet.update({
                    where: {id: item.id},
                    data: {TrocId: null}
                })
            }
        }

        await db.troc.update({
            where: {
                id: id
            },
            data: {helperId: null}
        })
        res.status(204).send()
    }
    accept: RequestHandler = async (req: Request, res: Response) => {
        const Validator = idValidator.validate(req.params)
        if (Validator.error != undefined) {
            res.status(400).send(Validator.error.message)
            return
        }
        const id = Validator.value.id
        const user = (req as any).user
        await db.troc.update({
            where: {
                id: id
            },
            data: {helperId: user.id}
        })
        res.status(204).send()
    }
    troc: RequestHandler = async (req: Request, res: Response) => {
        const Validator = idValidator.validate(req.params);
        if (Validator.error != undefined) {
            res.status(400).send(Validator.error.message);
            return;
        }
        const id = Validator.value.id;
        const user = (req as any).user;

        const full = await pgdb.user.findUnique({
            where: {id: user.id},
        });
        if (!full) {
            throw new Error("Utilisateur non trouvé");
        }

        const troc = await db.troc.findUniqueOrThrow({
            where: {
                id: id
            }
        });

        if (troc.userId !== user.id) {
            res.status(403).send("You are not allowed to do this action");
            return;
        }

        const trocObjets = await pgdb.objet.findMany({
            where: {
                TrocId: id
            }
        });

        for (const item of trocObjets) {
            if (item.userId == troc.userId) {
                await pgdb.objet.update({
                    where: { id: item.id },
                    data: {
                        TrocId: null,
                        userId: Number(troc.helperId)
                    }
                });
            } else {
                await pgdb.objet.update({
                    where: { id: item.id },
                    data: {
                        TrocId: null,
                        userId: user.id
                    }
                });
            }
        }

        await db.troc.update({
            where: {
                id: id
            },
            data: {
                isOpen: false,
                needsConfirmation: false,
                isDone: true
            }
        });

        try {
            const [userNeighborhood, helper] = await Promise.all([
                pgdb.userNeighborhood.findFirst({ where: { userId: user.id } }),
                pgdb.user.findUnique({ where: { id: troc.helperId ?? undefined } }),
            ]);

            if (userNeighborhood && helper) {
                const content = `<p>L’utilisateur <strong>${full.firstName} ${full.lastName}</strong> a finalisé un troc avec l’utilisateur <strong>${helper.firstName} ${helper.lastName}</strong>.</p>`;

                await db.journalEntry.create({
                    data: {
                        content,
                        types: ["Information", "Troc"],
                        districtId: userNeighborhood.neighborhoodId,
                        createdAt: new Date(),
                    },
                });
            }
        } catch (err) {
            console.error("Erreur lors de la création de l’entrée dans le journal :", err);
        }

        res.status(204).send();
    };
    refuse: RequestHandler = async (req: Request, res: Response) => {
        const Validator = idValidator.validate(req.params)
        if (Validator.error != undefined) {
            res.status(400).send(Validator.error.message)
            return
        }
        const id = Validator.value.id
        const user = (req as any).user

        const troc = await db.troc.findUniqueOrThrow({
            where: {
                id: id
            }
        })
        if (troc.userId !== user.id) {
            res.status(403).send("You are not allowed to do this action")
            return
        }
        const items = await pgdb.objet.findMany({
            where: {TrocId: troc.id}
        })
        for (const item of items) {
            if (item.userId === troc.helperId) {
                await pgdb.objet.update({
                    where: {id: item.id},
                    data: {TrocId: null}
                })
            }
        }
        await db.troc.update({where: {id: troc.id}, data: {needsConfirmation: false, helperId: null}})
        res.status(204).send()
    }
    propose: RequestHandler = async (req: Request, res: Response) => {
        const Validator = idValidator.validate(req.params)
        if (Validator.error != undefined) {
            res.status(400).send(Validator.error.message)
            return
        }
        const id = Validator.value.id
        const user = (req as any).user

        const troc = await db.troc.findUniqueOrThrow({
            where: {
                id: id
            }
        })
        if (troc.helperId !== user.id) {
            res.status(403).send("You are not allowed to do this action")
            return
        }
        //fix this
        const items = req.body
        for (const item of items) {
            console.log(item)
            await pgdb.objet.update({
                where: {id: item},
                data: {
                    TrocId: troc.id,
                }
            })
        }
        await db.troc.update({
            where: {
                id: id
            },
            data: {
                needsConfirmation: true
            }
        })
        res.status(204).send()
    }
    getItems: RequestHandler = async (req: Request, res: Response) => {
        const Validator = idValidator.validate(req.params)
        if (Validator.error != undefined) {
            res.status(400).send(Validator.error.message)
            return
        }
        const id = Validator.value.id
        const user = (req as any).user

        const troc = await db.troc.findUniqueOrThrow({
            where: {
                id: id
            }
        })
        if (troc.userId !== user.id) {
            res.status(403).send("You are not allowed to do this action")
            return
        }
        const items = await pgdb.objet.findMany({
            where: {TrocId: troc.id},
            include: {user: true}
        })
        const user1 = await pgdb.user.findUniqueOrThrow({
            where: {
                id: Number(troc.userId)
            }
        })
        const user2 = await pgdb.user.findUniqueOrThrow({
            where: {
                id: Number(troc.helperId)
            }
        })
        res.status(200).send({
            user1: user1.firstName + " " + user1.lastName,
            user2: user2.firstName + " " + user2.lastName,
            items: items
        })
    }
}
