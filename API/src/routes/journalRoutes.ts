import {Router} from 'express'
import JournalController from '../controllers/journalController'


const journalController = new JournalController()

const journalRoutes = Router()
journalRoutes.get('/', journalController.getAll)
journalRoutes.get('/:id', journalController.getOne)
journalRoutes.post('/', journalController.create)
journalRoutes.put('/:id', journalController.modify)
journalRoutes.delete('/:id', journalController.delete)

export default journalRoutes
