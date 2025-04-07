import { Router } from 'express'
import UserController from '../controllers/userController'
import { verifyJwt, verifyAdmin } from '../middleware/verifyJwt'

const userController = new UserController()

export async function setUserRoutes(defaultRoute:string, app: Router) {
    app.post(`${defaultRoute}/`, userController.createUser)
    app.get(`${defaultRoute}/`, verifyJwt, verifyAdmin, userController.getAllUsers)
    app.get(`${defaultRoute}/:id`, verifyJwt, userController.getUser)
    app.put(`${defaultRoute}/:id`, verifyJwt, userController.updateUser)
    app.delete(`${defaultRoute}/:id`, verifyJwt, userController.deleteUser)
}