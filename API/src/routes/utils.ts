 import { Router } from 'express'
import UtilsController from '../controllers/UtilsController'

const utilsController = new UtilsController()

const utilsRoutes = Router()
utilsRoutes.post('/login', utilsController.login)
utilsRoutes.post('/register', utilsController.register)

export default utilsRoutes

// export default function useUtilsRoutes(app:Router){
//     app.post('/login', utilsController.login)
//     app.post('/register', utilsController.register)
// }
