"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setUserRoutes = setUserRoutes;
const userController_1 = __importDefault(require("../controllers/userController"));
const userController = new userController_1.default();
function setUserRoutes(app) {
    app.post('/users', userController.createUser);
    app.get('/users', userController.getAllUsers);
    app.get('/users/:id', userController.getUser);
    app.put('/users/:id', userController.updateUser);
    app.delete('/users/:id', userController.deleteUser);
}
