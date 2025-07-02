import { Request, RequestHandler, Response } from "express";
import { PrismaClient as MongoClient } from "../../prisma/client/mongoClient";
import {
    createValidator,
    idValidator,
    neighborhoodIdValidator,
    updateValidator,
} from "../validators/post";
import fs from "fs";

const db = new MongoClient();

export default class PostController {
    getAll: RequestHandler = async (_: Request, res: Response) => {
        const posts = await db.post.findMany();
        res.status(200).send({ data: posts });
    };

    getOne: RequestHandler = async (req: Request, res: Response) => {
        const validator = idValidator.validate(req.query);
        if (validator.error != undefined) {
            res.status(400).send({ error: validator.error.message });
            return;
        }
        const id = validator.value.id;
        const post = await db.post.findUniqueOrThrow({
            where: {
                id: id,
            },
        });
        res.status(200).send({ data: post });
    };

    getByNeighborhood: RequestHandler = async (req: Request, res: Response) => {
        const validator = neighborhoodIdValidator.validate(req.query);
        if (validator.error != undefined) {
            res.status(400).send({ error: validator.error.message });
            return;
        }
        const neighborhoodId = validator.value.neighborhoodId;
        try {
            const posts = await db.post.findMany({
                where: {
                    neighborhoodId: neighborhoodId,
                },
            });
            res.status(200).send({ data: posts });
        } catch (error) {
            res
                .status(500)
                .send({ error: "An error occurred while fetching posts." });
        }
    };

    create: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { error, value } = createValidator.validate(req.body);

        if (error) {
            console.log(error.message);
            res.status(400).send({ error: error.message });
            return;
        }

        const files = (req.files as Express.Multer.File[]) || [];
        console.log(files);
        try {
            const imageBase64Array = await Promise.all(
                files.map(async (file) => {
                    const fileBuffer = fs.readFileSync(file.path);
                    const base64 = fileBuffer.toString("base64");
                    const mimeType = file.mimetype;
                    return `data:${mimeType};base64,${base64}`;
                })
            );

            // Nettoyage des fichiers après conversion
            for (const file of files) {
                fs.unlink(file.path, (err) => {
                    if (err) console.error(`Erreur suppression ${file.path} :`, err);
                });
            }

            const postData = {
                ...value,
                images: imageBase64Array,
            };
            console.log(postData);

            await db.post.create({ data: postData });

            res.status(201).send({ message: "Resource created" });
        } catch (err) {
            console.error("Erreur lors du traitement des images :", err);
            res.status(500).send({ error: "Erreur lors de la création du post" });
        }
    };

    modify: RequestHandler = async (req: Request, res: Response) => {
        const validator = updateValidator.validate(req.body);
        if (validator.error) {
            res.status(400).send({ error: validator.error.message });
            return;
        }

        const Validator = idValidator.validate(req.params);
        if (Validator.error) {
            res.status(400).send({ error: Validator.error.message });
            return;
        }
        const id = Validator.value.id;

        try {
            const existingPost = await db.post.findUniqueOrThrow({
                where: { id: id },
            });

            const updatedPost = {
                content: validator.value.content ?? existingPost.content,
                type: validator.value.type ?? existingPost.type,
                userId: validator.value.userId ?? existingPost.userId,
                neighborhoodId:
                    validator.value.neighborhoodId ?? existingPost.neighborhoodId,
            };

            await db.post.update({
                where: { id: id },
                data: updatedPost,
            });

            res.status(200).send({ message: "Resource modified successfully." });
        } catch (error) {
            res.status(404).send({ error: "Resource not found" });
        }
    };

    delete: RequestHandler = async (req: Request, res: Response) => {
        const validator = idValidator.validate(req.params);
        if (validator.error != undefined) {
            res.status(400).send({ error: validator.error.message });
            return;
        }
        const id = validator.value.id;
        await db.post.delete({
            where: {
                id: id,
            },
        });
        res.status(204).send();
    };
}
