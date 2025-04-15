import express from "express"
import { setUserRoutes } from "./routes/userRoutes"
import errorHandler from "./middleware/errorHandler"
import notFoundHandler from "./middleware/notFoundHandler"
import {setPostgreRoutes} from "./routes/Postgre"
import {setMongoRoutes} from "./routes/MongoDB"
import cors from "cors"
import useUtilsRoutes from "./routes/utils"
import {setNeighborhoodRoutes} from "./routes/neighborhoodRoutes"
import {setUserNeighborhoodRoutes} from "./routes/userNeighborhoodRoutes"

const app = express()
app.use(express.json())
app.use(cors())

setUserRoutes(app)
setPostgreRoutes(app)
setMongoRoutes(app)
useUtilsRoutes(app)
setNeighborhoodRoutes(app)
setUserNeighborhoodRoutes(app)
app.use(notFoundHandler)
app.use(errorHandler)

export default app
