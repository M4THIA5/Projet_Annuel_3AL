import {API} from "#/lib/api_requests/fetchRequest"
import {getAccessToken} from "#/lib/authentification"

export const getJournalPageById = async (id: string): Promise<object> => {
    try {
        const response = await API.get('/journal/' + id, {accessToken: await getAccessToken()})
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

export const createJournal = async (content: object): Promise<object> => {
    try {
        const response = await API.post('/journal/', {accessToken: await getAccessToken(), data: content})
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
export const getJournals = async (): Promise<object> => {
    try {
        const response = await API.get('/journal/', {accessToken: await getAccessToken()})
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

export const deleteJournalById = async (id: string) => {
    try {
        const response = await API.delete('/journal/' + id, {accessToken: await getAccessToken()})
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

export const updateJournal = async (id: string, content: object) => {
    try {
        const response = await API.put('/journal/' + id, {accessToken: await getAccessToken(), data: content})
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
