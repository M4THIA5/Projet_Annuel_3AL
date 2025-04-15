"use client"
import React from "react"
import ChatPage from "./Page"

export default function ChatWrapper({ userName }: { userName: string }) {
    return <ChatPage userName={userName} />
}
