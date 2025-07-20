import type {Request, Response} from "express"
import express, {urlencoded} from "express"
import cors from "cors"
import {config} from "./config/env"

import {PrismaClient as PostgresClient} from "../prisma/client/postgresClient"
import {PrismaClient as MongoClient} from "../prisma/client/mongoClient"

import errorHandler from "./middleware/errorHandler"
import neighborhoodRoutes from "./routes/neighborhoodRoute"
import authRoutes from "./routes/authRoutes"
import userRoutes from "./routes/userRoutes"
import serviceRoutes from "./routes/serviceRoutes"
import userNeighborhoodRoutes from "./routes/userNeighborhoodRoute"
import journalRoutes from "./routes/journalRoutes"
import mapBoxRoutes from "./routes/mapBoxRoutes"
import { verifyJwt } from "./middleware/verifyJwt"
import cookieParser from "cookie-parser"
import objetRoutes from "./routes/objetRoutes";
import chatRoutes from "./routes/chatRoute"
import postRoutes from "./routes/postRoutes";
import trocRoutes from "./routes/trocRoutes";
import sortieRoutes from "./routes/sortieRoutes";

const postgresClient = new PostgresClient()
const mongoClient = new MongoClient()

const app = express()
app.use(express.json())
app.use(cookieParser())

app.use(cors({ credentials: true, origin: config.NODE_ENV === "production" ? `https://laporteacote.online` : "http://localhost:3000" }))
app.options("*", cors({ credentials: true, origin: "https://laporteacote.online" }));
app.use(urlencoded({ extended: true }))

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

app.use("/", authRoutes)
app.use("/users", verifyJwt, userRoutes)
app.use("/neighborhoods", verifyJwt, neighborhoodRoutes)
app.use("/user-neighborhoods", verifyJwt, userNeighborhoodRoutes)
app.use("/journal", verifyJwt, journalRoutes)
app.use("/geocode", mapBoxRoutes)
app.use("/objets", verifyJwt, objetRoutes)
app.use("/chat", verifyJwt, chatRoutes)
app.use("/post", verifyJwt, postRoutes)
app.use("/troc", verifyJwt, trocRoutes)

app.use("/services", serviceRoutes)
app.use("/sorties", verifyJwt, sortieRoutes)

// app.use(notFoundHandler)
app.use(errorHandler)

export default app
