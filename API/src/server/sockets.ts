import {Server, Socket} from 'socket.io'
import {PrismaClient as MongoClient} from '../../prisma/client/mongoClient'

interface CurrentUser {
    userID: string,
    username: string,
}
declare module "socket.io" {
    interface Socket {
        username?: string;
    }
}
let users: CurrentUser[] = []
const db = new MongoClient()

async function saveMessage(data: {
    id: string,
    name: string,
    socketID: string
    text: string,
    room?: string
}) {

    await db.message.create({
        data: {
            id: data.id,
            name: data.name,
            socketID: data.socketID,
            text: data.text,
            room: data.room || "",
            createdAt: new Date(),
        }
    },)
}

async function getMessages(props: any = {room: ""}): Promise<any[]> {
    return await db.message.findMany({
        where: props,
        orderBy: {
            createdAt: 'asc',
        },
    })

}

const socketHandler = async (socket: Socket, io: Server): Promise<void> => {
    console.log('A user connected:', socket.id)

    const messages = await getMessages();
    socket.emit('connected', {messageData: messages})

    socket.on('drawing', (data) => {
        socket.broadcast.emit('drawing', data)
    })
    socket.on('draw', (data) => {
        socket.broadcast.emit('draw', data)
    })
    socket.on('drawEnd', (data) => {
        socket.broadcast.emit('drawEnd', data)
    })

    socket.on('send_message', async (data) => {
        await saveMessage(data)
        if (data.room) {
            io.to(data.room).emit('message_sent', data)
        } else {
            io.emit('message_sent', data)  // Envoie le message à tous les clients
        }
    })
    socket.on('newUser', (data) => {
        users.push(data)  // Ajoute le nouvel utilisateur
        console.log('Liste des utilisateurs:', users)
        io.emit('newUser', users)  // Envoie la liste à tous les clients
    })

    for (const [id, socket] of io.of("/").sockets) {
        users.push({
            userID: id,
            username: socket.username??"Anonymous",
        })
    }
    socket.emit("users", users)
    socket.emit("newUser", users)

    let peopleTyping: string[] = []
    socket.on('typing', (data) => {
        if (!peopleTyping.includes(data)) {
            peopleTyping.push(data)
        }
        const message = peopleTyping.length > 1 ?
            "" + peopleTyping.join(", ") + " are typing..." :
            (peopleTyping.length === 0 ? "" : peopleTyping[0] + " is typing...")
        socket.to(data.room).emit('typingResponse', message)
    })
    socket.on('ntyping', (data) => {
        peopleTyping = peopleTyping.filter((name) => name !== data)
        const message = peopleTyping.length > 1 ?
            "" + peopleTyping.join(", ") + " are typing..." :
            (peopleTyping.length === 0 ? "" : peopleTyping[0] + " is typing...")

        socket.to(data.room).emit('typingResponse', message)
    })

    // notify existing users
    socket.broadcast.emit("user connected", {
        userID: socket.id,
        username: socket.username,
    })

    // forward the private message to the right recipient
    socket.on("private message", ({content, to}) => {
        socket.to(to).emit("private message", {
            content,
            from: socket.id,
        })
    })

    socket.on("join_room", async (roomId: string) => {
        await socket.join(roomId)
        console.log(`Socket ${socket.id} joined room ${roomId}`)

        // Envoie les messages de cette room uniquement
        const roomMessages = await getMessages({ room: roomId })
        socket.emit("connected", { messageData: roomMessages })
    })

    // notify users upon disconnection
    socket.on("disconnect", () => {
        socket.broadcast.emit("user disconnected", socket.id)
        users = users.filter(user => user.userID !== socket.id)

        //Sends the list of users to the client
        io.emit('newUser', users)
    })


}

export default socketHandler
