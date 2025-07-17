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
            const trocEntries = await db.troc.findMany({
                where: {
                    isOpen: true,
                },
            });

            res.status(200).json(trocEntries);
        } catch (error) {
            console.error('Error fetching troc entries:', error);
            res.status(500).json({ error: 'Failed to fetch troc entries' });
        }
    };
    getOne: RequestHandler = async (req: Request, res: Response) => {
        console.log("trocEntry")
        const { error, value } = idValidator.validate(req.query);

        if (error) {
            res.status(400).send(error.message);
            return
        }

        try {
            const trocEntry = await db.troc.findUniqueOrThrow({
                where: { id: value.id },
            });

            console.log(trocEntry)

            res.status(200).json(trocEntry);
        } catch (err) {
            res.status(404).send("Troc entry not found.");
        }
    };
    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = (req as any).user as CurrentUser;

            if (!user) {
                res.status(401).send("Unauthorized");
                return
            }

            // Récupère l'utilisateur complet
            const full = await pgdb.user.findUniqueOrThrow({
                where: { id: user.id },
            });

            const existingTroc = await db.troc.findFirst({
                where: { userId: user.id },
            });

            if (existingTroc) {
                res.status(403).send("Troc already exists for this user");
                return
            }

            const { description } = req.body;

            // Crée le troc
            await db.troc.create({
                data: {
                    asker: `${full.firstName} ${full.lastName}`,
                    userId: full.id,
                    description: description,
                },
            });

            res.status(201).json({ message: "Troc created successfully" });
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
    delete: RequestHandler = async (req: Request, res: Response) => {
        const Validator = idValidator.validate(req.params)
        if (Validator.error != undefined) {
            res.status(400).send(Validator.error.message)
            return
        }
        const id = Validator.value.id
        await db.troc.delete({
            where: {
                id: id
            }
        })
        res.status(204).send()
    }
}
