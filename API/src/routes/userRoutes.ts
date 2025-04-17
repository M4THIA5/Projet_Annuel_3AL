import { Router } from 'express'
import UserController from '../controllers/userController'

const userController = new UserController()

const userRoutes = Router()
userRoutes.post('/', userController.createUser)
userRoutes.get('/', userController.getAllUsers)
userRoutes.get('/:id', userController.getUser)
userRoutes.put('/:id', userController.updateUser)
userRoutes.delete('/:id', userController.deleteUser)
export default userRoutes
