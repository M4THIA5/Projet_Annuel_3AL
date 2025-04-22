import { Router } from 'express'
import MongoController from '../controllers/MongoController'

const mongoController = new MongoController()

const mongoRoutes = Router()
mongoRoutes.post('/create', mongoController.createUser)
mongoRoutes.get('/get', mongoController.getData)
export default mongoRoutes
