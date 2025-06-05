import app from "./app"
import {config} from "./config/env"
import http from 'http';
import {Server} from "socket.io";
import socketHandler from "./server/sockets";

const PORT = config.PORT
const HOST = config.HOST

const start = async (): Promise<void> => {
  try {
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    })
    server.listen(3002, () => {
      console.log('listening on *:3002');
    });

    io.on("connection", (socket) => {
      socketHandler(socket, io)
    })



    app.listen(PORT, () => { // Starts the server on port 3001
      console.log(`🚀 Server running on ${HOST}:${PORT}`)
    })
  } catch (error) {
    console.error(error) // Logs any errors that occur
    process.exit(1) // Exits the process with an error status code
  }
}

void start()
