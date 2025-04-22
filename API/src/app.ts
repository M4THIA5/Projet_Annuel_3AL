import express from "express"
import cors from "cors"

import userRoutes from "./routes/userRoutes"
import postgreRoutes from "./routes/Postgre"
import mongoRoutes from "./routes/MongoDB"
import setNeighborhoodRoutes from "./routes/neighborhoodRoutes"
import utilsRoutes from "./routes/utils"
import userNeighborhoodRoutes from "./routes/userNeighborhoodRoutes"

const app = express()
app.use(express.json())
app.use(cors())

app.use("/", utilsRoutes)
app.use("/users", userRoutes)
app.use("/neighborhoods", setNeighborhoodRoutes)
app.use("/postgre", postgreRoutes)
app.use("/mongo", mongoRoutes)
app.use("/user-neighborhoods", userNeighborhoodRoutes)

export default app
