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
authRoutes.get('/isValid/:email', authController.isValidEmail)
authRoutes.put('/reset-password-code', authController.resetPasswordCode)
authRoutes.post('/check-reset-password-code', authController.checkResetPasswordCode)
authRoutes.put('/reset-password', authController.resetPassword)

export default authRoutes
