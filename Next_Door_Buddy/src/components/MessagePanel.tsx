import React, { useState } from "react"
import './styles.css' // Make sure the correct path is provided
import StatusIcon from "#/components/StatusIcon"

// Type for individual messages
interface Message {
    content: string
    fromSelf: boolean
}

// Type for the user
interface User {
    username: string
    connected: boolean
    messages: Message[]
}

// Type for the props the component receives
interface MessagePanelProps {
    user: User
    onMessage: (message: string) => void
}

const MessagePanel: React.FC<MessagePanelProps> = ({ user, onMessage }) => {
    const [input, setInput] = useState<string>("")

    // Handle form submission
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim() !== "") {
            onMessage(input) // Send the message up to parent
            setInput("") // Clear the input after sending the message
        }
    }

    // Check if the sender of the current message is different from the previous one
    const displaySender = (message: Message, index: number) => {
        return (
            index === 0 ||
            user.messages[index - 1].fromSelf !== user.messages[index].fromSelf
        )
    }

    // Check if the input is valid
    const isValid = input.length > 0

    return (
        <div>
            <div className="header">
                <StatusIcon connected={user.connected} /> {user.username}
            </div>

            <ul className="messages">
                {user.messages.map((message, index) => (
                    <li key={index} className="message">
                        {displaySender(message, index) && (
                            <div className="sender">
                                {message.fromSelf ? "(yourself)" : user.username}
                            </div>
                        )}
                        {message.content}
                    </li>
                ))}
            </ul>

            <form onSubmit={onSubmit} className="form">
        <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Your message..."
            className="input"
        />
                <button type="submit" disabled={!isValid} className="send-button">
                    Send
                </button>
            </form>
        </div>
    )
}

export default MessagePanel
