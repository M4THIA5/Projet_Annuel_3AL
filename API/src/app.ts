import express, { urlencoded } from "express"
import type { Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { config } from "./config/env"

import { PrismaClient as PostgresClient } from "../prisma/postgresql/client"
import { PrismaClient as MongoClient } from "../prisma/mongodb/client"

import errorHandler from "./middleware/errorHandler"
import notFoundHandler from "./middleware/notFoundHandler"
import neighborhoodRoutes from "./routes/neighborhoodRoute"
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"
import userNeighborhoodRoutes from "./routes/userNeighborhoodRoute"

const postgresClient = new PostgresClient()
const mongoClient = new MongoClient()

const app = express()
app.use(express.json())
app.use(cors({ credentials: true, origin: `${config.HOST}:3000` }))
app.use(urlencoded({ extended: false }))
app.use(cookieParser())

app.get("/", async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: "Hello World !" })
})

app.get("/health", async (req: Request, res: Response): Promise<void> => {
  try {
    await postgresClient.$connect()
    await mongoClient.$connect()
    res.status(200).json({ message: "Server is up and running and database is up !" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Database is down !" })
    return
  }
})

app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/neighborhoods", neighborhoodRoutes)
app.use("/user-neighborhoods", userNeighborhoodRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app