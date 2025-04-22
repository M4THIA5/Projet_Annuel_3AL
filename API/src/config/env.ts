import dotenv from "dotenv"
import path from "path"

// Charger le bon fichier .env en fonction de NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || "development"}`
dotenv.config({ path: path.resolve(process.cwd(), envFile) })

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",

  HOST: process.env.HOST || "localhost",
  PORT: process.env.PORT || 3001,

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "",
}
