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
    const [reload, setReload] = useState<boolean>(false)

    return (
        <div>
            <div className="flex flex-row">
                <ChatBar setCurrentRoom={setCurrentRoom} reload={reload}/>
                <div className="flex flex-col w-full">
                        <ChatBody
                            messages={messages}
                            user={{firstName, lastName, id}}
                            lastMessageRef={lastMessageRef}
                            typingStatus={typingStatus}
                            reload={setReload}
                        />
                    {socket && <ChatFooter socket={socket} user={{firstName, lastName}} currentRoom={currentRoom}/>}
                </div>
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

function ChatBody({messages, user, lastMessageRef, typingStatus, reload }: {
    messages: Message[]
    user: {
        firstName: string
        lastName: string
        id: number
    }
    lastMessageRef: React.RefObject<HTMLDivElement | null>
    typingStatus: string
    reload: (value: (((prevState: (boolean)) => (boolean)) | boolean)) => void
}) {

    const handleCreateGroupChat = async (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault()
        // @ts-expect-error evt.target not recognized
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
        reload((prevState) => !prevState)
        setOpen(false)
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

    const [open, setOpen] = useState(false)


    return (
        <div className="">
            <header className="flex flex-col items-start mb-5">
                <p className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight m-2">
                    Hangout with Colleagues
                </p>
                <Dialog open={open} onOpenChange={setOpen}>
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
            <div className="flex">
                <div
                    className="px-4 flex flex-col py-2 space-y-2 align-middle justify-around flex-1 overflow-y-auto h-[65vh]">
                    {messages.map((message) =>
                        message.name === username ? (
                            // Messages de l'utilisateur
                            <div key={message.id} className="flex justify-end mb-2">
                                <div className="flex flex-col items-end max-w-xs sm:max-w-md">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">You</p>
                                    <div
                                        className="bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-br-none shadow">
                                        <p>{message.text}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Messages des autres
                            <div key={message.id} className="flex justify-start mb-2">
                                <div className="flex flex-col items-start max-w-xs sm:max-w-md">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{message.name}</p>
                                    <div
                                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-2xl rounded-bl-none shadow">
                                        <p>{message.text}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </div>
                {/* Indicateur de frappe */}
                {typingStatus && (
                    <div className="text-sm italic text-gray-500 px-4 mt-2">{typingStatus}</div>
                )}

                <div ref={lastMessageRef}/>
            </div>
        </div>

    )
}

function ChatFooter({socket, user, currentRoom}: {
    user: {
        firstName: string
        lastName: string
    }
    socket: MySocket,
    currentRoom: string
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
        <div className="fixed bottom-0 min-w-6xl">
            <form className="form" onSubmit={handleSendMessage}>
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
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full transition">
                        Envoyer
                    </button>
                </div>
            </form>
        </div>
    )
}

interface ChatBarProps {
    setCurrentRoom: (value: (((prevState: (string)) => (string)) | string)) => void
    reload: boolean
}

function ChatBar({setCurrentRoom, reload}: ChatBarProps) {
    const [groups, setGroups] = useState<Group[]>([])

    useEffect(() => {
        const getgrps = async () => {
            const d = await getUserGroups()
            const globalGroup = {id: "", nom: "Global Chat"}

            setGroups([globalGroup, ...d])
        }
        getgrps()
    }, [reload])
    return (
        <div className="w-1/8">
            <div>
                <h4 className="chat__header">Select Group</h4>
                <div className="chat__users">
                    {groups.map(group => (
                        <div key={group.id} onClick={() => setCurrentRoom(group.id)} className="text-gray-800 text-l">
                            {group.nom}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
