import { Router } from "express"
import UserNeighborhoodController from "../controllers/userNeighborhoodController"
import userRoutes from "./userRoutes";

const userNeighborhoodController = new UserNeighborhoodController()
const userNeighborhoodRoutes = Router()
userNeighborhoodRoutes.post('/', userNeighborhoodController.linkUserToNeighborhood)
userNeighborhoodRoutes.get('/', userNeighborhoodController.getAllUserNeighborhoods)
userNeighborhoodRoutes.get('/user/:userId', userNeighborhoodController.getNeighborhoodsOfUser)
userNeighborhoodRoutes.get('/neighborhood/:neighborhoodId', userNeighborhoodController.getUsersOfNeighborhood)
userNeighborhoodRoutes.get('/neighborhoodsAroundMe/:userId', userNeighborhoodController.getNearbyNeighborhoodsBasedOnUsers)
userNeighborhoodRoutes.get('/roleinarea/:userId/:neighborhoodId', userNeighborhoodController.getRoleInArea)
export default userNeighborhoodRoutes
