import { Tspec } from "tspec"
import { Request, Response } from "express"
import {Book, Credentials, Data, UserCreated} from "../types"
import UtilsController from "../controllers/UtilsController"
import UserController from "../controllers/userController"
import PostgreController from "../controllers/PostgreController"
import MongoController from "../controllers/MongoController"



export const getBookById = (
    req: Request<{ id: string }>, res: Response<Book>,
) => {
    res.json({
        id: +req.params.id,
        title: 'Book Title',
        description: 'Book Description',
    })
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const utils = new UtilsController()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const user = new UserController()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mongo = new MongoController()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const postgre = new PostgreController()

export type baseApiSpec = Tspec.DefineApiSpec<{
    tags: ['Base'],
    paths: {
        '/': {
            get: {
                summary: 'Base route.',
                handler: typeof utils.home,
                responses: {200: {message: string}}
            },
        },
        '/health': {
            get: {
                summary: 'Healthcheck route.',
                handler: typeof utils.healthCheck,
                responses: {200: {message: string}}
            },
        },
        '/login': {
            post: {
                summary: 'Login route.',
                body: Credentials,
                handler: typeof utils.login,
                responses: {200: {message: string}, 401: {message: string}}
            },
        },
        '/register': {
            post: {
                summary: 'Register route.',
                body:UserCreated
                handler: typeof utils.register,
                responses: {
                    201: { message: string },
                    400: { message: string },
                    500: { message: string }
                }
            }
        }
    }
}>

export type userApiSpec = Tspec.DefineApiSpec<{
    tags: ['User'],
    paths: {
        '/users': {
            get: {
                summary: 'Get all users',
                handler: typeof user.getAllUsers,
                responses: {200: {message: string}}
            },
            post: {
                summary: 'Create user',
                handler: typeof user.createUser,
                body : UserCreated
                responses: {201: {message: string}, 400: {message: string}}
            }
        },
        '/users/{id}': {
            get: {
                summary: 'Get user by id',
                handler: typeof user.getUser,
                path: {id: number},
                responses: {200: {message: string}, 404: {message: string}}
            },
            put: {
                summary: 'Update user by id',
                handler: typeof user.updateUser,
                path: {id: number},
                body: UserCreated,
                responses: {200: {message: string}}
            },
            delete: {
                summary: 'Delete user by id',
                handler: typeof user.deleteUser,
                path: {id: number},
                responses: {200: {message: string}}
            },
        },
    }
}>

export type postgreApiSpec = Tspec.DefineApiSpec<{
    tags: ['Postgre'],
    paths: {
        '/postgre/create': {
            post: {
                summary: 'Create data',
                handler: typeof postgre.createUser,
                body: Data
                responses: {201: {message: string}, 400: {message: string}}
            },
        },
        '/postgre/get': {
            get: {
                summary: 'Get all data',
                handler: typeof postgre.getData,
                responses: {200: {message: string}}
            },
        },
    }
}>

export type mongoApiSpec = Tspec.DefineApiSpec<{
    tags: ['Mongo'],
    paths: {
        '/mongo/create': {
            post: {
                summary: 'Create data',
                handler: typeof mongo.createUser,
                body:Data
                responses: {201: {message: string}, 400: {message: string}}
            },
        },
        '/mongo/get': {
            get: {
                summary: 'Get all data',
                handler: typeof mongo.getData,
                responses: {200: {message: string}}
            },
        },
    }
}>

export type BookApiSpec = Tspec.DefineApiSpec<{
    tags: ['Book'],
    paths: {
        '/books/{id}': {
            get: {
                summary: 'Get book by id',
                handler: typeof getBookById,
                responses: {200: Book, 404: Error}
            },
        },
    }
}>
