import express, { urlencoded } from "express"
import type { Request, Response } from "express"
import { setUserRoutes } from "./routes/userRoutes"
import errorHandler from "./middleware/errorHandler"
import { PrismaClient } from "@prisma/client"
import notFoundHandler from "./middleware/notFoundHandler"
import { setAuthRoutes } from "./routes/authRoutes"
import cors from "cors"
import cookieParser from "cookie-parser"
import { config } from "./config/env"

const prisma = new PrismaClient()

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
    await prisma.$connect()
    res.status(200).json({ message: "Server is up and running and database is up !" })
  } catch (error) {
    res.status(500).json({ message: "Database is down !" })
    return
  }
})

setAuthRoutes(app)
setUserRoutes("/users", app)

app.use(notFoundHandler)
app.use(errorHandler)

export default app