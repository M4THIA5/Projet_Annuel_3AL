"use client"
import { getProfile } from "#/lib/api_requests/user"
import { useEffect, useState } from "react"
import { UserProfile } from '#/types/user'
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogHeader } from "#/components/ui/dialog"
import { Button } from "#/components/ui/button"
import { getAccessToken } from "#/lib/authentification"
import { logout } from "#/lib/api_requests/auth"
import { Routes } from "#/Routes"
import { redirect } from 'next/navigation'

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | undefined>(undefined)

  async function logoutUser() {
    await logout(await getAccessToken() ?? '')
    redirect(Routes.home.toString())
  }
  useEffect(() => {
    async function fetchProfile() {
      const data = await getProfile()
      setProfile(data)
    }
    fetchProfile()
  }, [])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <span>Prénom : {profile?.firstName ?? ''}</span>
          <span>Nom : {profile?.lastName ?? ''}</span>
          <span>Email : {profile?.email}</span>
        </CardContent>
      </Card>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Logout</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Êtes vous sûre de vouloir vous déconnecter ?</DialogTitle>
            <DialogDescription>
            Vous serez redirigé vers la page de login
          </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Non
              </Button>
            </DialogClose>
            <Button type="button" onClick={logoutUser}>
              Oui
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
