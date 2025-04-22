import { Router } from 'express'
import NeighborhoodController from '../controllers/NeighborhoodController'

const neighborhoodController = new NeighborhoodController()

const neighborhoodRoutes = Router()
neighborhoodRoutes.post('/', neighborhoodController.createNeighborhood)
neighborhoodRoutes.get('/', neighborhoodController.getAllNeighborhoods)
neighborhoodRoutes.get('/:id', neighborhoodController.getNeighborhood)
neighborhoodRoutes.put('/:id', neighborhoodController.updateNeighborhood)
neighborhoodRoutes.delete('/:id', neighborhoodController.deleteNeighborhood)
export default neighborhoodRoutes
