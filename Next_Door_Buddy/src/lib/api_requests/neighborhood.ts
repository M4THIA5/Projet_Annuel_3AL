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
