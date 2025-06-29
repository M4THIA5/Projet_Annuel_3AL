import {Router} from 'express'
import TrocController from '../controllers/trocController'


const trocController = new TrocController()

const trocRoutes = Router()
trocRoutes.get('/', trocController.getAll)
trocRoutes.get('/:id', trocController.getOne)
trocRoutes.post('/', trocController.create)
trocRoutes.put('/:id', trocController.modify)
trocRoutes.delete('/:id', trocController.delete)

export default trocRoutes
