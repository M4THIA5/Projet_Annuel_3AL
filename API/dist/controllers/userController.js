"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserController {
    createUser = async (req, res, next) => {
        const data = req.body;
        try {
            const user = await prisma.user.create({ data });
            res.status(201).json(user);
        }
        catch (error) {
            next(error);
        }
    };
    getAllUsers = async (req, res, next) => {
        try {
            const users = await prisma.user.findMany();
            res.status(200).json(users);
        }
        catch (error) {
            next(error);
        }
    };
    getUser = async (req, res, next) => {
        try {
            const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
            if (!user) {
                res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    };
    updateUser = async (req, res, next) => {
        try {
            const user = await prisma.user.update({
                where: { id: Number(req.params.id) },
                data: req.body,
            });
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    };
    deleteUser = async (req, res, next) => {
        try {
            await prisma.user.delete({ where: { id: Number(req.params.id) } });
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = UserController;
