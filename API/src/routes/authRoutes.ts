import { Router } from 'express'
import AuthController from '../controllers/authController'
import { verifyJwt } from '../middleware/verifyJwt'

const authController = new AuthController()

const authRoutes = Router()
authRoutes.post('/login', authController.login)
authRoutes.post('/register', authController.register)
authRoutes.post('/logout', verifyJwt, authController.logout)
authRoutes.post('/refresh-access-token', authController.handleRefreshToken)
authRoutes.post('/resend-otp', authController.resendOtp)
authRoutes.post('/verify-otp', authController.verifyOtp)

export default authRoutes
