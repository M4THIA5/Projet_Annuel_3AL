"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
function errorHandler(err, req, res, next) {
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        // Gérez les erreurs connues de Prisma
        res.status(400).json({ error: 'A Prisma error occurred', details: err.message });
    }
    else {
        console.error(err.stack);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.default = errorHandler;
