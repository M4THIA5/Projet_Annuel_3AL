import { getMultiFriendTypes } from "#/lib/api_requests/user"
import { MultiFriendTypes } from "#/types/user"

export async function fetchFriends(userId: number): Promise<MultiFriendTypes> {
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

  return data
}
