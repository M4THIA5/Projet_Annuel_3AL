"use client"
import React, {useEffect, useState} from 'react'
import ChatBar from './Bar'
import ChatBody from './Body'
import ChatFooter from './Footer'
import {useSocket} from "#/components/SocketProvider"


function ChatPage({userName}: { userName: string }) {
    const [messages, setMessages] = useState([])
    const socket = useSocket()
    useEffect(() => {
        if (!socket || !userName) return

        socket.username = userName
        const handleMessage = (data) => {
            setMessages((prev) => [...prev, data])
        }

        socket.on('message_sent', handleMessage)

        return () => {
            socket.off('message_sent', handleMessage)
        }
    }, [socket, userName])

    return (
        <div className="chat">
            <ChatBar socket={socket}/>
            <div className="chat__main">
                <ChatBody messages={messages} user={userName}/>
                <ChatFooter socket={socket} user={userName}/>
            </div>
        </div>
    )
}

export default ChatPage
