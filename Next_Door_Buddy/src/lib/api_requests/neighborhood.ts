import {API} from '#/lib/api_requests/fetchRequest'
import {Neighborhood} from '#/types/neighborghood'
import {getAccessToken} from '../authentification'
import {UserNeighborhood} from "#/types/user"

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


export const getNeighborhood = async (neighborhoodId: string): Promise<Neighborhood> => {
  try {
    const response = await API.get(`/neighborhoods/${neighborhoodId}`, { accessToken: await getAccessToken()})

    if (!response.ok) {
      throw new Error(`Failed to get neighborhoods ${neighborhoodId}`)
    }

    const neighborhood = (await response.json()) as Neighborhood

    if (!neighborhood ) {
      throw new Error('No neighborhoods found for this user')
    }

    return neighborhood
  } catch (error) {
    throw error
  }
}


export const getNeighborhoodsOfUser = async (userId: number): Promise<Neighborhood[]> => {
  try {
    const response = await API.get(`/user-neighborhoods/user/${userId}`, { accessToken: await getAccessToken()})

    if (!response.ok) {
      throw new Error(`Failed to get neighborhoods for user ${userId}`)
    }

    const data = (await response.json()) as { neighborhood: Neighborhood }[]

    const neighborhoods = data.map(link => link.neighborhood)

    if (!neighborhoods || neighborhoods.length === 0) {
      return []
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


export const getUsersOfNeighborhood = async (userId: string): Promise<UserNeighborhood[]> => {
  try {
    const response = await API.get(`/user-neighborhoods/neighborhood/${userId}`, { accessToken: await getAccessToken()})

    if (!response.ok) {
      throw new Error(`Failed to get neighborhoods for user ${userId}`)
    }

    const data = await response.json()


    return data
  } catch (error) {
    throw error
  }
}

export const updateNeighborhood = async (id: number, formData:FormData): Promise<Neighborhood> => {
  try {
    const response = await API.put(
        `/neighborhoods/${id}`,
        { formData, accessToken: await getAccessToken()}
    )

    if (!response.ok) {
      throw new Error(`Failed to update neighborhood with ID ${id}`)
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}
