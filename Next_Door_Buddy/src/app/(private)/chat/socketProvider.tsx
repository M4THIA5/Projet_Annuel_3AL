'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketContextType {
    socket: Socket | null
}
export interface MySocket extends Socket {
    firstName?: string
    lastName?: string
}
const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [socket, setSocket] = useState<Socket | null>(null)


    useEffect(() => {
        const port = process.env.NEXT_PUBLIC_SOCKET_PORT || 3000
        // const socketInstance = io("http://localhost:3005")  for different server websocket url
        const socketInstance = io("http://localhost:"+port, {
            transports: ['websocket'],
        })
        setSocket(socketInstance)

        return () => {
            socketInstance.disconnect()
        }
    }, [])

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = (): MySocket | null => {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider')
    }
    return context.socket
}
