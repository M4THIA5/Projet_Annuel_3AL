"use client"
import { getMultiFriendTypes, getNewFriendByEmail, getProfile } from "#/lib/api_requests/user"
import { useEffect, useMemo, useState } from "react"
import { Friend, MultiFriendTypes, UserProfile } from '#/types/user'
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogHeader } from "#/components/ui/dialog"
import { Button } from "#/components/ui/button"
import { getAccessToken } from "#/lib/authentification"
import { logout } from "#/lib/api_requests/auth"
import { Routes } from "#/Routes"
import { redirect } from 'next/navigation'
import { Input } from "#/components/ui/input"
import { z } from "zod"
import { UserCard } from "./UserCard"
import { UserInformation } from "./UserInformation"

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | undefined>(undefined)
  const [multiFriendTypes, setMultiFriendTypes] = useState<MultiFriendTypes>({
    friends: [],
    pending: [],
    friend_requests: []
  })
  const [newFriend, setNewFriend] = useState<Friend | undefined>(undefined)
  const [ selectedTab, setSelectedTab ] = useState<'info' | 'friends'>('info')
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchEmail, setSearchEmail] = useState<string>("")
  const [emailError, setEmailError] = useState<string | null>(null)

  const filteredFriends = useMemo(() => 
    multiFriendTypes.friends.filter(friend =>
      `${friend.firstName} ${friend.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    ), [multiFriendTypes.friends, searchTerm])

  const emailSchema = z.string().email({ message: "Email invalide" })

  async function handleSearchNewFriend(email: string) {

    if (!email) {
      if (newFriend) {
        setNewFriend(undefined)
      } else {
        setEmailError("Veuillez entrer un email.")
      }
      return
    }

    const validation = emailSchema.safeParse(email)
    if (!validation.success) {
      setEmailError(validation.error.errors[0].message)
      return
    }
    try {
      const newFriend = await getNewFriendByEmail(email)
      if (newFriend) {
        if (multiFriendTypes.friends.some(f => f.id === newFriend.id)) {
          newFriend.status = 'accepted'
        } else if (multiFriendTypes.pending.some(f => f.id === newFriend.id)) {
          newFriend.status = 'pending'
        } else if (multiFriendTypes.friend_requests.some(f => f.id === newFriend.id)) {
          newFriend.status = 'requested'
        }

        setNewFriend(newFriend)
        setEmailError(null)

      } else {
        setEmailError("Aucun utilisateur trouvé avec cet email.")
        setNewFriend(undefined)
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de l\'utilisateur :', error)
    }
  }

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
      data.friends = data.friends.map(friend => ({
        ...friend,
        status: 'accepted'
      }))

      data.pending = data.pending.map(friend => ({
        ...friend,
        status: 'pending'
      }))

      data.friend_requests = data.friend_requests.map(friend => ({
        ...friend,
        status: 'requested'
      }))

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
        profile ? (
          <UserInformation profile={profile} />
        ) : (
          <div>chargement du profil</div>
        )
      )}
      {selectedTab === 'friends' && (
        <div className="flex flex-col w-full max-w-3xl gap-6">
        {/* Champ de recherche */}
        <div className="mb-4">
          <input
          type="text"
          placeholder="Rechercher un ami par nom ou prénom..."
          className="w-full px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Première ligne : Mes amis */}
        <div className="flex w-full">
          <Card className="flex-1 shadow-lg border-0 bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-200">Mes amis</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredFriends.length > 0 ? (
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {filteredFriends.map((friend) => (
              <li key={friend.id} className="flex items-center gap-2 p-2 rounded hover:bg-blue-100">
                <UserCard user={friend} profile={profile} />
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
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {multiFriendTypes.pending.map((friend) => (
              <li key={friend.id} className="flex items-center gap-2 p-2 rounded hover:bg-blue-100">
                <UserCard user={friend} profile={profile} />
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
            <ul className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {multiFriendTypes.friend_requests.map((friend) => (
              <li key={friend.id} className="flex items-center gap-2 p-2 rounded hover:bg-blue-100">
                <UserCard user={friend} profile={profile} />
              </li>
              ))}
            </ul>
            ) : (
            <span className="text-gray-500">Vous n&apos;avez pas de demandes en attente</span>
            )}
          </CardContent>
          </Card>
        </div>
        {/* Section : Trouver de nouveaux amis */}
        <div className="flex flex-col gap-4 mt-8">
          <Card className="shadow-lg border-0 bg-white/90">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-200">Trouver de nouveaux amis</CardTitle>
                <div className="flex w-full max-w-sm items-center gap-2">
                  <Input
                  type="email"
                  placeholder="Email"
                  value={searchEmail}
                  onChange={e => setSearchEmail(e.target.value)}
                  />
                  <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleSearchNewFriend(searchEmail)}
                  >
                  Rechercher
                  </Button>
                </div>
              {emailError && <span className="text-red-500 text-sm mt-2">{emailError}</span>}
            </CardHeader>
            <CardContent>
            {newFriend ? (
              <UserCard user={newFriend} profile={profile} />
            ): (
              <span className="text-gray-500">Entrez un email pour trouver un nouvel ami.</span>
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
