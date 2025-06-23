"use client"

import { getProfile } from "#/lib/api_requests/user"
import { useEffect, useState } from "react"
import { ChatWrapper } from "./chatWrapper"
import { UserProfile } from "#/types/user"

export default function Chat() {
  const [profile, setProfile] = useState<UserProfile | undefined>(undefined)

  useEffect(() => {
    async function fetchProfile() {
      const data = await getProfile()
      setProfile(data)
    }
    fetchProfile()
  }, [])

  if (!profile) {
    return <div>Loading...</div>
  }
  return (
    <ChatWrapper firstName={profile.firstName} lastName={profile.lastName}/>
  )
}
