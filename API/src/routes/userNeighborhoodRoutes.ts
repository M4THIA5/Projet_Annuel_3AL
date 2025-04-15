import { Router } from 'express'
import UserNeighborhoodController from '../controllers/UserNeighborhoodController'

const userNeighborhoodController = new UserNeighborhoodController()

export function setUserNeighborhoodRoutes(app: Router) {
    app.post('/user-neighborhoods', userNeighborhoodController.linkUserToNeighborhood)
    app.get('/user-neighborhoods', userNeighborhoodController.getAllUserNeighborhoods)
    app.get('/user-neighborhoods/user/:userId', userNeighborhoodController.getNeighborhoodsOfUser)
    app.get('/user-neighborhoods/neighborhood/:neighborhoodId', userNeighborhoodController.getUsersOfNeighborhood)
    app.delete('/user-neighborhoods', userNeighborhoodController.unlinkUserFromNeighborhood)
}
