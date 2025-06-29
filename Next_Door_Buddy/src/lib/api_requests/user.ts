import {API} from '#/lib/api_requests/fetchRequest'
import {UserProfile, UserRole, VerifyOtpData, ResendOtpData, MultiFriendTypes} from '#/types/user'
import {getAccessToken} from '../authentification'
import {RegisterUserData} from "#/types/mapbox"
import {buildUrl} from '../utils'

export const getProfile = async (): Promise<UserProfile> => {
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

export const getMultiFriendTypes = async (userId: number): Promise<MultiFriendTypes> => {
    try {
        const response = await API.get(`/users/${userId}/friends`, {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get friends')
        }
        const data = await response.json() as MultiFriendTypes
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

export const getRoleInArea = async ( userId: number,neighborhoodId: number): Promise<string> => {
    try {

        const response = await API.get(`/user-neighborhoods/roleinarea/${userId}/${neighborhoodId}`, {accessToken: await getAccessToken()})

        if (!response.ok) {
            throw new Error('Failed to get role')
        }

        const data = await response.json()

        if (!data || typeof data.role !== 'string') {
            throw new Error('Invalid or missing role in response')
        }

        return data.role
    } catch (error) {
        throw new Error(`getRoleInArea failed: ${error instanceof Error ? error.message : String(error)}`)
    }
}


export const getAllUsers = async (
    params?: Record<string, string | number | undefined>):
    Promise<{
        users: UserProfile[],
        total: number,
        page: number,
        pageSize: number,
        totalPages: number
    }> => {
    try {
        const url = buildUrl('/users', params)
        const response = await API.get(url, {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get users')
        }

        const {users, total, page, pageSize, totalPages} = await response.json()

        return {
            users: users.map((user: UserProfile) => ({
                id: user.id,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email,
                image: user.image || '',
                roles: user.roles || []
            })),
            total,
            page,
            pageSize,
            totalPages
        }
    } catch (error) {
        throw error
    }
}

export const deleteUserById = async (userId: string): Promise<Response> => {
    try {
        const response = await API.delete(`/users/${userId}`, {accessToken: await getAccessToken()})
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to delete user')
        }
        return response
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
}
export const verifyOtp = async (data: VerifyOtpData): Promise<Response> => {
    try {
        const response = await API.post('/verify-otp', {
            accessToken: await getAccessToken(),
            data,
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Échec de la vérification du code OTP')
        }

        return response
    } catch (error) {
        throw error
    }
}

export const resendOtp = async (data: ResendOtpData): Promise<Response> => {
    try {
        const response = await API.post('/resend-otp', {
            accessToken: await getAccessToken(),
            data,
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Échec de l’envoi du nouveau code OTP')
        }

        return response
    } catch (error) {
        throw error
    }
}

export const isValidEmail = async (email: string): Promise<boolean> => {
    try {
        const response = await API.get(`/isValid/${email}`, {accessToken: await getAccessToken()})
        if (!response.ok) {
            return false
        }
        const {isValid} = await response.json()
        if (isValid) {
            return true
        }
        return false
    } catch (error) {
        throw error
    }
}


export const resetPassWord = async (email: string, resetUrl: string): Promise<Response> => {
    try {
        const resetPasswordResponse = await API.put('/reset-password-code', {data: {email}})
        if (!resetPasswordResponse.ok) {
            const errorData = await resetPasswordResponse.json()
            throw new Error(errorData.error || 'Failed to generate reset password code')
        }
        const {resetPasswordCode} = await resetPasswordResponse.json()

        const response = await fetch('/api/reset-password', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, resetUrl: `${resetUrl}?code=${resetPasswordCode}`}),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to reset password')
        }

        return response
    } catch (error) {
        throw error
    }
}
