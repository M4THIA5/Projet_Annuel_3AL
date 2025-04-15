 import { Router } from 'express'
import UtilsController from '../controllers/UtilsController'

const utilsController = new UtilsController()

export default function useUtilsRoutes(app:Router){
    app.post('/login', utilsController.login)
    app.post('/register', utilsController.register)
}
