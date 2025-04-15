import { Router } from 'express'
import NeighborhoodController from '../controllers/NeighborhoodController'

const neighborhoodController = new NeighborhoodController()

export function setNeighborhoodRoutes(app: Router) {
    app.post('/neighborhoods', neighborhoodController.createNeighborhood)
    app.get('/neighborhoods', neighborhoodController.getAllNeighborhoods)
    app.get('/neighborhoods/:id', neighborhoodController.getNeighborhood)
    app.put('/neighborhoods/:id', neighborhoodController.updateNeighborhood)
    app.delete('/neighborhoods/:id', neighborhoodController.deleteNeighborhood)
}
