import React from 'react'
import StatusIcon from "#/components/StatusIcon"

// Type for the user object
export interface UserInterface {
    messages: string[]
    userID:string
    username: string
    self: boolean
    connected: boolean
    hasNewMessages: boolean
}

// Props type for the User component
interface UserProps {
    user: UserInterface
    selected: boolean
    onSelect: () => void // Function to handle click event
}

const User: React.FC<UserProps> = ({ user, selected, onSelect }) => {
    // Computed status
    const status = user.connected ? 'online' : 'offline'

    return (
        <div
            className={`user ${selected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            <div className="description">
                <div className="name">
                    {user.username} {user.self ? ' (yourself)' : ''}
                </div>
                <div className="status">
                    <StatusIcon connected={user.connected} /> {status}
                </div>
            </div>
            {user.hasNewMessages && <div className="new-messages">!</div>}
        </div>
    )
}

export default User
