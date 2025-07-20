import dotenv from "dotenv"
import path from "path"

// Charger le bon fichier .env en fonction de NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || "development"}`
dotenv.config({ path: path.resolve(process.cwd(), envFile) })

console.log(`Environment: ${process.env.NODE_ENV || "development"}`)

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",

  HOST: process.env.HOST || "localhost",
  PORT: process.env.PORT || 3001,

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",

  MAPBOX_API_KEY: process.env.MAPBOX_API_KEY || "",

  EMAIL_USER: process.env.EMAIL_USER || "",
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "",
  EMAIL_HOST: process.env.EMAIL_HOST || "",
  EMAIL_PORT: process.env.EMAIL_PORT || 465,

  NEO4J_URL: process.env.NEO4J_URL || "bolt://localhost:7687",
  NEO4J_USER: process.env.NEO4J_USER || "neo4j",
  NEO4J_PASSWORD: process.env.NEO4J_PASSWORD || "password",
}
