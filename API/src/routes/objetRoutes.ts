import {Router} from 'express'
import ObjetController from "../controllers/objetController"
import multer from "multer"
import path from "path"
import fs from "fs"

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

const objetController = new ObjetController()

const objetRoutes = Router()
objetRoutes.get('/:id', objetController.getOneObjet)
objetRoutes.get('/', objetController.getObjets)
objetRoutes.post('/', upload.single('image'), objetController.createObjet)
objetRoutes.put('/:id', upload.single('image'), objetController.modifyObjet)
objetRoutes.delete('/:id', objetController.deleteObjet)


export default objetRoutes
