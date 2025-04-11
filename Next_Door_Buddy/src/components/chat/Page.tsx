"use client"
import React, {useEffect, useState} from 'react';
import ChatBar from './Bar';
import ChatBody from './Body';
import ChatFooter from './Footer';
import {useSocket} from "#/components/SocketProvider";
import {getUser, getUserName} from "#/lib/dal";


function ChatPage() {
    const [messages, setMessages] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        async function asyncGetUserName()
        {
            return await getUserName(getUser());
        }
        if (!socket) {
            console.log("socket is not ready")
            return
        }
        const userName = asyncGetUserName();
        socket.emit('newUser', {userName, socketID: socket.id});
        socket.on('messageResponse', (data) => setMessages([...messages, data]));
        console.log(messages)
    }, [socket, messages]);

    return (
        <div className="chat">
        <ChatBar socket={socket} />
        <div className="chat__main">
            <ChatBody messages={messages}/>
            <ChatFooter socket={socket} />
            </div>
            </div>
    );
};

export default ChatPage;
