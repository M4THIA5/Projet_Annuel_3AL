import { Router } from 'express'
import MongoController from '../controllers/MongoController'

const mongoController = new MongoController()

export function setMongoRoutes(app: Router) {
    app.post('/mongo/create', mongoController.createUser)
    app.get('/mongo/get', mongoController.getData)
}
