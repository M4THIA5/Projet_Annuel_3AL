import { Router } from 'express'
import UserController from '../controllers/userController'

const userController = new UserController()

export function setUserRoutes(app: Router) {
    app.post('/users', userController.createUser)
    app.get('/users', userController.getAllUsers)
    app.get('/users/:id', userController.getUser)
    app.put('/users/:id', userController.updateUser)
    app.delete('/users/:id', userController.deleteUser)
}
