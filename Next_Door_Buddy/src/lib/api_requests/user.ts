import { API } from '#/lib/api_requests/fetchRequest'
import { UserProfile, UserRole } from '#/types/user'
import { getAccessToken } from '../authentification'

export const getprofile = async (): Promise<UserProfile> => {
  try {
    const response = await API.get('/users/me', { accessToken: await getAccessToken()})
    if (!response.ok) {
      throw new Error('Failed to get profile')
    }
    const data = await response.json() as UserProfile
    if (!data) {
      throw new Error('No data found')
    }
    return data
  }
  catch (error) {
    throw error
  }
}

export const getRoles = async (): Promise<UserRole[]> => {
  try {
    const response = await API.get('/users/me', { accessToken: await getAccessToken()})
    if (!response.ok) {
      throw new Error('Failed to get role')
    }
    const data = await response.json() as UserProfile
    if (!data) {
      throw new Error('No data found')
    }
    return data.roles
  }
  catch (error) {
    throw error
  }
}
