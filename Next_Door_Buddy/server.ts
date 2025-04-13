import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import socketHandler from "#/server/sockets";
import {parse} from "node:url";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = Number(process.env.NEXT_PUBLIC_SOCKET_PORT)|| 3005;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url!, true)
        handler(req, res, parsedUrl)
    })

    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        socketHandler(socket,io);
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(
                `> Server listening at http://localhost:${port} as ${
                    dev ? 'development' : process.env.NODE_ENV
                }`
            )
        });

});
