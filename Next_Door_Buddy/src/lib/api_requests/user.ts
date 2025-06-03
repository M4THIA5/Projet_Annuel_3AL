import {API} from '#/lib/api_requests/fetchRequest'
import {UserProfile, UserRole, User} from '#/types/user'
import {getAccessToken} from '../authentification'
import {RegisterUserData} from "#/types/mapbox";

export const getprofile = async (): Promise<UserProfile> => {
    try {
        const response = await API.get('/users/me', {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get profile')
        }
        const data = await response.json() as UserProfile
        if (!data) {
            throw new Error('No data found')
        }
        return data
    } catch (error) {
        throw error
    }
}

export const getRoles = async (): Promise<UserRole[]> => {
    try {
        const response = await API.get('/users/me', {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get role')
        }
        const data = await response.json() as UserProfile
        if (!data) {
            throw new Error('No data found')
        }
        return data.roles
    } catch (error) {
        throw error
    }
}
export const getAllUsers = async (): Promise<User[]> => {
    try {
        const response = await API.get('/users/', {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get users')
        }

        const data = await response.json() as User[]
        if (!data || !Array.isArray(data)) {
            throw new Error('No data found or invalid format')
        }

        return data
    } catch (error) {
        throw error
    }
}


export const registerUser = async (data: RegisterUserData): Promise<Response> => {
    try {
        const response = await API.post('/register', {accessToken: await getAccessToken(), data: data})

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to register user')
        }

        return response
    } catch (error) {
        throw error
    }
};
