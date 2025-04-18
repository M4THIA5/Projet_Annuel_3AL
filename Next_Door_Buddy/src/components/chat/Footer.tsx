import React, {useState} from 'react'
import {MySocket} from "#/components/SocketProvider"

type Props = {
    socket: MySocket
    user: string
}

function ChatFooter({ socket, user }: Props) {

    const [message, setMessage] = useState('')
    const handleTyping = () => socket.emit('typing', user)
    const handleEndTyping = () => setTimeout(() => socket.emit('ntyping', user), 5000)
    const handleSendMessage = (e: { preventDefault: () => void }) => {
        e.preventDefault()
        if (message.trim()) {
            if (!socket){
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

export default ChatFooter
