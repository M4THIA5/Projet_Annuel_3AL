import {PrismaClient} from '../../prisma/postgre/client'
import {RequestHandler, Request, Response, NextFunction} from "express"
import {Credentials} from '../types'
import UserController from "./userController";
import bcrypt from 'bcrypt';


const prisma = new PrismaClient()

class UtilsController {
    login: RequestHandler = async (req: Request, res: Response, next) => {
        const credentials = req.body as Credentials
        try {
            const user = await prisma.user.findUnique(
                {where: {email: credentials.email}, select: {id: true, email: true, password: true}}
            )
            if (!user) {
                res.status(401).json("Invalid credentials")
                return;
            }
            bcrypt.hash(credentials.password, 10, function (err, passwordToTest) {
                bcrypt.compare(passwordToTest, user.password, function (err: Error | undefined, result) {
                    if (!result) {
                        res.status(401).json("Invalid credentials")
                        return;
                    }
                })
                res.status(200).json({message: "ok", id: user.id})
            })
        } catch (error) {
            next(error)
        }
    };
    register: RequestHandler = async (req: Request, res: Response, next) => {
        const userController = new UserController();
        await userController.createUser(req, res, next);
    }

}

export default UtilsController