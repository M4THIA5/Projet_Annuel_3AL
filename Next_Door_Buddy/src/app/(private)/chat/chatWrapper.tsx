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
import {Avatar, AvatarFallback, AvatarImage} from "#/components/ui/avatar"
import clsx from "clsx"

// Types
type Message = {
    id: number
    text: string
    name: {
        firstName: string
        lastName: string
    } | string
}

// Main component
export function ChatWrapper({firstName, lastName, id}: { firstName: string, lastName: string, id: number }) {
    const [messages, setMessages] = useState<Message[]>([])
    const socket = useSocket()
    const [typingStatus, setTypingStatus] = useState('')
    const lastMessageRef = useRef<HTMLDivElement>(null)
    const [currentRoom, setCurrentRoom] = useState<string>("")
    const [reload, setReload] = useState(false)

    useEffect(() => {
        if (!socket) return

        const handleMessage = (data: Message) => {
            setMessages(prev => [...prev, data])
        }

        socket.on('connected', (data: { messageData: Message[] }) => {
            console.log("Connected messages:", data.messageData)
            setMessages(data.messageData)
        })
        socket.on('message_sent', handleMessage)
        socket.on('typingResponse', setTypingStatus)

        socket.emit("join_room", currentRoom)

        return () => {
            socket.off('message_sent', handleMessage)
            socket.off('connected')
            socket.off('typingResponse')
        }
    }, [socket, currentRoom])

    useEffect(() => {
        lastMessageRef.current?.scrollIntoView({behavior: 'smooth'})
    }, [messages])

    return (
        <div className="flex h-[89vh]">
            <ChatBar setCurrentRoom={setCurrentRoom} reload={reload}/>
            <div className="flex flex-col flex-1 relative">
                <ChatBody
                    messages={messages}
                    user={{firstName, lastName, id}}
                    lastMessageRef={lastMessageRef}
                    typingStatus={typingStatus}
                    reload={setReload}
                />
                {socket && (
                    <div className="sticky bottom-0 bg-white dark:bg-gray-900">
                        <ChatFooter socket={socket} user={{firstName, lastName}} currentRoom={currentRoom}/>
                    </div>
                )}
            </div>
        </div>
    )
}

