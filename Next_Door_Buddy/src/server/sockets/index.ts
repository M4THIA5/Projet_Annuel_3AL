import { Server, Socket } from 'socket.io';

const socketHandler = (socket: Socket, io: Server): void => {
    console.log('A user connected:', socket.id);
    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    })
    socket.on('draw',(data)=>{
        socket.broadcast.emit('draw',data);
    })
    socket.on('drawEnd', (data) => {
        socket.broadcast.emit('drawEnd', data);
    })
    const users = [];
    for (const id of io.of("/").sockets) {
        users.push({
            userID: id,
        });
    }
    socket.emit("users", users);

    // notify existing users
    socket.broadcast.emit("user connected", {
        userID: socket.id,
        username: socket.id,
    });

    // forward the private message to the right recipient
    socket.on("private message", ({ content, to }) => {
        socket.to(to).emit("private message", {
            content,
            from: socket.id,
        });
    });

    // notify users upon disconnection
    socket.on("disconnect", () => {
        socket.broadcast.emit("user disconnected", socket.id);
    });



};

export default socketHandler;
