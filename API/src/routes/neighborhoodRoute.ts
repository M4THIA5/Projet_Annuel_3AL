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

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }
        cb(null, uploadDir)
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

const upload = multer({ storage:storage , limits: { fieldSize: 10 * 1024 * 1024 } })


const neighborhoodRoutes = Router()
neighborhoodRoutes.post('/', neighborhoodController.createNeighborhood)
neighborhoodRoutes.get('/', neighborhoodController.getAllNeighborhoods)
neighborhoodRoutes.get('/:id', neighborhoodController.getNeighborhood)
neighborhoodRoutes.put('/:id', upload.single('image'), neighborhoodController.updateNeighborhood)
neighborhoodRoutes.delete('/:id', neighborhoodController.deleteNeighborhood)

export default neighborhoodRoutes
