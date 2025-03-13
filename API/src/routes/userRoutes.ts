import { Router } from 'express';
import UserController from '../controllers/userController';

const userController = new UserController();

export function setUserRoutes(defaultRoute:string, app: Router) {
    app.post(`${defaultRoute}/`, userController.createUser);
    app.get(`${defaultRoute}/`, userController.getAllUsers);
    app.get(`${defaultRoute}/:id`, userController.getUser);
    app.put(`${defaultRoute}/:id`, userController.updateUser);
    app.delete(`${defaultRoute}/:id`, userController.deleteUser);
}