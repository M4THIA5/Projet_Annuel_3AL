import express from "express";
import type { Request, Response } from "express";
import { setUserRoutes } from "./routes/userRoutes";
import errorHandler from "./middleware/errorHandler";
import notFoundHandler from "./middleware/notFoundHandler";
import {setPostgreRoutes} from "./routes/Postgre";
import {setMongoRoutes} from "./routes/MongoDB";
import cors from "cors";
import useUtilsRoutes from "./routes/utils";
import UtilsController from "./controllers/UtilsController";

const app = express();
app.use(express.json());
app.use(cors());
const utilsController = new UtilsController();
app.get("/", utilsController.home)
app.get("/health", utilsController.healthCheck);

setUserRoutes(app);
setPostgreRoutes(app);
setMongoRoutes(app);
useUtilsRoutes(app);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;