// ChatBody component
function ChatBody({
                      messages, user, lastMessageRef, typingStatus, reload
                  }: {
    messages: Message[]
    user: { firstName: string; lastName: string; id: number }
    lastMessageRef: React.RefObject<HTMLDivElement | null>
    typingStatus: string
    reload: (value: boolean | ((prev: boolean) => boolean)) => void
}) {
    const username = `${user.firstName} ${user.lastName}`
    const [users, setUsers] = useState<GroupUser[]>([])
    const [selectedUsers, setSelectedUsers] = useState<number[]>([])
    const [open, setOpen] = useState(false)

    const lockedUsers = useMemo(() => [{name: username, id: user.id}], [username, user.id])
    const lockedUsersStr = useMemo(() => lockedUsers.map(u => u.id), [lockedUsers])

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await getAllChatUsers()
            setUsers(data.filter(u => !lockedUsersStr.includes(u.id)))
            setSelectedUsers(lockedUsersStr)
        }
        fetchUsers()
    }, [lockedUsersStr])

    const options = users.map(user => ({label: user.name, value: user.id}))

    const handleCreateGroupChat = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        const formData = new FormData(evt.currentTarget)
        const payload: { name: string; users: string[] } = {name: '', users: []}

        for (const [key, value] of formData.entries()) {
            if (key === 'name') payload.name = value as string
            else payload.users.push(value as string)
        }

        await createGroupChat(payload)
        reload(prev => !prev)
        setOpen(false)
    }

    return (
        <>
            <header className="flex flex-col items-start m-5">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">Hangout with Colleagues</p>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">Create a new Group</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a new Group</DialogTitle>
                            <DialogDescription>
                                Please enter the name and the members of the new group.
                            </DialogDescription>
                        </DialogHeader>
                        <form id="createGroup" onSubmit={handleCreateGroupChat}>
                            <div className="grid gap-4">
                                <div className="grid gap-3">
                                    <Label htmlFor="name-1">Group Name</Label>
                                    <Input id="name-1" name="name" placeholder="Pedro Duarte"/>
                                    <MultiSelect
                                        options={options}
                                        selectedValues={selectedUsers}
                                        setSelectedValues={setSelectedUsers}
                                        placeholder="Select people..."
                                        lockedValues={lockedUsersStr}
                                        name="users"
                                    />
                                </div>
                            </div>
                        </form>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit" form="createGroup">Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                {messages.map((message) => {
                    const isOwn = (typeof message.name === "string" ? message.name : `${message.name.firstName} ${message.name.lastName}`) === username
                    const senderName = typeof message.name === "string"
                        ? message.name
                        : `${message.name.firstName} ${message.name.lastName}`

                    return (
                        <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-xs sm:max-w-md`}>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{isOwn ? "You" : senderName}</p>
                                <div className={`px-4 py-2 rounded-2xl shadow ${isOwn
                                    ? "bg-blue-500 text-white rounded-br-none"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none"
                                }`}>
                                    <p>{message.text}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
                {typingStatus && (
                    <div className="text-sm italic text-gray-500 px-4 mt-2">{typingStatus}</div>
                )}
                <div ref={lastMessageRef}/>
            </div>
        </>
    )
}

// ChatFooter
function ChatFooter({socket, user, currentRoom}: {
    user: { firstName: string, lastName: string },
    socket: MySocket,
    currentRoom: string
}) {
    const [message, setMessage] = useState('')

    const handleTyping = () => socket.emit('typing', user)
    const handleEndTyping = () => setTimeout(() => socket.emit('ntyping', user), 5000)

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim()) {
            const fullName = `${user.firstName} ${user.lastName}`
            socket.emit('send_message', {
                text: message,
                name: fullName,
                id: `${fullName}${Math.random()}`,
                socketID: socket.id,
                room: currentRoom
            })
            setMessage('')
        }
    }

    return (
        <form onSubmit={handleSendMessage}>
            <div
                className="w-full px-4 py-3 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 flex items-center space-x-3">
                <input
                    type="text"
                    placeholder="Write message..."
                    className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleTyping}
                    onKeyUp={handleEndTyping}
                />
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full transition"
                >
                    Envoyer
                </button>
            </div>
        </form>
    )
}

// ChatBar
interface ChatBarProps {
    setCurrentRoom: (value: string | ((prev: string) => string)) => void
    reload: boolean
}

function ChatBar({ setCurrentRoom, reload }: ChatBarProps) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [current, setCurrent] = useState<string>("");

    useEffect(() => {
        const fetchGroups = async () => {
            const d = await getUserGroups();
            setGroups([{ id: "", nom: "Global Chat" }, ...d]);
        };
        fetchGroups();
    }, [reload]);

    function simpleHash(str: string): number {
        let hash = 0;
        for(let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    }

    return (
        <div className="w-64 h-full p-4 bg-secondary dark:bg-gray-900 rounded-2xl border overflow-auto">
            {groups.map((group) => {
                const seed = simpleHash(group.id || group.nom)
                return (
                    <div
                        key={group.id}
                        onClick={() => {
                            setCurrentRoom(group.id)
                            setCurrent(group.id)
                        }}
                        className={clsx(
                            "flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition",
                            current === group.id
                                ? "bg-gray-500 text-white"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                    >
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={`https://cataas.com/cat?${seed}`}
                                alt={group.nom}
                            />
                            <AvatarFallback>{group.nom[0]}</AvatarFallback>
                        </Avatar>

                        <div
                            className={clsx(
                                "font-bold",
                                current === group.id
                                    ? "text-white"
                                    : "text-gray-900 dark:text-gray-100"
                            )}
                        >
                            {group.nom}
                        </div>
                    </div>
                )
            })}
        </div>
    );
}

