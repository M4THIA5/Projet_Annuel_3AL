import { Router } from 'express'
import PostgreController from '../controllers/PostgreController'

const postgreController = new PostgreController()

export function setPostgreRoutes(app: Router) {
    app.post('/postgre/create', postgreController.createUser)
    app.get('/postgre/get', postgreController.getData)
}
