import {Server, Socket} from 'socket.io';
interface CurrentUser {
    userID: string,
    username: string,
}

let users: CurrentUser[] = [];
const socketHandler = (socket: Socket, io: Server): void => {
    console.log('A user connected:', socket.id);
    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data);
    })
    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data);
    })
    socket.on('drawEnd', (data) => {
        socket.broadcast.emit('drawEnd', data);
    })

    socket.on('send_message', (data) => {
        io.emit('message_sent', data);
    });
    socket.on('newUser', (data) => {
        users.push(data);  // Ajoute le nouvel utilisateur
        console.log('Liste des utilisateurs:', users);
        io.emit('newUser', users);  // Envoie la liste à tous les clients
    });

    for (const [id, socket] of io.of("/").sockets) {
        users.push({
            userID: id,
            username: socket.username,
        });
    }
    socket.emit("users", users);

    // notify existing users
    socket.broadcast.emit("user connected", {
        userID: socket.id,
        username: socket.username,
    });

    // forward the private message to the right recipient
    socket.on("private message", ({content, to}) => {
        socket.to(to).emit("private message", {
            content,
            from: socket.id,
        });
    });

    // notify users upon disconnection
    socket.on("disconnect", () => {
        socket.broadcast.emit("user disconnected", socket.id);
        users = users.filter(user => user.userID !== socket.id);
        // console.log(users);
        //Sends the list of users to the client
        io.emit('newUser', users);
    });


};

export default socketHandler;
