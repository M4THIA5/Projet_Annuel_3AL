"use client"
import React, {useEffect, useState} from 'react';


function ChatBar({socket}){
    const [users, setUsers] = useState([]);
    useEffect(() => {
        if (!socket){
            console.log("Socket not ready yet");
            return;
        }
        console.log(socket)
        socket.on('newUserResponse', (data) => setUsers(data));
    }, [socket, users]);
    return (
        <div className="chat__sidebar">
            <h2>Open Chat</h2>

            <div>
                <h4 className="chat__header">ACTIVE USERS</h4>
                <div className="chat__users">
                    {users.map((user) => (
                    <p key={user.userID}>{user.username}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChatBar;
