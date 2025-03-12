import { Router } from 'express';
import PostgreController from '../controllers/PostgreController';

const mySQLController = new PostgreController();

export function setMySQLRoutes(app: Router) {
    app.post('/mysql/create', mySQLController.createUser);
    app.get('/mysql/get', mySQLController.getData);
}