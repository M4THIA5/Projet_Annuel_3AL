import { Router } from 'express'
import ServiceController from '../controllers/serviceController'
import { verifyJwt } from '../middleware/verifyJwt'

const serviceController = new ServiceController()

const serviceRoutes = Router()
serviceRoutes.get('/', serviceController.getAllServices)
serviceRoutes.get('/me', verifyJwt, serviceController.getUserServices)
serviceRoutes.get('/:id', serviceController.getServiceById)
serviceRoutes.get('/:id/accept', serviceController.acceptRequest)
serviceRoutes.delete('/:id', serviceController.deleteRequest)
serviceRoutes.put('/:id', serviceController.updateRequest)
serviceRoutes.post('/', verifyJwt, serviceController.createService)

export default serviceRoutes
