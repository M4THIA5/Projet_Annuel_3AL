import { Router } from 'express'
import PostgreController from '../controllers/PostgreController'

const postgreController = new PostgreController()

const postgreRoutes = Router()
postgreRoutes.post('/create', postgreController.createUser)
postgreRoutes.get('/get', postgreController.getData)
export default postgreRoutes
