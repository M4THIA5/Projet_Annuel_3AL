import express from "express";
import type { Request, Response } from "express";
import { setUserRoutes } from "./routes/userRoutes";
import errorHandler from "./middleware/errorHandler";
import { PrismaClient } from "@prisma/client";
import notFoundHandler from "./middleware/notFoundHandler";
import { setAuthRoutes } from "./routes/authRoutes";
import cors from "cors"

const prisma = new PrismaClient()

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "Hello World !" });
})

app.get("/health", async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "Server is up and running !" });
})

setAuthRoutes(app);
setUserRoutes("/users", app);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;