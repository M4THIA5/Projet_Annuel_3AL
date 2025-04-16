"use client"
import React, {useEffect, useRef, useState} from 'react'
import ChatBar from './Bar'
import ChatBody from './Body'
import ChatFooter from './Footer'
import {useSocket} from "#/components/SocketProvider"


function ChatPage({userName}: { userName: string }) {
    const [messages, setMessages] = useState([])
    const socket = useSocket()
    const [typingStatus, setTypingStatus] = useState('')
    const lastMessageRef = useRef(null)
    useEffect(() => {
        if (!socket || !userName) return

        socket.username = userName
        const handleMessage = (data) => {
            setMessages((prev) => [...prev, data])
        }

        socket.on('message_sent', handleMessage)
        socket.on('typingResponse', (data) => setTypingStatus(data))

        return () => {
            socket.off('message_sent', handleMessage)
        }
    }, [socket, userName])
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
                    user={userName}
                    lastMessageRef={lastMessageRef}
                    typingStatus={typingStatus}
                />
                <ChatFooter socket={socket} user={userName}/>
            </div>
        </div>
    )
}

export default ChatPage
