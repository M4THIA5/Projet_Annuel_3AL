import React, {useState} from 'react';


function ChatFooter(
    socket: any
){
    const [message, setMessage] = useState('');

    const handleSendMessage = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (message.trim()) {
            if (!socket){
                console.log("socket is not ready")
                return
            }
            console.log(socket)
            socket.socket.emit('message', {
                text: message,
                name: socket.id,
                id: `${socket.id}${Math.random()}`,
                socketID: socket.id,
            });
        }
        setMessage('');
    };
    return (
        <div className="chat__footer">
            <form className="form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    placeholder="Write message"
                    className="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button className="sendBtn">SEND</button>
            </form>
        </div>
    );
};

export default ChatFooter;
