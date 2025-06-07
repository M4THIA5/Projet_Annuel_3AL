"use client"
import {useEffect, useRef, useState} from "react"
import {MySocket, useSocket} from "./socketProvider"

export function ChatWrapper({firstName, lastName}: { firstName: string, lastName: string }) {
    const [messages, setMessages] = useState<Message[]>([])
    const socket = useSocket()
    const [typingStatus, setTypingStatus] = useState('')
    const lastMessageRef = useRef(null)
    const userName: string = firstName + " " + lastName
    useEffect(() => {
        if (!socket) return

        const handleMessage = (data: Message) => {
            setMessages((prev: Message[]) => [...prev, data])
        }
        socket.on('connected', (data: Message[]) => {
            console.log("Connected messages:", data)
            setMessages(() => data.messageData)
        })
        socket.on('message_sent', handleMessage)
        socket.on('typingResponse', (data) => setTypingStatus(data))

        return () => {
            socket.off('message_sent', handleMessage)
        }
    }, [socket])
    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        lastMessageRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [messages])

    return (
        <div className="chat">
            <ChatBar socket={socket}/>
            <div className="chat__main">
                <ChatBody
                    messages={messages}
                    user={{firstName, lastName}}
                    lastMessageRef={lastMessageRef}
                    typingStatus={typingStatus}
                />
                <ChatFooter socket={socket} user={userName}/>
            </div>
        </div>
    )
}

type Message = {
    id: number
    text: string
    name: {
        firstName: string
        lastName: string
    }
}

function ChatBody({messages, user, lastMessageRef, typingStatus}: {
    messages: Message[]
    user: {
        firstName: string
        lastName: string
    }
    lastMessageRef: React.RefObject<HTMLDivElement>
    typingStatus: string
}) {

    const handleLeaveChat = () => {
        localStorage.removeItem('userName')
        window.location.reload()
    }
    const username = user.firstName + " " + user.lastName
    console.log(messages)
    return (
        <>
            <header className="chat__mainHeader">
                <p>Hangout with Colleagues</p>
                <button className="leaveChat__btn" onClick={handleLeaveChat}>
                    LEAVE CHAT
                </button>
            </header>
            {/*This shows messages sent from you*/}
            <div className="message__container">
                {messages.map((message) =>
                    message.name === username ? (
                        <div className="message__chats" key={message.id}>
                            <p className="sender__name">You</p>
                            <div className="message__sender">
                                <p>{message.text}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="message__chats" key={message.id}>
                            <p>{`${message.name}`}</p>
                            <div className="message__recipient">
                                <p>{message.text}</p>
                            </div>
                        </div>
                    )
                )}

                {/*This is triggered when a user is typing*/}
                <div className="message__status">
                    <p>{typingStatus}</p>
                </div>
                <div ref={lastMessageRef}/>
            </div>
        </>
    )
}

function ChatFooter({socket, user}: {
    user: {
        firstName: string
        lastName: string
    }
    socket: MySocket
}) {

    const [message, setMessage] = useState('')
    const handleTyping = () => socket.emit('typing', user)
    const handleEndTyping = () => setTimeout(() => socket.emit('ntyping', user), 5000)
    const handleSendMessage = (e: { preventDefault: () => void }) => {
        e.preventDefault()
        if (message.trim()) {
            if (!socket) {
                console.log("socket is not ready")
                return
            }
            socket.emit('send_message', {
                text: message,
                name: user,
                id: `${user}${Math.random()}`,
                socketID: socket.id,
            })
        }
        setMessage('')
    }
    return (
        <div className="chat__footer">
            <form className="form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Write message"
                    className="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleTyping}
                    onKeyUp={handleEndTyping}
                />
                <button className="sendBtn">SEND</button>
            </form>
        </div>
    )
}

function ChatBar({socket}: { socket: MySocket }) {
    const [users, setUsers] = useState([])
    useEffect(() => {
        if (!socket) {
            console.log("Socket not ready yet")
            return
        }
        socket.on('newUser', (data) => setUsers(data))
    }, [socket, users])
    return (
        <div className="chat__sidebar">
            <h2>Open Chat</h2>

            <div>
                <h4 className="chat__header">ACTIVE USERS</h4>
                <div className="chat__users">
                    {users.map((user) => (
                        <p key={user.userID + "" + Math.random()}>{user.username}</p>
                    ))}
                </div>
            </div>
        </div>
    )
}
