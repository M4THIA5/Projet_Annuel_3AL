import { Router } from "express"
import ChatController from "../controllers/ChatController"

const chatController = new ChatController()

const chatRoutes = Router()
chatRoutes.post('/group', chatController.createGroupChat)
chatRoutes.get('/group', chatController.getUserGroups)
chatRoutes.get('/people', chatController.getAllChatUsers)
chatRoutes.delete('/:id', chatController.deletechat)

export default chatRoutes
