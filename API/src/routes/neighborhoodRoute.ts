import { Router } from "express"
import NeighborhoodController from "../controllers/neighborhoodController"
import multer from "multer"
import path from "path"
import fs from "fs"

const neighborhoodController = new NeighborhoodController()

const uploadDir = path.join(__dirname, '..', '..','..','Next_Door_Buddy','public', 'uploads')
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}



const neighborhoodRoutes = Router()
neighborhoodRoutes.post('/', neighborhoodController.createNeighborhood)
neighborhoodRoutes.get('/', neighborhoodController.getAllNeighborhoods)
neighborhoodRoutes.get('/:id', neighborhoodController.getNeighborhood)
neighborhoodRoutes.put('/:id', neighborhoodController.updateNeighborhood)
neighborhoodRoutes.delete('/:id', neighborhoodController.deleteNeighborhood)

export default neighborhoodRoutes
