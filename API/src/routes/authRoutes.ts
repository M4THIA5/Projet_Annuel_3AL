import { Router } from 'express';
import AuthController from '../controllers/authController';

const authController = new AuthController();

export function setAuthRoutes(app: Router) {
    app.post('/login', authController.login)
    app.post('/logout', authController.logout)
}