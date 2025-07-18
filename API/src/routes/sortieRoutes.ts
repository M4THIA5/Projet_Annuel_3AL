import { Router } from 'express'
import SortieController from '../controllers/sortieController'

const sortieController = new SortieController()

const sortieRoutes = Router()
sortieRoutes.get('/', sortieController.getAllSorties)
sortieRoutes.get('/future', sortieController.getFutureSorties)
sortieRoutes.post('/', sortieController.createSortie)
sortieRoutes.get('/:id/accept', sortieController.acceptRequest)
sortieRoutes.delete('/:id', sortieController.deleteRequest)
sortieRoutes.put('/:id', sortieController.updateRequest)

export default sortieRoutes
