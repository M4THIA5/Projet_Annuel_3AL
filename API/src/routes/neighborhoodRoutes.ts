import { Router } from 'express';
// @ts-ignore
import NeighborhoodController from '../controllers/neighborhoodController';

const neighborhoodController = new NeighborhoodController();

export function setNeighborhoodRoutes(app: Router) {
    app.post('/neighborhoods', neighborhoodController.createNeighborhood);
    app.get('/neighborhoods', neighborhoodController.getAllNeighborhoods);
    app.get('/neighborhoods/:id', neighborhoodController.getNeighborhood);
    app.put('/neighborhoods/:id', neighborhoodController.updateNeighborhood);
    app.delete('/neighborhoods/:id', neighborhoodController.deleteNeighborhood);
}
