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

    socket.on('message', (data) => {
        io.emit('messageResponse', data);
    });
    const users: any[] = [];
    socket.on('newUser', (data) => {
        //Adds the new user to the list of users
        users.push(data);
        // console.log(users);
        //Sends the list of users to the client
        socket.broadcast.emit('newUserResponse', users);
    });
    for (const [id,socket ]of io.of("/").sockets) {
        users.push({
            userID: id,
            username: socket.id,
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

        users = users.filter((user) => user.socketID !== socket.id);
        // console.log(users);
        //Sends the list of users to the client
        socket.emit('newUserResponse', users);
    });



};

export default socketHandler;
