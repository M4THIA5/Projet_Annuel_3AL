import { API } from '#/lib/api_requests/fetchRequest'
import { Neighborhood } from '#/types/neighborghood'
import { getAccessToken } from '../authentification'

export const getAllNeighborhoods = async (): Promise<Neighborhood[]> => {
  try {
    const response = await API.get('/neighborhoods', { accessToken: await getAccessToken()})
    if (!response.ok) {
      throw new Error('Failed to get neighborhoods')
    }
    const data = await response.json() as Neighborhood[]
    if (!data) {
      throw new Error('No data found')
    }
    return data
  }
  catch (error) {
    throw error
  }
}

export const getNeighborhoodsOfUser = async (userId: string): Promise<Neighborhood[]> => {
  try {
    const response = await API.get(`/user-neighborhoods/user/${userId}`, { accessToken: await getAccessToken()})

    if (!response.ok) {
      throw new Error(`Failed to get neighborhoods for user ${userId}`)
    }

    const data = (await response.json()) as { neighborhood: Neighborhood }[]

    const neighborhoods = data.map(link => link.neighborhood)

    if (!neighborhoods || neighborhoods.length === 0) {
      throw new Error('No neighborhoods found for this user')
    }

    return neighborhoods
  } catch (error) {
    throw error
  }
}
export const getNeighborhoodsAroundMe = async (userId: string): Promise<Neighborhood[]> => {
  try {
    const response = await API.get(`/user-neighborhoods/neighborhoodsAroundMe/${userId}`, { accessToken: await getAccessToken()})

    if (!response.ok) {
      throw new Error(`Failed to get neighborhoods for user ${userId}`)
    }

    const data = await response.json()


    return data
  } catch (error) {
    throw error
  }
}
