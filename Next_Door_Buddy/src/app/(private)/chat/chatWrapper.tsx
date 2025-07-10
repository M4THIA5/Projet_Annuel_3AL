"use client"
import {FormEvent, useEffect, useMemo, useRef, useState} from "react"
import {MySocket, useSocket} from "./socketProvider"
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "#/components/ui/dialog"
import {Label} from "#/components/ui/label"
import {Input} from "#/components/ui/input"
import {Button} from "#/components/ui/button"
import {createGroupChat, getAllChatUsers, getUserGroups} from "#/lib/api_requests/chat"
import MultiSelect from "#/components/ui/MultiSelect"
import {Group, GroupUser} from "#/types/chat"

export function ChatWrapper({firstName, lastName, id}: { firstName: string, lastName: string, id: number }) {
    const [messages, setMessages] = useState<Message[]>([])
    const socket = useSocket()
    const [typingStatus, setTypingStatus] = useState('')
    const lastMessageRef = useRef<HTMLDivElement>(null)
    const [currentRoom, setCurrentRoom] = useState<string>("")
    useEffect(() => {
        if (!socket) return

        const handleMessage = (data: Message) => {
            setMessages((prev: Message[]) => [...prev, data])
        }
        socket.on('connected', (data: { messageData: Message[] }) => {
            console.log("Connected messages:", data.messageData)
            setMessages(() => data.messageData)
        })
        socket.on('message_sent', handleMessage)
        socket.on('typingResponse', (data) => setTypingStatus(data))
        if (socket && currentRoom !== null) {
            socket.emit("join_room", currentRoom.toString())
        }
        return () => {
            socket.off('message_sent', handleMessage)
            socket.off('connected')
            socket.off('typingResponse')
        }
    }, [currentRoom, socket])
    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        lastMessageRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [messages])

    return (
        <div className="chat">
            <ChatBar setCurrentRoom={setCurrentRoom}/>
            <div className="chat__main">
                <ChatBody
                    messages={messages}
                    user={{firstName, lastName, id}}
                    lastMessageRef={lastMessageRef}
                    typingStatus={typingStatus}
                />
                {socket && <ChatFooter socket={socket} user={{firstName, lastName}} currentRoom={currentRoom}/>}
            </div>
        </div>
    )
}

type Message = {
    id: number
    text: string
    name: {
        firstName: string
        lastName: string
    }
}

function ChatBody({messages, user, lastMessageRef, typingStatus}: {
    messages: Message[]
    user: {
        firstName: string
        lastName: string
        id: number
    }
    lastMessageRef: React.RefObject<HTMLDivElement | null>
    typingStatus: string
}) {

    const handleCreateGroupChat = async (evt: FormEvent<HTMLFormElement>& {
        target: HTMLFormElement;
        preventDefault: () => void;
    }) => {
        evt.preventDefault()
        const formData = new FormData(evt.target)
        const az: {
            name: string
            users: string[]
        } = {name: '', users: []}
        for (const [key, value] of formData.entries()) {
            if (key === 'name') {
                az.name = value as string
                continue
            }
            az.users.push(value as string)
        }
        await createGroupChat(az)
    }
    const username = user.firstName + " " + user.lastName
    const [users, setUsers] = useState<GroupUser[]>([])
    const [selectedUsers, setSelectedUsers] = useState<number[]>([])
    useEffect(() => {
        const getUsers = async () => {
            const d = await getAllChatUsers()
            setUsers(d)
        }
        getUsers()

    }, [])
    const lockedUsers = useMemo(() => [{name: username, id: user.id}], [])
    const lockedUsersStr = useMemo(() => lockedUsers.map(user => user.id), [lockedUsers])

    useEffect(() => {
        setSelectedUsers(lockedUsersStr)
        setUsers((prevUsers) =>
            prevUsers.filter((user) => !lockedUsers.includes(user))
        )
    }, [lockedUsers, lockedUsersStr])
    console.log(users)

    const array = [...new Set([...users])]
    const options = []
    for (const elem of array) {
        options.push({label: elem.name, value: elem.id})
    }


    return (
        <>
            <header className="chat__mainHeader">
                <p>Hangout with Colleagues</p>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline">Create a new Group
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a new Group</DialogTitle>
                            <DialogDescription>
                                Please enter the name, and the members of the new group.
                            </DialogDescription>
                        </DialogHeader>
                        <form id={"createGroup"} onSubmit={handleCreateGroupChat}>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1"> Group Name</Label>
                                    <Input id="name-1" name="name" placeholder="Pedro Duarte"/>
                                    <MultiSelect
                                        options={options}
                                        selectedValues={selectedUsers}
                                        setSelectedValues={setSelectedUsers}
                                        placeholder="Select people..."
                                        lockedValues={lockedUsersStr}
                                        name={"users"}
                                    />
                                </div>
                            </div>
                        </form>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button form={"createGroup"} type="submit">Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </header>
            {/*This shows messages sent from you*/}
            <div className="message__container">
                {messages.map((message) =>
                    `${message.name}` === username ? (
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
                    <p>{typingStatus}</p>
                </div>
                <div ref={lastMessageRef}/>
            </div>
        </>
    )
}

function ChatFooter({socket, user, currentRoom}: {
    user: {
        firstName: string
        lastName: string
    }
    socket: MySocket,
    currentRoom:string
}) {

    const [message, setMessage] = useState('')
    const handleTyping = () => socket.emit('typing', user)
    const handleEndTyping = () => setTimeout(() => socket.emit('ntyping', user), 5000)
    const handleSendMessage = (e: { preventDefault: () => void }) => {
        e.preventDefault()
        if (message.trim()) {
            if (!socket) {
                console.log("socket is not ready")
                return
            }
            const uan = user.firstName + ' ' + user.lastName
            socket.emit('send_message', {
                text: message,
                name: uan,
                id: `${uan}${Math.random()}`,
                socketID: socket.id,
                room: currentRoom?.toString() ?? "",
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

interface ChatBarProps {
    setCurrentRoom: (value: (((prevState: (string)) => (string)) | string)) => void
}

function ChatBar({setCurrentRoom}: ChatBarProps) {
    const [groups, setGroups] = useState<Group[]>([])
    useEffect(() => {

        const getgrps = async () => {
            const d = await getUserGroups()
            const globalGroup = { id: "", nom: "Global Chat" }

            setGroups([globalGroup, ...d])

        }
        getgrps()
    }, [])
    return (
        <div className="chat__sidebar">
            <h2>Open Chat</h2>

            <div>
                <h4 className="chat__header">Select Group</h4>
                <div className="chat__users">
                    {groups.map(group => (
                        <div key={group.id} onClick={() => setCurrentRoom(group.id)}>
                            {group.nom}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
