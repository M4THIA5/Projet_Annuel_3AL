import { Router } from 'express'
import UserController from '../controllers/userController'
import { verifyJwt, verifyAdmin } from '../middleware/verifyJwt'

const userController = new UserController()

const userRoutes = Router()
userRoutes.get('/me', verifyJwt, userController.me)
userRoutes.post('/', userController.createUser)
// userRoutes.get('/', verifyJwt, verifyAdmin, userController.getAllUsers)
userRoutes.get('/', userController.getAllUsers)
userRoutes.get('/:id', verifyJwt, userController.getUser)
userRoutes.put('/:id', verifyJwt, userController.updateUser)
userRoutes.delete('/:id', verifyJwt, userController.deleteUser)

export default userRoutes
