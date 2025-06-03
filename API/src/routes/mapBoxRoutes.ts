import {Router} from 'express'
import GeocodeController from "../controllers/mapBoxController"



const geocodeController = new GeocodeController()

const mapBoxRoutes = Router()
mapBoxRoutes.get('/getNeighborhood', geocodeController.getNeighborhood)
mapBoxRoutes.get('/getAdresseMapBox', geocodeController.getAdresseMapBox)


export default mapBoxRoutes
