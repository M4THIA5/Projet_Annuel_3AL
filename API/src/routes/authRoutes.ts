import { Router } from 'express'
import AuthController from '../controllers/authController'
import { verifyJwt } from '../middleware/verifyJwt'

const authController = new AuthController()

export function setAuthRoutes(app: Router) {
    app.post('/login', authController.login)
    app.post('/logout', verifyJwt, authController.logout)
    app.post('/refresh-access-token', authController.handleRefreshToken)
}
