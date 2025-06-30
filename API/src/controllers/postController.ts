import { Request, RequestHandler, Response } from "express";
import { PrismaClient as MongoClient } from "../../prisma/client/mongoClient";
import {createValidator, idValidator, neighborhoodIdValidator, updateValidator} from "../validators/post";

const db = new MongoClient();

export default class PostController {
    getAll: RequestHandler = async (_: Request, res: Response) => {
        const posts = await db.post.findMany();
        res.status(200).send(posts);
    }

    getOne: RequestHandler = async (req: Request, res: Response) => {
        const validator = idValidator.validate(req.query);
        if (validator.error != undefined) {
            res.status(400).send(validator.error.message);
            return;
        }
        const id = validator.value.id;
        const post = await db.post.findUniqueOrThrow({
            where: {
                id: id
            }
        });
        res.status(200).send(post);
    }

    getByNeighborhood: RequestHandler = async (req: Request, res: Response) => {
        const validator = neighborhoodIdValidator.validate(req.query);
        if (validator.error != undefined) {
            res.status(400).send(validator.error.message);
            return;
        }
        const neighborhoodId = validator.value.neighborhoodId;
        try {
            const posts = await db.post.findMany({
                where: {
                    neighborhoodId: neighborhoodId
                }
            });
            res.status(200).send(posts);
        } catch (error) {
            res.status(500).send("An error occurred while fetching posts.");
        }
    }


    create: RequestHandler = async (req: Request, res: Response) => {
        const validator = createValidator.validate(req.body);
        if (validator.error != undefined) {
            console.log(validator.error.message);
            res.status(400).send(validator.error.message);
            return;
        }
        await db.post.create({
            data: validator.value
        });
        res.status(201).send("Resource created");
    }

    modify: RequestHandler = async (req: Request, res: Response) => {
        const validator = updateValidator.validate(req.body);
        if (validator.error) {
            res.status(400).send(validator.error.message);
            return;
        }

        const Validator = idValidator.validate(req.params);
        if (Validator.error) {
            res.status(400).send(Validator.error.message);
            return;
        }
        const id = Validator.value.id;

        try {
            const existingPost = await db.post.findUniqueOrThrow({
                where: { id: id }
            });

            const updatedPost = {
                content: validator.value.content ?? existingPost.content,
                type: validator.value.type ?? existingPost.type,
                userId: validator.value.userId ?? existingPost.userId,
                neighborhoodId: validator.value.neighborhoodId ?? existingPost.neighborhoodId,
            };

            await db.post.update({
                where: { id: id },
                data: updatedPost
            });

            res.status(200).send("Resource modified successfully.");
        } catch (error) {
            res.status(404).send("Resource not found");
        }
    }


    delete: RequestHandler = async (req: Request, res: Response) => {
        const validator = idValidator.validate(req.params);
        if (validator.error != undefined) {
            res.status(400).send(validator.error.message);
            return;
        }
        const id = validator.value.id;
        await db.post.delete({
            where: {
                id: id
            }
        });
        res.status(204).send();
    }
}
