import {Router} from 'express'
import TrocController from '../controllers/trocController'
import multer from "multer";


const trocController = new TrocController()

const upload =multer()

const trocRoutes = Router()
trocRoutes.get('/', trocController.getAll)
trocRoutes.post('/', trocController.create)
trocRoutes.get('/:id', trocController.getOne)
trocRoutes.get('/:id/items', trocController.getItems)
trocRoutes.post('/:id/finalize', trocController.troc)
trocRoutes.post('/:id/propose', upload.none(),trocController.propose)
trocRoutes.put('/:id/accept', upload.none(),trocController.accept)
trocRoutes.delete('/:id/refuse', upload.none(),trocController.refuse)
trocRoutes.put('/:id', trocController.modify)
trocRoutes.delete('/:id', trocController.cancel)

export default trocRoutes
