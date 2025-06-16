"use client"
import { getprofile } from "#/lib/api_requests/user"
import { useEffect, useState } from "react"
import { UserProfile } from '#/types/user'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "#/components/ui/card"
import Link from "next/link"


export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | undefined>(undefined)

  useEffect(() => {
    async function fetchProfile() {
      const data = await getprofile()
      setProfile(data)
    }
    fetchProfile()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <span>Prénom : {profile?.firstName ?? ''}</span>
        <span>Nom : {profile?.lastName ?? ''}</span>
        <span>Email : {profile?.email}</span>
      </CardContent>
        <CardFooter>
            <Link href={"/profile/services"}>Mes services demandés</Link>
        </CardFooter>
    </Card>
  )
}
