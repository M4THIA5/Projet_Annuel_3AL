import {API} from "#/lib/api_requests/fetchRequest"
import {getAccessToken} from "#/lib/authentification"
import {Group, GroupUser} from "#/types/chat"

export const createGroupChat = async (form:object): Promise<GroupUser[]> => {
    try {
        const response = await API.post('/chat/group', {accessToken: await getAccessToken(), data: form})
        if (!response.ok) {
            throw new Error('Failed to get page')
        }
        const data = await response.json()
        if (!data) {
            throw new Error('No data found')
        }
        return data
    } catch (error) {
        throw error
    }
}
export const getUserGroups = async (): Promise<Group[]> => {
    try {
        const response = await API.get('/chat/group', {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get page')
        }
        const data = await response.json()
        if (!data) {
            throw new Error('No data found')
        }
        return data.rooms
    } catch (error) {
        throw error
    }
}
export const getAllChatUsers = async (): Promise<GroupUser[]> => {
    try {
        const response = await API.get('/chat/people', {accessToken: await getAccessToken()})
        if (!response.ok) {
            throw new Error('Failed to get page')
        }
        const data = await response.json()
        if (!data) {
            throw new Error('No data found')
        }
        return data
    } catch (error) {
        throw error
    }
}



