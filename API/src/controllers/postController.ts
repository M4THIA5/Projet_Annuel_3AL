import { Request, RequestHandler, Response } from "express";
import { PrismaClient as MongoClient } from "../../prisma/client/mongoClient";
import {
    createValidator,
    idValidator,
    neighborhoodIdValidator,
    updateValidator,
} from "../validators/post";
import fs from "fs";
import {PrismaClient as PostgresClient} from "../../prisma/client/postgresClient";

const db = new MongoClient();
const postgresClient = new PostgresClient()

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
        const neighborhoodId = req.params.neighborhoodId;
        try {
            const posts = await db.post.findMany({
                where: { neighborhoodId },
            });
            const userIds = [...new Set(posts.map(p => Number(p.userId)))];

            const users = await postgresClient.user.findMany({
                where: { id: { in: userIds } },
                select: {
                    id: true,
                    email: true,
                    color: true,
                    image: true,
                    firstName: true,
                    lastName: true,
                },
            });

            const userMap = new Map(users.map(user => [user.id, user]));

            const formattedPosts = posts.map(post => ({
                _id: post.id,
                content: post.content,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                neighborhoodId: post.neighborhoodId,
                userId: post.userId,
                type: post.type,
                images: post.images || [],
                user: userMap.get(Number(post.userId)) || null,
            }));

            res.status(200).send(formattedPosts);
        } catch (error) {
            console.error(error);
            res.status(500).send({ error: "An error occurred while fetching posts." });
        }
    };


    create: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const { error, value } = createValidator.validate(req.body);
        console.log(value)

        if (error) {
            console.log(error.message);
            res.status(400).send({ error: error.message });
            return;
        }

        const files = (req.files as Express.Multer.File[]) || [];
        try {

            const imageUrls = files.map((file) => {
                return `/uploads/${file.filename}`;
            });

            const postData = {
                ...value,
                images: imageUrls,
            };
            // console.log(postData);

            await db.post.create({ data: postData });

            const full = await postgresClient.user.findUniqueOrThrow({
                where: {id: Number(value.userId)},
            });

            const userNeighborhood = await postgresClient.userNeighborhood.findFirst({
                where: {userId: full.id},
            });
            if (!userNeighborhood) {
                throw new Error("Quartier non trouvé");
            }

            const content = `<p>L’utilisateur <strong>${full.firstName} ${full.lastName}</strong> a créé un post.</p>`;

            await db.journalEntry.create({
                data: {
                    content,
                    types: ["Information", "Post"],
                    districtId: userNeighborhood.neighborhoodId,
                    createdAt: new Date(),
                },
            });
            console.log("Resource created")
            res.status(201).send({ message: "Resource created" });
        } catch (err) {
            console.error("Erreur lors du traitement des images :", err);
            res.status(500).send({ error: "Erreur lors de la création du post" });
        }
    };

    update: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const postId = req.params.id;
        const files = (req.files as Express.Multer.File[]) || [];

        try {
            const existingPost = await db.post.findUnique({
                where: { id: postId },
            });

            if (!existingPost) {
                res.status(404).send({ error: "Post non trouvé" });
                return;
            }

            // Images à conserver (venant du frontend)
            const keptImages = req.body.keptImages ? JSON.parse(req.body.keptImages) : [];

            // Nouvelles images uploadées
            const newImageUrls = files.map((file) => `/uploads/${file.filename}`);

            const updatedImages = [...keptImages, ...newImageUrls];

            const postData = {
                userId : existingPost.userId,
                type : req.body.type ?? existingPost.type,
                neighborhoodId : existingPost.neighborhoodId,
                createdAt : existingPost.createdAt,
                content: req.body.content ?? existingPost.content,
                images: updatedImages,
            };

            const updatedPost = await db.post.update({
                where: { id: postId },
                data: postData,
            });

            res.status(200).send({ message: "Resource updated", post: updatedPost });
        } catch (err) {
            console.error("Erreur lors de la mise à jour :", err);
            res.status(500).send({ error: "Erreur lors de la mise à jour du post" });
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
