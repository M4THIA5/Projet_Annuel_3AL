import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar"
import { Button } from "#/components/ui/button"
import { acceptFriendRequest, cancelFriendRequest, refuseFriendRequest, removeFriend, sendFriendRequest } from "#/lib/api_requests/user"
import { Friend, UserProfile } from "#/types/user"
import { toast } from "react-toastify"

export const UserCard = ({ user, profile }: {user: Friend, profile?: UserProfile}) => {
  async function handleSendFriendRequest(friendId: number) {
    try {
      await sendFriendRequest(friendId)
      toast.success("Demande d'ami envoyée")
    } catch (e) {
      console.error(e)
      toast.error("Erreur lors de l'envoi de la demande d'ami")
    }
  }
  
  async function handleAcceptFriend(friendId: number) {
    try {
      await acceptFriendRequest(friendId)
      toast.success("Ami accepté")
    } catch (e) {
      console.error(e)
      toast.error("Erreur lors de l'acceptation de l'ami")
    }
  }

  async function handleRefuseFriend(friendId: number) {
    try {
      await refuseFriendRequest(friendId)
      toast.success("Demande refusée")
    } catch (e) {
      console.error(e)
      toast.error("Erreur lors du refus de la demande")
    }
  }

  async function handleCancelRequest(friendId: number) {
    try {
      await cancelFriendRequest(friendId)
      toast.success("Demande annulée")
    } catch (e) {
      console.error(e)
      toast.error("Erreur lors de l'annulation de la demande")
    }
  }

  async function handleRemoveFriend(friendId: number) {
    try {
      await removeFriend(friendId)
      toast.success("Ami supprimé")
    } catch (e) {
      console.error(e)
      toast.error("Erreur lors de la suppression de l'ami")
    }
  }

  return (
    <div className="flex items-center gap-2 p-2 rounded hover:bg-blue-100">
      <Avatar>
        <AvatarImage src={user.image} alt="Profile Image" />
        <AvatarFallback>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
          </svg>
        </AvatarFallback>
      </Avatar>
      <span className="font-medium text-gray-800">{user.firstName} {user.lastName}</span>
      <div className="ml-auto flex gap-2">
        {user.id === profile?.id && (
          <span className="text-gray-500">Vous-même</span>
        )}
        {user.status === 'accepted' && (
          <Button
            variant="destructive"
            onClick={() => handleRemoveFriend(user.id)}
          >
            Supprimer
          </Button>
        )}
        {user.status === 'pending' && (
          <>
            <Button
              variant="default"
              onClick={() => handleAcceptFriend(user.id)}
            >
              Accepter
            </Button>
            <Button
              variant="outline"
              onClick={() => handleRefuseFriend(user.id)}
            >
              Refuser
            </Button>
          </>
        )}
        {user.status === 'requested' && (
          <Button
            variant="outline"
            onClick={() => handleCancelRequest(user.id)}
          >
            Annuler
          </Button>
        )}
        {(!user.status || user.status === 'none') && user.id !== profile?.id && (
          <Button
            variant="default"
            onClick={() => handleSendFriendRequest(user.id)}
          >
            Demander en ami
          </Button>
        )}
      </div>
    </div>
  )
}
