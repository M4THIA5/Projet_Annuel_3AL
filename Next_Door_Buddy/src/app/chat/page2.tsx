"use client"
import React, { useState, useEffect } from "react"
import './style.css'
import User, {UserInterface} from "#/components/User"
import MessagePanel from "#/components/MessagePanel"
import {useSocket} from "#/components/SocketProvider"
const Chat = () => {
    const [selectedUser, setSelectedUser] = useState(null)
    const [users, setUsers] = useState([])
    const socket = useSocket()
    // Socket connection and event listeners
    useEffect(() => {
        if (!socket) {
            console.log("Socket not ready yet")
            return
        }
        const initReactiveProperties = (user:UserInterface) => {
            user.connected = true
            user.messages = []
            user.hasNewMessages = false
        }
        if (!socket) {
            console.log("Socket not ready yet")
            return
        }
        socket.on("connect", () => {
            console.log("connected")
            console.log(users)
            users.forEach((user:UserInterface) => {
                if (user.self) {
                    user.connected = true
                }
            })
        })
        socket.on("disconnect", () => {
            users.forEach((user:UserInterface) => {
                if (user.self) {
                    user.connected = false
                }
            })
        })
        socket.on("users", (users) => {
            users.forEach((user:UserInterface) => {
                user.self = user.userID === socket.id
                initReactiveProperties(user)
            })
            setUsers(
                users
                    .sort((a:UserInterface, b:UserInterface) => {
                        if (a.self) return -1
                        if (b.self) return 1
                        return a.username < b.username ? -1 : 1
                    })
            )
        })
        socket.on("user connected", (user:UserInterface) => {
            initReactiveProperties(user)
            setUsers((prevUsers:UserInterface[]) => [...prevUsers, user])
        })
        socket.on("user disconnected", (id:string) => {
            setUsers((prevUsers:UserInterface[]) =>
                prevUsers.map((user:UserInterface) =>
                    user.userID === id ? { ...user, connected: false } : user
                )
            )
        })
        socket.on("private message", ({ content, from }) => {
            setUsers((prevUsers:UserInterface[]) =>
                prevUsers.map((user) => {
                    if (user.userID === from) {
                        user.messages.push({ content, fromSelf: false })
                        if (user !== selectedUser) {
                            user.hasNewMessages = true
                        }
                    }
                    return user
                })
            )
        })
        // Cleanup socket listeners on component unmount
        return () => {
            socket.off("connect")
            socket.off("disconnect")
            socket.off("users")
            socket.off("user connected")
            socket.off("user disconnected")
            socket.off("private message")
        }
    }, [socket, selectedUser, users])

    // Handle the message sending
    const onMessage = (content) => {
        if (selectedUser) {
            if (!socket) {
                console.log("Socket not ready yet")
                return
            }
            socket.emit("private message", {
                content,
                to: selectedUser.userID,
            })
            setSelectedUser((prevUser) => ({
                ...prevUser,
                messages: [
                    ...prevUser.messages,
                    { content, fromSelf: true }
                ],
            }))
        }
    }
    // Handle user selection
    const onSelectUser = (user:UserInterface) => {
        setSelectedUser(user)
        user.hasNewMessages = false
    }


    return (
        <div className={"h-100"}>
            <div className="left-panel">
                {users.map((user) => (
                    <User
                        key={user.userID}
                        user={user}
                        selected={selectedUser === user}
                        onSelect={() => onSelectUser(user)}
                    />
                ))}
            </div>
            {selectedUser && (
                <MessagePanel
                    user={selectedUser}
                    onInput={onMessage}
                    className="right-panel"
                />
            )}
        </div>
    )
}
export default Chat
