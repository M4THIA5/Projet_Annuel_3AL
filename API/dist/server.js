"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const PORT = env_1.config.PORT;
const HOST = env_1.config.HOST;
const start = async () => {
    try {
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on ${HOST}:${PORT}`);
        });
    }
    catch (error) {
        console.error(error); // Logs any errors that occur
        process.exit(1); // Exits the process with an error status code
    }
};
void start();
