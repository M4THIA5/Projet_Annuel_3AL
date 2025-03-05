"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = require("./routes/userRoutes");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, userRoutes_1.setUserRoutes)(app);
app.use("/", (req, res) => {
    res.status(200).json({ message: "Hello World !" });
});
app.use("/health", (req, res) => {
    res.status(200).json({ message: "Server is up and running !" });
});
app.use(errorHandler_1.default);
exports.default = app;
