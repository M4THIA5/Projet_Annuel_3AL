import ChatWrapper from "#/components/chat/Wrapper"
import './style.css'
import {getUser} from "#/lib/dal"
import {redirect} from "next/navigation"



export default async function Chatt() {
    const user = await getUser()

    if (!user) return redirect('/login')
    return (
        <ChatWrapper userName={user.username}/>
    )
}
