"use client"
import { getMultiFriendTypes, getProfile } from "#/lib/api_requests/user"
import { useEffect, useState } from "react"
import { MultiFriendTypes, UserProfile } from '#/types/user'
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogHeader } from "#/components/ui/dialog"
import { Button } from "#/components/ui/button"
import { getAccessToken } from "#/lib/authentification"
import { logout } from "#/lib/api_requests/auth"
import { Routes } from "#/Routes"
import { redirect } from 'next/navigation'

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | undefined>(undefined)
  const [multiFriendTypes, setMultiFriendTypes] = useState<MultiFriendTypes>({
    friends: [],
    pending: [],
    friend_requests: []
  })
  const [ selectedTab, setSelectedTab ] = useState<'info' | 'friends'>('info')

  async function logoutUser() {
    await logout(await getAccessToken() ?? '')
    redirect(Routes.home.toString())
  }
  useEffect(() => {
    async function fetchProfile() {
      const data = await getProfile()
      setProfile(data)
    }
    async function fetchFriends(userId: number) {
      const data = await getMultiFriendTypes(userId)
      setMultiFriendTypes(data)
    }
    fetchProfile()
    if (profile?.id) {
      fetchFriends(profile.id)
    }
  }, [profile?.id])

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white/90 shadow-lg p-6 flex flex-col gap-4">
      <button
        className={`text-left px-4 py-2 rounded font-semibold text-blue-700 hover:bg-blue-100 ${selectedTab === 'info' || selectedTab == undefined ? 'bg-blue-100' : ''}`}
        onClick={() => setSelectedTab('info')}
      >
        Infos personnelles
      </button>
      <button
        className={`text-left px-4 py-2 rounded font-semibold text-blue-700 hover:bg-blue-100 ${selectedTab === 'friends' ? 'bg-blue-100' : ''}`}
        onClick={() => setSelectedTab('friends')}
      >
        Amis
      </button>
      <div className="mt-auto">
        <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full border-blue-200 text-blue-200 hover:bg-blue-300">
          Se déconnecter
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
          <DialogTitle className="text-lg text-red-600">Êtes-vous sûr de vouloir vous déconnecter ?</DialogTitle>
          <DialogDescription>
            Vous serez redirigé vers la page de login.
          </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
            Non
            </Button>
          </DialogClose>
          <Button type="button" onClick={logoutUser} className="bg-red-500 hover:bg-red-600 text-white">
            Oui
          </Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
      </div>
      </aside>

      <main className="flex-1 flex items-center justify-center p-8">
      {(!selectedTab || selectedTab === 'info') && (
        <Card className="w-full max-w-xl shadow-lg border-0 bg-white/90">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-blue-200">Profil</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-lg">
          <span>
          <span className="font-semibold text-gray-700">Prénom :</span> {profile?.firstName ?? ''}
          </span>
          <span>
          <span className="font-semibold text-gray-700">Nom :</span> {profile?.lastName ?? ''}
          </span>
          <span>
          <span className="font-semibold text-gray-700">Email :</span> {profile?.email}
          </span>
        </CardContent>
        </Card>
      )}
      {selectedTab === 'friends' && (
        <div className="flex flex-col w-full max-w-3xl gap-6">
          {/* Première ligne : Mes amis */}
          <div className="flex w-full">
            <Card className="flex-1 shadow-lg border-0 bg-white/90">
              <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-200">Mes amis</CardTitle>
              </CardHeader>
              <CardContent>
          {multiFriendTypes.friends && multiFriendTypes.friends.length > 0 ? (
            <ul className="space-y-2">
              {multiFriendTypes.friends.map((friend) => (
                <li key={friend.id} className="flex items-center gap-2 p-2 rounded hover:bg-blue-100">
            <span className="font-medium text-gray-800">{friend.firstName} {friend.lastName}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-500">Vous n&apos;avez pas encore d&apos;amis.</span>
          )}
              </CardContent>
            </Card>
          </div>
          {/* Deuxième ligne : Demandes en attente & Demandes d'amis */}
          <div className="flex w-full gap-6">
            <Card className="flex-1 shadow-lg border-0 bg-white/90">
              <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-200">Demandes en attente</CardTitle>
              </CardHeader>
              <CardContent>
          {multiFriendTypes.pending && multiFriendTypes.pending.length > 0 ? (
            <ul className="space-y-2">
              {multiFriendTypes.pending.map((friend) => (
                <li key={friend.id} className="flex items-center gap-2 p-2 rounded hover:bg-blue-100">
            <span className="font-medium text-gray-800">{friend.firstName} {friend.lastName}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-500">Vous n&apos;avez pas de demandes en attente</span>
          )}
              </CardContent>
            </Card>
            <Card className="flex-1 shadow-lg border-0 bg-white/90">
              <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-200">Demandes d&apos;amis</CardTitle>
              </CardHeader>
              <CardContent>
          {multiFriendTypes.friend_requests && multiFriendTypes.friend_requests.length > 0 ? (
            <ul className="space-y-2">
              {multiFriendTypes.friend_requests.map((friend) => (
                <li key={friend.id} className="flex items-center gap-2 p-2 rounded hover:bg-blue-100">
            <span className="font-medium text-gray-800">{friend.firstName} {friend.lastName}</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-gray-500">Vous n&apos;avez pas de demandes en attente</span>
          )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      </main>
    </div>
  )
}
