import { Router } from "express"
import UserNeighborhoodController from "../controllers/userNeighborhoodController"

const userNeighborhoodController = new UserNeighborhoodController()
const userNeighborhoodRoutes = Router()
userNeighborhoodRoutes.post('/', userNeighborhoodController.linkUserToNeighborhood)
userNeighborhoodRoutes.get('/', userNeighborhoodController.getAllUserNeighborhoods)
userNeighborhoodRoutes.get('/user/:userId', userNeighborhoodController.getNeighborhoodsOfUser)
userNeighborhoodRoutes.get('/neighborhood/:neighborhoodId', userNeighborhoodController.getUsersOfNeighborhood)
userNeighborhoodRoutes.get('/neighborhoodsAroundMe/:userId', userNeighborhoodController.getNearbyNeighborhoodsBasedOnUsers)

export default userNeighborhoodRoutes
