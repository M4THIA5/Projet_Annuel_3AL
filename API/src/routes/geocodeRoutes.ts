import {Router} from 'express'
import GeocodeController from "../controllers/geocodeController"



const geocodeController = new GeocodeController()

const geocodeRoutes = Router()
geocodeRoutes.get('/getNeighborhood', geocodeController.getNeighborhood)


export default geocodeRoutes
