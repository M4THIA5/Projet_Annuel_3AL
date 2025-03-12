import express from "express";
import type { Request, Response } from "express";
import { setUserRoutes } from "./routes/userRoutes";
import errorHandler from "./middleware/errorHandler";
import { PrismaClient } from "@prisma/client";
import notFoundHandler from "./middleware/notFoundHandler";
import {setMySQLRoutes} from "./routes/mySQL";
import {setMongoRoutes} from "./routes/MongoDB";
import cors from "cors";
import useUtilsRoutes from "./routes/utils";

const prisma = new PrismaClient()

const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (req: Request, res: Response): void => {
  res.status(200).json({ message: "Hello World !" });
})

app.get("/health", (req: Request, res: Response): void => {
  res.status(200).json({ message: "Server is up and running !" });
})

setUserRoutes(app);
setMySQLRoutes(app);
setMongoRoutes(app);
useUtilsRoutes(app);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;