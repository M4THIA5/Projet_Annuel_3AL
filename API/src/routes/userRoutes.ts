import { Router } from 'express'
import UserController from '../controllers/userController'
import { verifyAdmin } from '../middleware/verifyJwt'

const userController = new UserController()

const userRoutes = Router()
userRoutes.get('/me', userController.me)
userRoutes.post('/', userController.createUser)
userRoutes.get('/', verifyAdmin, userController.getAllUsers)
// userRoutes.get('/', userController.getAllUsers)
userRoutes.get('/:id', userController.getUser)
userRoutes.put('/:id', userController.updateUser)
userRoutes.delete('/:id', userController.deleteUser)
userRoutes.get('/:id/friends', userController.getFriends)


export default userRoutes
