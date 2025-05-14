import { getprofile } from "#/lib/api_requests/user"
import { ChatWrapper } from "./chatWrapper"

export default async function Chat() {
  const { firstName, lastName } = await getprofile()
  return (
    <ChatWrapper firstName={firstName} lastName={lastName}/>
  )
}
