import {API} from '#/lib/api_requests/fetchRequest'
import {UserProfile, UserRole, VerifyOtpData, ResendOtpData, MultiFriendTypes, Friend} from '#/types/user'
import {getAccessToken} from '../authentification'
import {RegisterUserData} from "#/types/mapbox"
import {buildUrl} from '../utils'

export const getProfile = async (): Promise<UserProfile> => {
    const response = await API.get('/users/me', {accessToken: await getAccessToken()})
    if (!response.ok) {
        throw new Error('Failed to get profile')
    }
    const data = await response.json() as UserProfile
    if (!data) {
        throw new Error('No data found')
    }
    return data
}

export const getMultiFriendTypes = async (userId: number): Promise<MultiFriendTypes> => {
    const response = await API.get(`/users/${userId}/friends`, {accessToken: await getAccessToken()})
    if (!response.ok) {
        throw new Error('Failed to get friends')
    }
    const data = await response.json() as MultiFriendTypes
    if (!data) {
        throw new Error('No data found')
    }
    return data
}

export const getNewFriendByEmail = async (email: string): Promise<Friend | null> => {
    const response = await API.get(`/users/${email}/friend`, {accessToken: await getAccessToken()})
    if (!response.ok) {
        if (response.status === 404) {
            return null
        }
        throw new Error('Failed to get user by email')
    }
    const data = await response.json() as Friend
    if (!data) {
        throw new Error('No data found')
    }
    return data
}

export const sendFriendRequest = async (friendId: number): Promise<Response> => {
    const response = await API.post(`/users/${friendId}/friend-request`, {
        accessToken: await getAccessToken(),
    })
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send friend request')
    }
    return response
}

export const acceptFriendRequest = async (friendId: number): Promise<Response> => {
    const response = await API.post(`/users/${friendId}/accept-friend`, {
        accessToken: await getAccessToken(),
    })
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to accept friend request')
    }
    return response
}

export const refuseFriendRequest = async (friendId: number): Promise<Response> => {
    const response = await API.delete(`/users/${friendId}/refuse-friend`, {
        accessToken: await getAccessToken(),
    })
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to refuse friend request')
    }
    return response
}

export const cancelFriendRequest = async (friendId: number): Promise<Response> => {
    const response = await API.delete(`/users/${friendId}/cancel-friend-request`, {
        accessToken: await getAccessToken(),
    })
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to cancel friend request')
    }
    return response
}

export const removeFriend = async (friendId: number): Promise<Response> => {
    const response = await API.delete(`/users/${friendId}/remove-friend`, {
        accessToken: await getAccessToken(),
    })
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove friend')
    }
    return response
}

export const getRoles = async (): Promise<UserRole[]> => {
    const response = await API.get('/users/me', {accessToken: await getAccessToken()})
    if (!response.ok) {
        throw new Error('Failed to get role')
    }
    const data = await response.json() as UserProfile
    if (!data) {
        throw new Error('No data found')
    }
    return data.roles
}

export const getRoleInArea = async ( userId: number,neighborhoodId: number): Promise<string> => {
    const response = await API.get(`/user-neighborhoods/roleinarea/${userId}/${neighborhoodId}`, {accessToken: await getAccessToken()})
    if (!response.ok) {
        throw new Error('Failed to get role')
    }
    const data = await response.json()
    if (!data || typeof data.role !== 'string') {
        throw new Error('Invalid or missing role in response')
    }
    return data.role
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
    const url = buildUrl('/users', params)
    const response = await API.get(url, {accessToken: await getAccessToken()})
    if (!response.ok) {
        throw new Error('Failed to get users')
    }
    const {users, total, page, pageSize, totalPages} = await response.json()
    return {
        users: users.map((user: UserProfile) => ({
            id: user!.id,
            firstName: user!.firstName || '',
            lastName: user!.lastName || '',
            email: user!.email,
            image: user!.image || '',
            roles: user!.roles || []
        })),
        total,
        page,
        pageSize,
        totalPages
    }
}

export const deleteUserById = async (userId: number): Promise<Response> => {
    const response = await API.delete(`/users/${userId}`, {accessToken: await getAccessToken()})
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete user')
    }
    return response
}

export const updateUser = async (userId: number, data: Partial<UserProfile>): Promise<Response> => {
    const response = await API.put(
        `/users/${userId}`, 
        {accessToken: await getAccessToken(), data}
    )
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update user')
    }
    return response
}

export const registerUser = async (data: RegisterUserData): Promise<Response> => {
    const response = await API.post('/register', {accessToken: await getAccessToken(), data: data})
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to register user')
    }
    return response
}

export const verifyOtp = async (data: VerifyOtpData): Promise<boolean> => {
    const response = await API.post('/verify-otp', {
        accessToken: await getAccessToken(),
        data,
    })
    if (!response.ok) {
        const errorData = await response.json()
        if (response.status === 400 && errorData.error ==="OTP déjà vérifié"){
            return true
        }
        throw new Error(errorData.error || 'Échec de la vérification du code OTP')
    }
    return true
}

export const resendOtp = async (data: ResendOtpData): Promise<Response> => {
    const response = await API.post('/resend-otp', {
        accessToken: await getAccessToken(),
        data,
    })
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Échec de l’envoi du nouveau code OTP')
    }
    return response
}

export const isValidEmail = async (email: string): Promise<boolean> => {
    const response = await API.get(`/isValid/${email}`, {accessToken: await getAccessToken()})
    if (!response.ok) {
        return false
    }
    const {isValid} = await response.json()
    if (isValid) {
        return true
    }
    return false
}

export const resetPassWord = async (email: string, resetUrl: string): Promise<Response> => {
    const resetPasswordResponse = await API.put('/reset-password-code',{ data: { email } })
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
}
