import app from "./app"
import { config } from "./config/env"

const PORT = config.PORT
const HOST = config.HOST

const start = async (): Promise<void> => {
  try {
    app.listen(PORT, () => { // Starts the server on port 3001
      console.log(`🚀 Server running on ${HOST}:${PORT}`)
    })
  } catch (error) {
    console.error(error) // Logs any errors that occur
    process.exit(1) // Exits the process with an error status code
  }
}

void start()
