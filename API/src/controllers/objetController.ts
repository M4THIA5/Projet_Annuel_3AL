import {PrismaClient as PostgresClient} from '../../prisma/client/postgresClient'
import {RequestHandler, Request, Response, NextFunction} from "express"
import fs from "fs"
import {idValidator} from "../validators/objets"

const postgresClient = new PostgresClient()

export default class objetController {
    getObjets: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const objets = await postgresClient.objet.findMany({
            select: {
                id: true,
                nom: true,
                description: true,
                createdAt: true,
                image: true,
            }
        });
        res.status(200).send(objets)
    }
    getMyObjets: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const id = (req as any).user.id
        const objets = await postgresClient.objet.findMany({
            where: {
                OR: [{
                    user: {id: id},
                    TrocId: undefined
                }, {
                    user: {id: id},
                    TrocId: null
                }]
            },
            select: {
                id: true,
                nom: true,
                description: true,
                createdAt: true,
                image: true,
                TrocId:true
            }
        });
        res.status(200).send(objets)
    }
    getOneObjet: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const {error, value} = idValidator.validate(req.params);
            if (error) {
                res.status(400).json({error: error.message});
                return;
            }

            const objet = await postgresClient.objet.findFirst({
                where: {id: value.id}
            });

            if (!objet) {
                res.status(404).json({error: "Objet not found"});
                return;
            }

            console.log(objet)
            res.status(200).json(objet);
        } catch (err) {
            console.error("Error fetching objet:", err);
            res.status(500).json({error: "Internal server error"});
        }
    };
    createObjet: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const body = req.body;
            const file = req.file

            const id = (req as any).user.id
            const data: any = {
                ...body,
            };

            if (file) {
                const fileBuffer = fs.readFileSync(file.path);
                const base64 = fileBuffer.toString('base64');
                const mimeType = file.mimetype; // exemple: 'image/jpeg'
                data.image = `data:${mimeType};base64,${base64}`;
            }

            const updated = await postgresClient.objet.create({
                data: {
                    ...data,
                    user: {
                        connect: {
                            id: id
                        }
                    }
                }
            });

            res.status(200).json(updated);
        } catch (error) {
            next(error);
        }
    }
    modifyObjet: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const validator = idValidator.validate(req.params);
        if (validator.error) {
            res.status(400).send({error: validator.error.message});
            return;
        }
        const body = req.body;
        const file = req.file
        const data: any = {
            ...body,
        };
        if (file) {
            const fileBuffer = fs.readFileSync(file.path);
            const base64 = fileBuffer.toString('base64');
            const mimeType = file.mimetype; // exemple: 'image/jpeg'
            data.image = `data:${mimeType};base64,${base64}`;
        }

        const updated = await postgresClient.objet.update({
            data: data,
            where: {
                id: validator.value.id
            }
        });
        res.status(200).send(updated)
    }
    deleteObjet: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const {error, value} = idValidator.validate(req.params);

        if (error) {
            res.status(400).json({error: error.message});
            return;
        }

        try {
            await postgresClient.objet.delete({
                where: {
                    id: value.id,
                },
            });

            res.status(204).send();
        } catch (err) {
            console.error('Error deleting objet:', err);
            res.status(500).json({error: 'Failed to delete the objet'});
        }
    };

}
