import React from 'react';

function ChatBody (mem: never[]) {

    const handleLeaveChat = () => {
        localStorage.removeItem('userName');
        window.location.reload();
    };
    const messages = mem.messages;
    return (
        <>
            <header className="chat__mainHeader">
                <p>Hangout with Colleagues</p>
                <button className="leaveChat__btn" onClick={handleLeaveChat}>
                    LEAVE CHAT
                </button>
            </header>

            {/*This shows messages sent from you*/}
            <div className="message__container">
                {messages.map((message) =>
                    message.username ? (
                        <div className="message__chats" key={message.id}>
                            <p className="sender__name">You</p>
                            <div className="message__sender">
                                <p>{message.text}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="message__chats" key={message.id}>
                            <p>{message.name}</p>
                            <div className="message__recipient">
                                <p>{message.text}</p>
                            </div>
                        </div>
                    )
                )}

                {/*This is triggered when a user is typing*/}
                <div className="message__status">
                    <p>Someone is typing...</p>
                </div>
            </div>
        </>
    );
};

export default ChatBody;
